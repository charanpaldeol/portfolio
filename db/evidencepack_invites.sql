CREATE TABLE IF NOT EXISTS evidencepack_invites (
  id BIGSERIAL PRIMARY KEY,
  invited_email TEXT NOT NULL,
  invited_email_normalized TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS evidencepack_invites_email_normalized_uq
  ON evidencepack_invites (invited_email_normalized);

