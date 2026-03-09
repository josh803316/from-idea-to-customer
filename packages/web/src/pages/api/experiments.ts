/**
 * /api/experiments — read and write experiment variant assignments.
 *
 * GET  → returns current assignments as JSON
 * POST → { experimentId, variantId } → updates one assignment, sets cookie
 * DELETE → clears all assignments (reset to control)
 *
 * The cookie is HttpOnly=false so the LabPanel can read it client-side for
 * the initial render, but writing always goes through this endpoint so the
 * server controls the format.
 */

export const prerender = false;

import type { APIRoute } from 'astro';
import {
  COOKIE_NAME,
  parseAssignments,
  serializeAssignments,
  experiments,
} from '@/lib/experiments';

const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
  sameSite: 'lax' as const,
  httpOnly: false, // intentionally readable client-side for the LabPanel
};

export const GET: APIRoute = ({ cookies }) => {
  const raw = cookies.get(COOKIE_NAME)?.value;
  const assignments = parseAssignments(raw);
  return new Response(JSON.stringify(assignments), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { experimentId?: string; variantId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { experimentId, variantId } = body;
  if (!experimentId || !variantId) {
    return new Response('Missing experimentId or variantId', { status: 400 });
  }

  const experiment = experiments.find((e) => e.id === experimentId);
  if (!experiment) {
    return new Response(`Unknown experiment: ${experimentId}`, { status: 400 });
  }

  const validVariant = experiment.variants.find((v) => v.id === variantId);
  if (!validVariant) {
    return new Response(`Unknown variant: ${variantId}`, { status: 400 });
  }

  const raw = cookies.get(COOKIE_NAME)?.value;
  const current = parseAssignments(raw);
  const updated = { ...current, [experimentId]: variantId };

  cookies.set(COOKIE_NAME, serializeAssignments(updated), COOKIE_OPTIONS);

  return new Response(JSON.stringify(updated), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = ({ cookies }) => {
  cookies.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  return new Response(JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
  });
};
