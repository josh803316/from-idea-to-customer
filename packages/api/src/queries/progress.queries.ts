import { query } from '../db/query.ts';

export interface Progress {
  id: number;
  session_id: string;
  user_id: string | null;
  course_slug: string;
  lesson_slug: string;
  completed: boolean;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Upsert progress for either an authenticated user (user_id) or anonymous session.
 * The two partial unique indexes ensure correct conflict handling for each case.
 */
export async function upsertProgress(
  sessionId: string,
  courseSlug: string,
  lessonSlug: string,
  completed: boolean,
  userId?: string | null,
): Promise<Progress> {
  if (userId) {
    const rows = await query<Progress>`
      INSERT INTO progress (session_id, user_id, course_slug, lesson_slug, completed, completed_at)
      VALUES (${sessionId}, ${userId}, ${courseSlug}, ${lessonSlug}, ${completed}, ${completed ? new Date().toISOString() : null})
      ON CONFLICT (user_id, course_slug, lesson_slug) WHERE user_id IS NOT NULL
      DO UPDATE SET
        completed    = EXCLUDED.completed,
        completed_at = EXCLUDED.completed_at,
        updated_at   = NOW()
      RETURNING *
    `;
    return rows[0];
  }

  const rows = await query<Progress>`
    INSERT INTO progress (session_id, course_slug, lesson_slug, completed, completed_at)
    VALUES (${sessionId}, ${courseSlug}, ${lessonSlug}, ${completed}, ${completed ? new Date().toISOString() : null})
    ON CONFLICT (session_id, course_slug, lesson_slug) WHERE user_id IS NULL
    DO UPDATE SET
      completed    = EXCLUDED.completed,
      completed_at = EXCLUDED.completed_at,
      updated_at   = NOW()
    RETURNING *
  `;
  return rows[0];
}

export async function getProgress(
  courseSlug: string,
  sessionId?: string,
  userId?: string | null,
): Promise<Progress[]> {
  if (userId) {
    return query<Progress>`
      SELECT * FROM progress
      WHERE user_id = ${userId} AND course_slug = ${courseSlug}
      ORDER BY created_at ASC
    `;
  }
  return query<Progress>`
    SELECT * FROM progress
    WHERE session_id = ${sessionId!} AND course_slug = ${courseSlug} AND user_id IS NULL
    ORDER BY created_at ASC
  `;
}
