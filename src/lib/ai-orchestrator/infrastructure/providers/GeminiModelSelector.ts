/**
 * GeminiModelSelector
 * ─────────────────────────────────────────────────────────────────────────────
 * Queries the Gemini `models.list` endpoint to discover the best available 
 * model that is available for the caller's API key.
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const CACHE_TTL_MS = 5 * 60 * 1_000; // 5 minutes

/**
 * Ordered list of preferred flash model IDs.
 */
export const RANKED_FLASH_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
] as const;

export type RankedFlashModel = (typeof RANKED_FLASH_MODELS)[number];

interface CacheEntry {
  model: string;
  expiresAt: number;
}

let cache: CacheEntry | undefined;

interface GeminiModelListItem {
  name: string;                           
  supportedGenerationMethods?: string[];  
}

interface GeminiModelListResponse {
  models?: GeminiModelListItem[];
}

/**
 * Calls `GET /v1/models` and returns the best available flash model ID.
 * Falls back to 'gemini-2.0-flash' on error.
 */
export async function discoverBestModel(apiKey: string): Promise<string> {
  // Try hit cache
  if (cache && Date.now() < cache.expiresAt) {
    return cache.model;
  }

  try {
    const url = `${GEMINI_API_BASE}/models?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {

      return cacheAndReturn('gemini-2.0-flash');
    }

    const data: GeminiModelListResponse = await res.json();
    const available = new Set(
      (data.models ?? [])
        .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m) => m.name.replace(/^models\//, ''))
    );

    // Pick best from our ranked preference list
    for (const candidate of RANKED_FLASH_MODELS) {
      if (available.has(candidate)) {
        return cacheAndReturn(candidate);
      }
    }

    // None of our favorites found — pick any Flash variant or fallback
    const anyFlash = [...available].find((n) => n.toLowerCase().includes('flash'));
    return cacheAndReturn(anyFlash ?? 'gemini-2.0-flash');
  } catch (err) {

    return cacheAndReturn('gemini-2.0-flash');
  }
}

/**
 * Returns the next best model in the ranked list after `currentModel`,
 * skipping any that are in `blocked`.
 */
export function nextBestModel(
  currentModel: string,
  blocked: ReadonlySet<string>
): string | undefined {
  const startIdx = RANKED_FLASH_MODELS.indexOf(currentModel as RankedFlashModel);
  const searchFrom = startIdx === -1 ? 0 : startIdx + 1;

  for (let i = searchFrom; i < RANKED_FLASH_MODELS.length; i++) {
    const candidate = RANKED_FLASH_MODELS[i];
    if (!blocked.has(candidate)) return candidate;
  }
  return undefined;
}

/**
 * Manually invalidate the cache (e.g. after a model is found to be blocked).
 */
export function invalidateCache(): void {
  cache = undefined;
}

function cacheAndReturn(model: string): string {
  cache = { model, expiresAt: Date.now() + CACHE_TTL_MS };
  return model;
}
