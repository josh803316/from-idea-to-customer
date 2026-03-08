-- Migration: 003_add_user_id_to_progress
-- Adds Neon Auth user_id to progress table.
-- Progress is now keyed by user_id (authenticated) OR session_id (anonymous).
-- Two partial unique indexes replace the old single unique constraint.

ALTER TABLE progress ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Drop old constraint and index
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_session_id_course_slug_lesson_slug_key;
DROP INDEX IF EXISTS progress_session_course_idx;

-- Authenticated users: unique per (user_id, course, lesson)
CREATE UNIQUE INDEX IF NOT EXISTS progress_user_lesson_idx
  ON progress (user_id, course_slug, lesson_slug)
  WHERE user_id IS NOT NULL;

-- Anonymous users: unique per (session_id, course, lesson)
CREATE UNIQUE INDEX IF NOT EXISTS progress_session_lesson_idx
  ON progress (session_id, course_slug, lesson_slug)
  WHERE user_id IS NULL;

-- Lookup indexes
CREATE INDEX IF NOT EXISTS progress_user_course_idx
  ON progress (user_id, course_slug)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS progress_session_course_idx
  ON progress (session_id, course_slug)
  WHERE user_id IS NULL;
