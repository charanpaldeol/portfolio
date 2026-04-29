CREATE TABLE IF NOT EXISTS evidencepack_files (
  id BIGSERIAL PRIMARY KEY,
  owner_email TEXT NOT NULL,
  kind TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  byte_size BIGINT,
  blob_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS evidencepack_files_owner_email_idx
  ON evidencepack_files (owner_email);

