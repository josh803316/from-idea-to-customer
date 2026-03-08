-- Migration: 001_initial_schema
-- Creates the subscribers table for the waitlist feature.

CREATE TABLE IF NOT EXISTS subscribers (
  id         BIGSERIAL    PRIMARY KEY,
  email      TEXT         NOT NULL UNIQUE,
  source     TEXT,                         -- e.g. 'homepage', 'about', 'referral'
  confirmed  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Keep updated_at current automatically.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
