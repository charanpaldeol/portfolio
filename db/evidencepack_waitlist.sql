CREATE TABLE IF NOT EXISTS evidencepack_waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  email_normalized TEXT NOT NULL,
  name TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS evidencepack_waitlist_email_normalized_uq
  ON evidencepack_waitlist (email_normalized);

