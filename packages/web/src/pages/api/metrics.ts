export const prerender = false;

import type { APIRoute } from 'astro';
import { SignJWT, importPKCS8 } from 'jose';

// ── Types ──────────────────────────────────────────────────────────────────

export interface LighthouseData {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  lcp: string;
  cls: string;
  inp: string;
  fcp: string;
  strategy: 'mobile' | 'desktop';
  fetchedAt: string;
}

export interface AnalyticsData {
  sessions: number;
  users: number;
  bounceRate: number;
  avgSessionDuration: number; // seconds
  pageViews: number;
  pagesPerSession: number;
  fetchedAt: string;
}

export interface MetricsResponse {
  lighthouse: LighthouseData | null;
  analytics: AnalyticsData | null;
  lighthouseError?: string;
  analyticsError?: string;
}

// ── Cache (module-level, survives warm invocations) ────────────────────────

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: MetricsResponse;
  ts: number;
}

let _cache: CacheEntry | null = null;

function getCached(): MetricsResponse | null {
  if (!_cache) return null;
  if (Date.now() - _cache.ts > CACHE_TTL_MS) {
    _cache = null;
    return null;
  }
  return _cache.data;
}

// ── PSI (Lighthouse) ───────────────────────────────────────────────────────

async function fetchLighthouse(
  siteUrl: string,
  apiKey: string,
): Promise<LighthouseData> {
  const categories = ['performance', 'accessibility', 'best-practices', 'seo']
    .map((c) => `category=${c}`)
    .join('&');

  const url =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(siteUrl)}&strategy=mobile&${categories}&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`PSI API ${res.status}`);

  const data = await res.json() as {
    lighthouseResult: {
      categories: Record<string, { score: number }>;
      audits: Record<string, { displayValue?: string }>;
    };
  };

  const cats = data.lighthouseResult.categories;
  const audits = data.lighthouseResult.audits;

  return {
    performance: Math.round((cats['performance']?.score ?? 0) * 100),
    seo: Math.round((cats['seo']?.score ?? 0) * 100),
    accessibility: Math.round((cats['accessibility']?.score ?? 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
    lcp: audits['largest-contentful-paint']?.displayValue ?? '—',
    cls: audits['cumulative-layout-shift']?.displayValue ?? '—',
    inp: audits['interaction-to-next-paint']?.displayValue ?? '—',
    fcp: audits['first-contentful-paint']?.displayValue ?? '—',
    strategy: 'mobile',
    fetchedAt: new Date().toISOString(),
  };
}

// ── GA4 Data API ───────────────────────────────────────────────────────────

async function getGA4Token(serviceAccountJson: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson) as {
    client_email: string;
    private_key: string;
  };

  const privateKey = await importPKCS8(sa.private_key, 'RS256');

  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(sa.client_email)
    .setSubject(sa.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) throw new Error(`GA4 token exchange failed: ${tokenRes.status}`);
  const { access_token } = await tokenRes.json() as { access_token: string };
  return access_token;
}

async function fetchAnalytics(
  propertyId: string,
  serviceAccountJson: string,
): Promise<AnalyticsData> {
  const token = await getGA4Token(serviceAccountJson);

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViews' },
          { name: 'screenPageViewsPerSession' },
        ],
      }),
    },
  );

  if (!res.ok) throw new Error(`GA4 Data API ${res.status}`);

  const data = await res.json() as {
    totals: Array<{ metricValues: Array<{ value: string }> }>;
  };

  const vals = data.totals?.[0]?.metricValues ?? [];
  const v = (i: number) => parseFloat(vals[i]?.value ?? '0');

  return {
    sessions: Math.round(v(0)),
    users: Math.round(v(1)),
    bounceRate: Math.round(v(2) * 10) / 10,
    avgSessionDuration: Math.round(v(3)),
    pageViews: Math.round(v(4)),
    pagesPerSession: Math.round(v(5) * 10) / 10,
    fetchedAt: new Date().toISOString(),
  };
}

// ── Handler ────────────────────────────────────────────────────────────────

export const GET: APIRoute = async () => {
  const cached = getCached();
  if (cached) {
    return new Response(JSON.stringify(cached), {
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
    });
  }

  const psiKey = import.meta.env.GOOGLE_PSI_API_KEY ?? process.env.GOOGLE_PSI_API_KEY;
  const ga4PropertyId = import.meta.env.GA4_PROPERTY_ID ?? process.env.GA4_PROPERTY_ID;
  // Stored as base64 to avoid newline issues in env vars. Encode with:
  //   base64 -i service-account.json | tr -d '\n'
  const ga4B64 = import.meta.env.GA4_SERVICE_ACCOUNT_B64 ?? process.env.GA4_SERVICE_ACCOUNT_B64;
  const siteUrl = import.meta.env.SITE_URL ?? process.env.SITE_URL ?? 'https://from-idea-to-customer.vercel.app';

  const result: MetricsResponse = { lighthouse: null, analytics: null };

  // Fetch both in parallel, fail independently
  await Promise.all([
    psiKey
      ? fetchLighthouse(siteUrl, psiKey)
          .then((d) => { result.lighthouse = d; })
          .catch((e: Error) => { result.lighthouseError = e.message; })
      : Promise.resolve().then(() => { result.lighthouseError = 'GOOGLE_PSI_API_KEY not configured'; }),

    ga4PropertyId && ga4B64
      ? fetchAnalytics(ga4PropertyId, Buffer.from(ga4B64, 'base64').toString('utf-8'))
          .then((d) => { result.analytics = d; })
          .catch((e: Error) => { result.analyticsError = e.message; })
      : Promise.resolve().then(() => { result.analyticsError = 'GA4_PROPERTY_ID or GA4_SERVICE_ACCOUNT_B64 not configured'; }),
  ]);

  _cache = { data: result, ts: Date.now() };

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
  });
};
