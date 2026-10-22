-- Dodo Payments support: remember which provider a subscription belongs to.
BEGIN;
ALTER TABLE rivelo.subscriptions ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'razorpay';
-- razorpay_subscription_id / razorpay_payment_id now hold the provider's ids for either provider.
COMMENT ON COLUMN rivelo.subscriptions.razorpay_subscription_id IS 'Payment provider subscription id (Razorpay or Dodo)';
COMMENT ON COLUMN rivelo.payments.razorpay_payment_id IS 'Payment provider payment id (Razorpay or Dodo)';
INSERT INTO rivelo.schema_migrations (version) VALUES ('008_dodo_payments') ON CONFLICT DO NOTHING;
COMMIT;
