-- Pricing v2: Spotlight $15/week, Map yacht $20/week, Growth $50/month (includes Spotlight + 1 free yacht + AI).
BEGIN;
INSERT INTO rivelo.plans (id,name,price_cents,billing_interval,spotlight_days,ai_reports,sort_order,placement_slot,features,active) VALUES
  ('spotlight','Spotlight',1500,'week',7,false,1,'header','["Your product in the homepage header all week","Promoted spot in Trending","Sponsored badge on your listing","Real visitors, no bots or paid clicks","Renews weekly, cancel anytime"]'::jsonb,true),
  ('yacht','Map yacht',2000,'week',7,false,2,'yacht','["Your logo and name on one of 5 premium yachts on the world map","Every map visitor can click through to your product","Sponsored label, renews weekly, cancel anytime"]'::jsonb,true),
  ('growth','Growth',5000,'month',7,true,3,'header','["Everything in Spotlight (7 days in the homepage header every month)","1 map yacht free all month","AI analysis of your product page and positioning","SEO tracking, monitored for you, with AI suggestions you can apply","Reddit communities and threads where your users are","Monthly growth report"]'::jsonb,true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,price_cents=EXCLUDED.price_cents,billing_interval=EXCLUDED.billing_interval,spotlight_days=EXCLUDED.spotlight_days,ai_reports=EXCLUDED.ai_reports,sort_order=EXCLUDED.sort_order,placement_slot=EXCLUDED.placement_slot,features=EXCLUDED.features,active=true;
UPDATE rivelo.plans SET active=false WHERE id IN ('yacht_day','yacht_week','yacht_month');
-- A Growth payment can create two placements (header + free yacht), so uniqueness is per payment AND slot.
ALTER TABLE rivelo.featured_placements DROP CONSTRAINT IF EXISTS featured_placements_payment_id_key;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='featured_placements_payment_slot_key') THEN
    ALTER TABLE rivelo.featured_placements ADD CONSTRAINT featured_placements_payment_slot_key UNIQUE (payment_id,slot);
  END IF;
END $$;
-- One active booking per yacht, whether bought as the Yacht plan or included with Growth.
DROP INDEX IF EXISTS rivelo.subscriptions_one_per_yacht;
CREATE UNIQUE INDEX subscriptions_one_per_yacht ON rivelo.subscriptions (slot_index)
  WHERE slot_index IS NOT NULL AND plan_id IN ('yacht','growth','yacht_day','yacht_week','yacht_month') AND status IN ('authenticated','active','pending');
INSERT INTO rivelo.schema_migrations (version) VALUES ('007_pricing_v2') ON CONFLICT DO NOTHING;
COMMIT;
