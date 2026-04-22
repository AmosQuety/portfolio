import { getOrchestrator } from '../../src/lib/orchestrator.js';
import { createChatMessage } from '../../src/lib/ai-orchestrator/core/entities/ChatMessage.js';
import { nextBestModel } from '../../src/lib/ai-orchestrator/infrastructure/providers/GeminiModelSelector.js';

/**
 * Netlify Function handler for AI chat requests.
 * Uses the AI Orchestrator to fulfill requests with the GeminiProvider.
 */
export const handler = async (event: any) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { message, sessionId, history, systemPrompt } = JSON.parse(event.body);

    const orchestrator = getOrchestrator();
    
    // Reconstruct memory
    if (history && Array.isArray(history)) {
      const memoryStore = (orchestrator as any).memoryStore;
      if (memoryStore) {
        await memoryStore.clear(sessionId ?? 'portfolio-default');
        for (const msg of history) {
          await memoryStore.append(sessionId ?? 'portfolio-default', createChatMessage({
            id: msg.id ?? crypto.randomUUID(),
            role: msg.role,
            content: msg.content || msg.text,
          }));
        }
      }
    }

    const userMsg = createChatMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
    });

    // We let the Native Orchestrator handle fallbacks via its fallbackProviderIds mechanism
    const response = await orchestrator.complete([userMsg], {
      sessionId: sessionId ?? 'portfolio-default',
      maxTokens: 1024,
      temperature: 0.7,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: response.content }),
    };
  } catch (err) {
    console.error('[assistant] orchestrator error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Assistant is unavailable right now.' }),
    };
  }
};
