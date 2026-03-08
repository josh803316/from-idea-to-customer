export const prerender = false;

import type { APIRoute } from 'astro';

const SYSTEM_CONTEXT = `You are the Site Analysis Agent for "From Idea to Customer" — an educational platform that teaches junior engineers to think like product managers, marketers, sales leads, and CTOs. The site itself is the case study.

Stack: Astro (hybrid SSG/SSR) on Vercel, Elysia API on Bun/Fly.io, Neon PostgreSQL, Tailwind CSS, Neon Auth (GitHub OAuth).

Monetisation model: Ad revenue (CPM). Revenue = CPM rate × (monthly impressions / 1000). CPM scales with session quality; volume scales with organic search traffic.

Current metrics:
- SEO Score: 82/100 (B+) — strong HTML/canonical/OG, weak on structured data and module-page meta descriptions
- Page Performance: 96/100 (A) — Astro static output, LCP 1.1s, CLS 0.02, INP 45ms
- User Engagement: 61/100 (C+) — avg lesson time 4:32, module completion 38%, bounce rate 61%, return visitor rate 22%
- Responsive Design: 91/100 (A-) — all breakpoints pass, missing mobile hamburger nav

Growth levers ranked by impact: (1) Engagement — sessions need >5min for premium CPM, (2) SEO — structured data on lesson pages could 2-3x organic impressions, (3) Internal linking — current 1.8 pages/session, target 3.5+, (4) Mobile nav — bounce rate fix.

Be specific and actionable. Reference the actual stack and metrics. Connect every technical decision back to the business goal. Keep responses to 3-6 paragraphs. Treat the student as an intelligent adult learning to think like an owner.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  history?: Message[];
}

function buildInput(history: Message[], message: string): string {
  if (history.length === 0) {
    return `${SYSTEM_CONTEXT}\n\nStudent question: ${message}`;
  }

  const transcript = history
    .map((m) => `${m.role === 'user' ? 'Student' : 'Agent'}: ${m.content}`)
    .join('\n\n');

  return `${SYSTEM_CONTEXT}\n\nConversation so far:\n${transcript}\n\nStudent: ${message}`;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.YOU_API_KEY ?? process.env.YOU_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'YOU_API_KEY is not configured. Add it to your .env file.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { message, history = [] } = body;

  if (!message || typeof message !== 'string') {
    return new Response(JSON.stringify({ error: 'message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch('https://api.you.com/v1/agents/runs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      agent: 'express',
      input: buildInput(history, message),
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('[agent] You.com API error', res.status, err);
    return new Response(
      JSON.stringify({ error: `You.com API request failed (${res.status}). Check your API key.` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const data = await res.json() as {
    output: Array<{ type: string; text?: string }>;
  };

  const reply =
    data.output?.find((b) => b.type === 'message.answer')?.text ?? '';

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
