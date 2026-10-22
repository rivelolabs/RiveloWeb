-- Map yacht now comes in three lengths: 1 day ($8, one-time), 1 week ($15, renews weekly), 1 month ($40, renews monthly).
BEGIN;
INSERT INTO rivelo.plans (id,name,price_cents,billing_interval,spotlight_days,ai_reports,sort_order,placement_slot,features) VALUES
  ('yacht_day','Map yacht · 1 day',800,'once',1,false,3,'yacht','["Your logo and link on a premium yacht on the world map for 24 hours","Sponsored label","One-time payment, no renewal"]'::jsonb),
  ('yacht_week','Map yacht · 1 week',1500,'week',7,false,4,'yacht','["Your logo and link on a premium yacht on the world map","Renews every week, cancel anytime","Sponsored label"]'::jsonb),
  ('yacht_month','Map yacht · 1 month',4000,'month',31,false,5,'yacht','["Your logo and link on a premium yacht on the world map","Renews every month, cancel anytime","Best value for always-on visibility"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,price_cents=EXCLUDED.price_cents,billing_interval=EXCLUDED.billing_interval,spotlight_days=EXCLUDED.spotlight_days,placement_slot=EXCLUDED.placement_slot,features=EXCLUDED.features,sort_order=EXCLUDED.sort_order,active=true;
UPDATE rivelo.plans SET active=false WHERE id='yacht';
-- One active booking per yacht, whichever length was bought.
DROP INDEX IF EXISTS rivelo.subscriptions_one_per_yacht;
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_one_per_yacht ON rivelo.subscriptions (slot_index)
  WHERE plan_id IN ('yacht','yacht_day','yacht_week','yacht_month') AND status IN ('authenticated','active','pending');
INSERT INTO rivelo.schema_migrations (version) VALUES ('006_yacht_durations') ON CONFLICT DO NOTHING;
COMMIT;
