/**
 * /api/flags — read and write feature flag overrides.
 *
 * GET    → returns current flag states (merged with defaults) as JSON
 * POST   → { flagId, enabled: boolean } → updates one flag override
 * DELETE → clears all overrides (reset everything to defaults)
 */

export const prerender = false;

import type { APIRoute } from 'astro';
import {
  FLAGS_COOKIE,
  featureFlags,
  parseOverrides,
  serializeOverrides,
  isFlagEnabled,
  setFlag,
} from '@/lib/flags';

const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
  sameSite: 'lax' as const,
  httpOnly: false,
};

export const GET: APIRoute = ({ cookies }) => {
  const raw = cookies.get(FLAGS_COOKIE)?.value;
  const overrides = parseOverrides(raw);

  // Return the full resolved state (not just overrides) so the client
  // doesn't need to know about defaults
  const resolved = Object.fromEntries(
    featureFlags.map((f) => [f.id, isFlagEnabled(overrides, f.id)]),
  );

  return new Response(JSON.stringify(resolved), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { flagId?: string; enabled?: boolean };
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { flagId, enabled } = body;
  if (!flagId || typeof enabled !== 'boolean') {
    return new Response('Missing flagId or enabled', { status: 400 });
  }

  if (!featureFlags.find((f) => f.id === flagId)) {
    return new Response(`Unknown flag: ${flagId}`, { status: 400 });
  }

  const raw = cookies.get(FLAGS_COOKIE)?.value;
  const current = parseOverrides(raw);
  const updated = setFlag(current, flagId, enabled);

  cookies.set(FLAGS_COOKIE, serializeOverrides(updated), COOKIE_OPTIONS);

  return new Response(JSON.stringify({ [flagId]: enabled }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = ({ cookies }) => {
  cookies.set(FLAGS_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  return new Response(JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
  });
};
