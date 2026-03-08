import { useState, useEffect } from 'react';
import type { MetricsResponse, LighthouseData, AnalyticsData } from '@/pages/api/metrics';

// ── Helpers ────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 90) return 'text-green-700';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function scoreBg(score: number): string {
  if (score >= 90) return 'bg-green-50 border-green-200';
  if (score >= 50) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

function scoreBar(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 50) return 'bg-amber-400';
  return 'bg-red-500';
}

function fmtDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}m ${s}s`;
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

// ── Lighthouse card ────────────────────────────────────────────────────────

function LighthouseCard({ data, error }: { data: LighthouseData | null; error?: string }) {
  const scores = data
    ? [
        { label: 'Performance', value: data.performance },
        { label: 'SEO', value: data.seo },
        { label: 'Accessibility', value: data.accessibility },
        { label: 'Best Practices', value: data.bestPractices },
      ]
    : null;

  const vitals = data
    ? [
        { label: 'LCP', value: data.lcp, tip: 'Largest Contentful Paint — should be ≤2.5s' },
        { label: 'CLS', value: data.cls, tip: 'Cumulative Layout Shift — should be ≤0.1' },
        { label: 'INP', value: data.inp, tip: 'Interaction to Next Paint — should be ≤200ms' },
        { label: 'FCP', value: data.fcp, tip: 'First Contentful Paint' },
      ]
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">Lighthouse (mobile)</h3>
          <p className="text-xs text-gray-400 mt-0.5">via Google PageSpeed Insights</p>
        </div>
        {data && (
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
            {timeAgo(data.fetchedAt)}
          </span>
        )}
      </div>

      {error && !data && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          {error.includes('not configured')
            ? 'Add GOOGLE_PSI_API_KEY to enable live Lighthouse scores.'
            : `Error: ${error}`}
        </p>
      )}

      {/* Score dials */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {scores
          ? scores.map((s) => (
              <div
                key={s.label}
                className={`border rounded-xl p-3 text-center ${scoreBg(s.value)}`}
              >
                <div className={`text-2xl font-bold ${scoreColor(s.value)}`}>{s.value}</div>
                <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
                <div className="h-1 bg-black/10 rounded-full mt-2">
                  <div
                    className={`h-1 rounded-full ${scoreBar(s.value)}`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3 text-center">
                <Skeleton className="h-7 w-10 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
      </div>

      {/* Core Web Vitals */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Core Web Vitals
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vitals
            ? vitals.map((v) => (
                <div key={v.label} className="text-center" title={v.tip}>
                  <div className="text-sm font-semibold text-gray-800">{v.value}</div>
                  <div className="text-xs text-gray-400">{v.label}</div>
                </div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto mb-1" />
                  <Skeleton className="h-3 w-8 mx-auto" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

// ── Analytics card ─────────────────────────────────────────────────────────

function AnalyticsCard({ data, error }: { data: AnalyticsData | null; error?: string }) {
  const stats = data
    ? [
        { label: 'Sessions', value: fmtNum(data.sessions), sub: 'last 30 days' },
        { label: 'Users', value: fmtNum(data.users), sub: 'unique' },
        { label: 'Bounce Rate', value: `${data.bounceRate}%`, sub: 'target <50%' },
        { label: 'Avg Session', value: fmtDuration(data.avgSessionDuration), sub: 'target >5m' },
        { label: 'Page Views', value: fmtNum(data.pageViews), sub: 'last 30 days' },
        { label: 'Pages/Session', value: String(data.pagesPerSession), sub: 'target 3.5+' },
      ]
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">Engagement</h3>
          <p className="text-xs text-gray-400 mt-0.5">via Google Analytics 4 · 30-day window</p>
        </div>
        {data && (
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
            {timeAgo(data.fetchedAt)}
          </span>
        )}
      </div>

      {error && !data && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          {error.includes('not configured')
            ? 'Add GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_B64 to enable live analytics.'
            : `Error: ${error}`}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats
          ? stats.map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs font-medium text-gray-700 mt-0.5">{s.label}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            ))
          : Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                <Skeleton className="h-6 w-14 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
      </div>
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────

export default function LiveMetrics() {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then((r) => r.json())
      .then((d: MetricsResponse) => setData(d))
      .catch(() => setData({ lighthouse: null, analytics: null }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Live site metrics
        </p>
        {!loading && (
          <button
            onClick={() => {
              setLoading(true);
              setData(null);
              fetch('/api/metrics?bust=' + Date.now())
                .then((r) => r.json())
                .then((d: MetricsResponse) => setData(d))
                .catch(() => setData({ lighthouse: null, analytics: null }))
                .finally(() => setLoading(false));
            }}
            className="text-xs text-gray-400 hover:text-brand-600 transition-colors"
          >
            ↻ Refresh
          </button>
        )}
      </div>

      <LighthouseCard
        data={loading ? null : (data?.lighthouse ?? null)}
        error={data?.lighthouseError}
      />
      <AnalyticsCard
        data={loading ? null : (data?.analytics ?? null)}
        error={data?.analyticsError}
      />

      <p className="text-xs text-gray-400 text-center">
        Scores cached for 1 hour &middot; Lighthouse runs against the live production URL
      </p>
    </div>
  );
}
