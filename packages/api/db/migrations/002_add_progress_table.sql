-- Migration: 002_add_progress_table
-- Tracks lesson completion per anonymous session.
-- No user accounts required: session_id is a client-generated UUID stored in a cookie.

CREATE TABLE IF NOT EXISTS progress (
  id           BIGSERIAL    PRIMARY KEY,
  session_id   TEXT         NOT NULL,
  course_slug  TEXT         NOT NULL,
  lesson_slug  TEXT         NOT NULL,
  completed    BOOLEAN      NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  -- One row per (session, course, lesson) — upserted on repeat completions.
  UNIQUE (session_id, course_slug, lesson_slug)
);

CREATE INDEX IF NOT EXISTS progress_session_course_idx
  ON progress (session_id, course_slug);

CREATE TRIGGER progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
