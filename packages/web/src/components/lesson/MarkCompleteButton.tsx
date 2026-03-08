/**
 * MarkCompleteButton — React island on lesson pages.
 *
 * Behaviour:
 * - If signed in: gets a JWT from Neon Auth, sends it with the request so
 *   progress is persisted to the database under the user's account.
 * - If anonymous: request has no token; Astro endpoint falls back to cookie.
 *
 * This single component works correctly in both states with no extra config.
 */

import { useState } from 'react';
import { authClient } from '@/lib/auth';

interface Props {
  courseSlug: string;
  lessonSlug: string;
  initialCompleted?: boolean;
}

export default function MarkCompleteButton({ courseSlug, lessonSlug, initialCompleted = false }: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (completed || loading) return;
    setLoading(true);

    try {
      // Get a JWT if the user is signed in (null if anonymous)
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const tokenResult = await authClient.token().catch(() => null);
      if (tokenResult?.data?.token) {
        headers['Authorization'] = `Bearer ${tokenResult.data.token}`;
      }

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers,
        body: JSON.stringify({ courseSlug, lessonSlug }),
      });

      if (res.ok) {
        setCompleted(true);
      }
    } catch (err) {
      console.error('Failed to mark complete:', err);
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <div className="flex items-center gap-2 text-green-700 font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Lesson complete</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Saving…' : 'Mark as complete'}
    </button>
  );
}
