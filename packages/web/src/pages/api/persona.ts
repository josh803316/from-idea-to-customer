export const prerender = false;

import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';

const DB_URL = import.meta.env.DATABASE_URL ?? process.env.DATABASE_URL ?? '';

async function getDb() {
  const sql = neon(DB_URL);
  // Ensure table exists (idempotent)
  await sql`
    CREATE TABLE IF NOT EXISTS persona_preferences (
      session_id TEXT PRIMARY KEY,
      persona_slug TEXT NOT NULL DEFAULT 'founder',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  return sql;
}

// GET /api/persona?sessionId=<id>
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    return json({ error: 'sessionId required' }, 400);
  }

  try {
    const sql = await getDb();
    const rows = await sql`
      SELECT persona_slug FROM persona_preferences WHERE session_id = ${sessionId}
    `;
    const slug = rows[0]?.persona_slug ?? null;
    return json({ slug });
  } catch (e) {
    console.error('[persona GET]', e);
    return json({ slug: null });
  }
};

// POST /api/persona  body: { sessionId, slug }
export const POST: APIRoute = async ({ request }) => {
  let body: { sessionId?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { sessionId, slug } = body;
  if (!sessionId || !slug) {
    return json({ error: 'sessionId and slug required' }, 400);
  }

  try {
    const sql = await getDb();
    await sql`
      INSERT INTO persona_preferences (session_id, persona_slug, updated_at)
      VALUES (${sessionId}, ${slug}, NOW())
      ON CONFLICT (session_id)
      DO UPDATE SET persona_slug = ${slug}, updated_at = NOW()
    `;
    return json({ slug });
  } catch (e) {
    console.error('[persona POST]', e);
    return json({ slug });
  }
};

// DELETE /api/persona?sessionId=<id>
export const DELETE: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) return json({ error: 'sessionId required' }, 400);

  try {
    const sql = await getDb();
    await sql`DELETE FROM persona_preferences WHERE session_id = ${sessionId}`;
    return json({ reset: true });
  } catch (e) {
    console.error('[persona DELETE]', e);
    return json({ reset: true });
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
