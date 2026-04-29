CREATE TABLE IF NOT EXISTS evidencepack_questionnaires (
  id BIGSERIAL PRIMARY KEY,
  owner_email TEXT NOT NULL,
  title TEXT NOT NULL,
  headers JSONB NOT NULL,
  rows JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS evidencepack_questionnaires_owner_email_idx
  ON evidencepack_questionnaires (owner_email);

