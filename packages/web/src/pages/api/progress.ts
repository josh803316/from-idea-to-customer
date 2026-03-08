/**
 * Astro SSR endpoint: read and write lesson progress.
 *
 * GET  /api/progress?course=<slug>  → { completedLessons: string[] }
 * POST /api/progress                → { courseSlug, lessonSlug } → marks complete
 *
 * Auth: reads JWT from Authorization header (set by MarkCompleteButton).
 * If authenticated → progress is stored server-side via Elysia API using user_id.
 * If anonymous    → progress is stored in the fitc_progress cookie (client-only).
 */

export const prerender = false;

import type { APIRoute } from 'astro';
import { parseProgress, markComplete, serializeProgress, getProgress } from '@/lib/progress';
import { verifyJwt, extractBearer } from '@/lib/verify-jwt';

const COOKIE_NAME = 'fitc_progress';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const API_URL = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const courseSlug = url.searchParams.get('course');

  // Try authenticated path
  const token = extractBearer(request);
  const sessionId = cookies.get('fitc_session')?.value;

  if (token) {
    const user = await verifyJwt(token);
    if (user && courseSlug) {
      const res = await fetch(`${API_URL}/progress/${courseSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { progress } = await res.json() as { progress: Array<{ lesson_slug: string; completed: boolean }> };
        return new Response(
          JSON.stringify({ completedLessons: progress.filter(p => p.completed).map(p => p.lesson_slug) }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      }
    }
  }

  // Anonymous: cookie-based
  const store = parseProgress(cookies.get(COOKIE_NAME)?.value);
  if (courseSlug) {
    return new Response(JSON.stringify(getProgress(store, courseSlug)), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(store), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { courseSlug?: string; lessonSlug?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { courseSlug, lessonSlug } = body;
  if (!courseSlug || !lessonSlug) {
    return new Response(JSON.stringify({ error: 'courseSlug and lessonSlug are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Authenticated: proxy to Elysia API (persists to DB)
  const token = extractBearer(request);
  if (token) {
    const user = await verifyJwt(token);
    if (user) {
      let sessionId = cookies.get('fitc_session')?.value;
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        cookies.set('fitc_session', sessionId, { path: '/', maxAge: COOKIE_MAX_AGE, httpOnly: true, sameSite: 'lax', secure: import.meta.env.PROD });
      }
      await fetch(`${API_URL}/progress/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionId, courseSlug, lessonSlug, completed: true }),
      });
      return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
    }
  }

  // Anonymous: update cookie
  const store = parseProgress(cookies.get(COOKIE_NAME)?.value);
  const updated = markComplete(store, courseSlug, lessonSlug);
  cookies.set(COOKIE_NAME, serializeProgress(updated), {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    httpOnly: false,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  });

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
};
