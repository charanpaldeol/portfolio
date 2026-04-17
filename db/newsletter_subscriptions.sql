-- Run in Neon SQL Editor (or `psql`) once per database.
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  email_normalized TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'inline',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email_normalized),
  CONSTRAINT newsletter_subscriptions_source_check CHECK (source IN ('footer', 'inline'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_created_at ON newsletter_subscriptions (created_at DESC);
