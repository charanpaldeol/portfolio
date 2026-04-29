CREATE TABLE IF NOT EXISTS evidencepack_customers (
  id BIGSERIAL PRIMARY KEY,
  owner_email TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS evidencepack_customers_owner_email_uq
  ON evidencepack_customers (owner_email);

CREATE UNIQUE INDEX IF NOT EXISTS evidencepack_customers_stripe_customer_id_uq
  ON evidencepack_customers (stripe_customer_id);

CREATE TABLE IF NOT EXISTS evidencepack_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  owner_email TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS evidencepack_subscriptions_owner_email_uq
  ON evidencepack_subscriptions (owner_email);

CREATE UNIQUE INDEX IF NOT EXISTS evidencepack_subscriptions_stripe_subscription_id_uq
  ON evidencepack_subscriptions (stripe_subscription_id);

