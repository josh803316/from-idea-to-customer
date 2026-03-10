import { useState, useEffect } from 'react';

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

interface ModelsResponse {
  providers: AIProvider[];
  cachedAt: string;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

const providerColors: Record<string, { bg: string; border: string; badge: string; text: string }> =
  {
    openai: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
      text: 'text-emerald-700',
    },
    anthropic: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-700',
      text: 'text-purple-700',
    },
    google: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      text: 'text-blue-700',
    },
    meta: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-700',
      text: 'text-indigo-700',
    },
    xai: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-700',
      text: 'text-gray-700',
    },
  };

function ProviderSection({ provider }: { provider: AIProvider }) {
  const colors = providerColors[provider.slug] ?? providerColors.xai;
  return (
    <div className={`border rounded-2xl p-5 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{provider.emoji}</span>
          <h3 className={`font-semibold ${colors.text}`}>{provider.name}</h3>
        </div>
        {provider.source === 'live' && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            live
          </span>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {provider.models.slice(0, 4).map((model) => (
          <div key={model.id} className="bg-white rounded-xl p-3 border border-white/60">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-gray-900 leading-tight">{model.name}</p>
              {model.isLatest && (
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${colors.badge}`}>
                  latest
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{model.description}</p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                {model.contextWindow} ctx
              </span>
              {model.capabilities.slice(0, 2).map((cap) => (
                <span key={cap} className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonProvider() {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-7 h-7" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-gray-100">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LiveModels() {
  const [data, setData] = useState<ModelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/models')
      .then((r) => r.json())
      .then((d: ModelsResponse) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        Could not load live model data. Check that the API is running.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Foundation models
        </p>
        {data && (
          <span className="text-xs text-gray-400">
            updated {new Date(data.cachedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {loading
        ? Array.from({ length: 3 }).map((_, i) => <SkeletonProvider key={i} />)
        : data?.providers.map((p) => <ProviderSection key={p.slug} provider={p} />)}
    </div>
  );
}
