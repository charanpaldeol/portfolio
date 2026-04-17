-- Run in Neon SQL Editor (or `psql`) once per database.
CREATE TABLE IF NOT EXISTS experience_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_experience_unlocks_created_at ON experience_unlocks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experience_unlocks_email ON experience_unlocks (lower(email));
