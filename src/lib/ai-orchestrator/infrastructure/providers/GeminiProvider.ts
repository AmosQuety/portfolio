import type { IProvider } from '../../core/ports/IProvider.js';
import type { ChatMessage } from '../../core/entities/ChatMessage.js';
import type { CompletionOptions } from '../../core/entities/CompletionOptions.js';
import type { FinalResponse, FinishReason } from '../../core/entities/FinalResponse.js';
import type { StreamResponse } from '../../core/entities/StreamResponse.js';
import type { ProviderCapabilities } from '../../core/entities/ProviderCapabilities.js';
import { createTokenUsage } from '../../core/entities/TokenUsage.js';
import { discoverBestModel } from './GeminiModelSelector.js';

export interface GeminiProviderConfig {
  /** Optional unique identifier for this provider instance. @default 'gemini' */
  readonly id?: string;
  /** Gemini API key. */
  readonly apiKey: string;
  /** Optional default model ID. If omitted, dynamic discovery is used. */
  readonly model?: string;
  /** Request timeout in milliseconds. @default 30_000 */
  readonly timeoutMs?: number;
}

// ── Gemini API Types ─────────────────────────────────────────────────────────

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

interface GeminiSystemInstruction {
  parts: GeminiPart[];
}

interface GeminiGenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  stopSequences?: readonly string[];
}

interface GeminiRequest {
  contents: GeminiContent[];
  systemInstruction?: GeminiSystemInstruction;
  generationConfig?: GeminiGenerationConfig;
}

interface GeminiResponse {
  candidates: Array<{
    content: GeminiContent;
    finishReason?: string;
    index: number;
    safetyRatings?: any[];
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

interface GeminiStreamChunk extends GeminiResponse {}

/**
 * Provider adapter for the Google Gemini API (Vertex AI / Generative Language).
 */
export class GeminiProvider implements IProvider {
  readonly id: string;
  readonly capabilities: ProviderCapabilities = {
    supportsStreaming: true,
    supportsSystemPrompt: true,
    maxContextTokens: 1_048_576,
    supportedModels: ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'],
  };

  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private readonly timeoutMs: number;

  constructor(private readonly config: GeminiProviderConfig) {
    this.id = config.id ?? 'gemini';
    this.timeoutMs = config.timeoutMs ?? 30_000;
  }

  // ── IProvider ──────────────────────────────────────────────────────────────

  async complete(
    messages: readonly ChatMessage[],
    options: CompletionOptions,
  ): Promise<FinalResponse> {
    const blockedModels = new Set<string>();
    let attemptModel = options.model ?? this.config.model ?? await discoverBestModel(this.config.apiKey);
    let lastError: any;

    for (let attempt = 0; attempt < 3; attempt++) {
      const body = this.buildRequestBody(messages, options);
      const url = `${this.baseUrl}/models/${attemptModel}:generateContent?key=${this.config.apiKey}`;

      try {
        const response = await this.fetchWithTimeout(
          url,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          },
          this.timeoutMs,
        );

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Gemini API error ${response.status}: ${errorText}`);
        }

        const data = (await response.json()) as GeminiResponse;
        const candidate = data.candidates?.[0];

        if (!candidate) {
          throw new Error('Gemini returned no candidates');
        }

        return Object.freeze({
          id: crypto.randomUUID(),
          content: candidate.content.parts?.[0]?.text ?? '',
          model: attemptModel,
          provider: this.id,
          usage: createTokenUsage(
            data.usageMetadata?.promptTokenCount ?? 0,
            data.usageMetadata?.candidatesTokenCount ?? 0,
            data.usageMetadata?.totalTokenCount,
          ),
          finishReason: this.mapFinishReason(candidate.finishReason),
          createdAt: new Date().toISOString(),
        });

      } catch (err: any) {
        lastError = err;
        const errorMsg = err.message || '';
        if (errorMsg.includes('429') && errorMsg.includes('limit: 0')) {
          blockedModels.add(attemptModel);
          const nextModel = nextBestModel(attemptModel, blockedModels);
          if (nextModel) {

            attemptModel = nextModel;
            continue;
          }
        }
        throw err;
      }
    }
    
    throw lastError;
  }

  async *stream(
    messages: readonly ChatMessage[],
    options: CompletionOptions,
  ): AsyncIterable<StreamResponse> {
    const model = options.model ?? this.config.model ?? await discoverBestModel(this.config.apiKey);
    const body = this.buildRequestBody(messages, options);
    // Gemini SSE uses alt=sse parameter
    const url = `${this.baseUrl}/models/${model}:streamGenerateContent?alt=sse&key=${this.config.apiKey}`;

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      this.timeoutMs,
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Gemini stream error ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error('Gemini response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const requestId = crypto.randomUUID();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          
          const jsonStr = trimmed.slice(6);
          let chunk: GeminiStreamChunk;
          try {
            chunk = JSON.parse(jsonStr);
          } catch {
            continue;
          }

          const candidate = chunk.candidates?.[0];
          const delta = candidate?.content?.parts?.[0]?.text ?? '';
          const isDone = !!candidate?.finishReason;

          yield Object.freeze({
            id: requestId,
            delta,
            model,
            provider: this.id,
            isDone,
            ...(isDone && chunk.usageMetadata
              ? {
                  usage: createTokenUsage(
                    chunk.usageMetadata.promptTokenCount,
                    chunk.usageMetadata.candidatesTokenCount,
                    chunk.usageMetadata.totalTokenCount,
                  ),
                }
              : {}),
          });
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const model = this.config.model ?? await discoverBestModel(this.config.apiKey);
      const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`;
      const response = await this.fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
          }),
        },
        5000,
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private buildRequestBody(
    messages: readonly ChatMessage[],
    options: CompletionOptions,
  ): GeminiRequest {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system');
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    const contents: GeminiContent[] = conversationMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const body: GeminiRequest = {
      contents,
    };

    if (systemMessage) {
      body.systemInstruction = {
        parts: [{ text: systemMessage.content }],
      };
    }

    if (options.temperature !== undefined || options.maxTokens !== undefined || options.topP !== undefined || options.stop !== undefined) {
      body.generationConfig = {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
        topP: options.topP,
        stopSequences: options.stop,
      };
    }

    return body;
  }

  private mapFinishReason(raw?: string): FinishReason {
    switch (raw) {
      case 'STOP':
      case 'MAX_TOKENS': // We might map this to length if preferred
        return 'stop';
      case 'SAFETY':
      case 'OTHER':
        return 'content_filter';
      case 'RECITATION':
        return 'content_filter';
      default:
        return 'unknown';
    }
  }

  private fetchWithTimeout(
    url: string,
    init: RequestInit,
    timeoutMs: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, { ...init, signal: controller.signal }).finally(() => {
      clearTimeout(timer);
    });
  }
}
