import Elysia from 'elysia';

// ── Types ────────────────────────────────────────────────────────────────────

interface AIModel {
  id: string;
  name: string;
  description: string;
  contextWindow: string;
  capabilities: string[];
  isLatest?: boolean;
}

interface AIProvider {
  name: string;
  slug: string;
  emoji: string;
  models: AIModel[];
  source: 'live' | 'fallback';
}

// ── Hardcoded fallbacks ──────────────────────────────────────────────────────

const ANTHROPIC_MODELS: AIModel[] = [
  {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    description: 'Most capable Claude model for complex tasks',
    contextWindow: '200K',
    capabilities: ['reasoning', 'coding', 'analysis', 'vision'],
    isLatest: true,
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    description: 'Balanced performance and speed',
    contextWindow: '200K',
    capabilities: ['reasoning', 'coding', 'analysis', 'vision'],
    isLatest: true,
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    description: 'Fast and lightweight for simple tasks',
    contextWindow: '200K',
    capabilities: ['summarization', 'classification', 'extraction'],
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    description: 'Previous generation high-intelligence model',
    contextWindow: '200K',
    capabilities: ['reasoning', 'coding', 'analysis', 'vision'],
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Previous generation most capable model',
    contextWindow: '200K',
    capabilities: ['reasoning', 'coding', 'analysis', 'vision'],
  },
];

const OPENAI_FALLBACK: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable multimodal GPT model',
    contextWindow: '128K',
    capabilities: ['reasoning', 'coding', 'vision', 'function-calling'],
    isLatest: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'High capability at lower cost',
    contextWindow: '128K',
    capabilities: ['reasoning', 'coding', 'vision'],
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and affordable for simple tasks',
    contextWindow: '16K',
    capabilities: ['summarization', 'chat', 'extraction'],
  },
  {
    id: 'o3',
    name: 'o3',
    description: 'Advanced reasoning model',
    contextWindow: '200K',
    capabilities: ['advanced-reasoning', 'coding', 'math'],
    isLatest: true,
  },
  {
    id: 'o4-mini',
    name: 'o4-mini',
    description: 'Efficient reasoning model',
    contextWindow: '200K',
    capabilities: ['reasoning', 'coding', 'math'],
    isLatest: true,
  },
];

const GOOGLE_FALLBACK: AIModel[] = [
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Fast multimodal model',
    contextWindow: '1M',
    capabilities: ['reasoning', 'coding', 'vision', 'audio'],
    isLatest: true,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Advanced reasoning with large context',
    contextWindow: '2M',
    capabilities: ['reasoning', 'coding', 'vision', 'long-context'],
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient',
    contextWindow: '1M',
    capabilities: ['summarization', 'classification', 'extraction'],
  },
];

const META_MODELS: AIModel[] = [
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    description: 'Open-weight instruction-tuned model',
    contextWindow: '128K',
    capabilities: ['reasoning', 'coding', 'multilingual'],
    isLatest: true,
  },
  {
    id: 'llama-3.2-90b-vision',
    name: 'Llama 3.2 90B Vision',
    description: 'Multimodal open-weight model',
    contextWindow: '128K',
    capabilities: ['vision', 'reasoning', 'analysis'],
  },
  {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B',
    description: 'Largest open-weight Llama model',
    contextWindow: '128K',
    capabilities: ['reasoning', 'coding', 'multilingual'],
  },
];

const XAI_MODELS: AIModel[] = [
  {
    id: 'grok-3',
    name: 'Grok 3',
    description: 'xAI flagship model with real-time knowledge',
    contextWindow: '131K',
    capabilities: ['reasoning', 'coding', 'real-time-data'],
    isLatest: true,
  },
  {
    id: 'grok-2-vision',
    name: 'Grok 2 Vision',
    description: 'Multimodal Grok model',
    contextWindow: '32K',
    capabilities: ['vision', 'reasoning', 'analysis'],
  },
];

// ── Cache ────────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cache: { data: { providers: AIProvider[]; cachedAt: string }; expiresAt: number } | null =
  null;

// ── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchOpenAIModels(): Promise<AIModel[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('No OPENAI_API_KEY');

  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`OpenAI API ${res.status}`);

  const json = (await res.json()) as { data: { id: string }[] };
  const relevant = json.data
    .filter((m) =>
      ['gpt-4', 'gpt-3.5', 'o1', 'o3', 'o4'].some((prefix) => m.id.startsWith(prefix)),
    )
    .slice(0, 8);

  return relevant.map((m) => ({
    id: m.id,
    name: m.id,
    description: 'OpenAI model',
    contextWindow: 'varies',
    capabilities: ['reasoning', 'coding'],
  }));
}

async function fetchGoogleModels(): Promise<AIModel[]> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error('No GOOGLE_AI_API_KEY');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
  );
  if (!res.ok) throw new Error(`Google AI API ${res.status}`);

  const json = (await res.json()) as { models: { name: string; displayName: string; description?: string }[] };
  const gemini = json.models.filter((m) => m.name.includes('gemini')).slice(0, 6);

  return gemini.map((m) => ({
    id: m.name.replace('models/', ''),
    name: m.displayName,
    description: m.description ?? 'Google Gemini model',
    contextWindow: 'varies',
    capabilities: ['reasoning', 'vision'],
  }));
}

// ── Route ────────────────────────────────────────────────────────────────────

export const modelsRoute = new Elysia().get('/models', async () => {
  if (cache && Date.now() < cache.expiresAt) {
    return cache.data;
  }

  const [openaiResult, googleResult] = await Promise.allSettled([
    fetchOpenAIModels(),
    fetchGoogleModels(),
  ]);

  const providers: AIProvider[] = [
    {
      name: 'OpenAI',
      slug: 'openai',
      emoji: '🟢',
      models: openaiResult.status === 'fulfilled' ? openaiResult.value : OPENAI_FALLBACK,
      source: openaiResult.status === 'fulfilled' ? 'live' : 'fallback',
    },
    {
      name: 'Anthropic',
      slug: 'anthropic',
      emoji: '🟣',
      models: ANTHROPIC_MODELS,
      source: 'fallback',
    },
    {
      name: 'Google',
      slug: 'google',
      emoji: '🔵',
      models: googleResult.status === 'fulfilled' ? googleResult.value : GOOGLE_FALLBACK,
      source: googleResult.status === 'fulfilled' ? 'live' : 'fallback',
    },
    {
      name: 'Meta / Llama',
      slug: 'meta',
      emoji: '🦙',
      models: META_MODELS,
      source: 'fallback',
    },
    {
      name: 'xAI / Grok',
      slug: 'xai',
      emoji: '⚡',
      models: XAI_MODELS,
      source: 'fallback',
    },
  ];

  const data = { providers, cachedAt: new Date().toISOString() };
  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
});
