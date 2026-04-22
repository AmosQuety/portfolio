import { ChatOrchestrator } from './ai-orchestrator/core/orchestration/ChatOrchestrator.js';
import { ProviderRegistry } from './ai-orchestrator/core/registry/ProviderRegistry.js';
import { IntelligentRouter } from './ai-orchestrator/infrastructure/routing/IntelligentRouter.js';
import { CircuitBreaker } from './ai-orchestrator/infrastructure/resilience/CircuitBreaker.js';
import { WindowMemoryStore } from './ai-orchestrator/infrastructure/context/WindowMemoryStore.js';
import { ContextBuilder } from './ai-orchestrator/infrastructure/context/ContextBuilder.js';
import { TelemetryService } from './ai-orchestrator/infrastructure/telemetry/TelemetryService.js';
import { InMemoryTelemetryStore } from './ai-orchestrator/infrastructure/telemetry/InMemoryTelemetryStore.js';
import { NoopLogger } from './ai-orchestrator/infrastructure/logging/NoopLogger.js';
import { GeminiProvider } from './ai-orchestrator/infrastructure/providers/GeminiProvider.js';
import { buildBaseSystemPrompt } from './profilePrompt';

const SYSTEM_PROMPT = buildBaseSystemPrompt();

let _orchestrator: ChatOrchestrator | null = null;

export function getOrchestrator(): ChatOrchestrator {
  if (_orchestrator) return _orchestrator;

  const runtimeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const rawKeys = (runtimeEnv.GEMINI_API_KEYS || runtimeEnv.GEMINI_API_KEY || '').replace(/^"|"$/g, '');
  const keys = rawKeys.split(',').map((k: string) => k.trim()).filter(Boolean);

  if (keys.length === 0) {
    throw new Error('No Gemini API keys found in environment variables.');
  }



  const registry = new ProviderRegistry();
  const providers: GeminiProvider[] = [];

  for (let i = 0; i < keys.length; i++) {
    const p = new GeminiProvider({
      id: `gemini-${i + 1}`,
      apiKey: keys[i],
    });
    registry.register(p);
    providers.push(p);
  }

  const circuitBreaker = new CircuitBreaker();
  const router = new IntelligentRouter(
    {
      entries: providers.map(p => ({
        provider: p,
        costFactor: 1.0,
        priority: 1,
        quotaLimit: 0,
        quotaWindowMs: 60_000
      })),
      failoverChain: providers.map(p => p.id),
      costWeight: 1,
      latencyWeight: 1,
      errorRateWeight: 1
    },
    circuitBreaker,
  );

  const memoryStore = new WindowMemoryStore({ maxMessagesPerSession: 50 });
  const contextBuilder = new ContextBuilder(
    memoryStore,
    new Map(providers.map(p => [p.id, p])),
    {
      systemPrompt: SYSTEM_PROMPT,
      reservedResponseTokens: 2048,
      minMessagesToKeep: 4,
      maxDocumentChunks: 0,
      documentChunkSeparator: '\n\n'
    },
  );

  const telemetry = new TelemetryService(new InMemoryTelemetryStore(), new NoopLogger());

  _orchestrator = new ChatOrchestrator(
    router,
    circuitBreaker,
    registry,
    telemetry,
    { fallbackProviderIds: providers.map(p => p.id), retryConfig: { maxAttempts: 2, baseDelayMs: 300, maxDelayMs: 5000, jitterFactor: 0.2 } },
    contextBuilder,
    memoryStore,
  );

  return _orchestrator;
}
