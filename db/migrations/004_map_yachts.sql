-- Five bookable yachts on the world map (monthly subscription per yacht).
BEGIN;
ALTER TABLE rivelo.plans ADD COLUMN IF NOT EXISTS placement_slot text NOT NULL DEFAULT 'header';
ALTER TABLE rivelo.subscriptions ADD COLUMN IF NOT EXISTS slot_index integer CHECK (slot_index BETWEEN 1 AND 5);
ALTER TABLE rivelo.featured_placements ADD COLUMN IF NOT EXISTS slot_index integer CHECK (slot_index BETWEEN 1 AND 5);
ALTER TABLE rivelo.featured_placements DROP CONSTRAINT IF EXISTS featured_placements_slot_check;
ALTER TABLE rivelo.featured_placements ADD CONSTRAINT featured_placements_slot_check CHECK (slot IN ('header','trending','yacht'));
INSERT INTO rivelo.plans (id,name,price_cents,spotlight_days,ai_reports,sort_order,placement_slot,features) VALUES
  ('yacht','Map yacht',1500,31,false,3,'yacht','["Your product sails on one of 5 yachts on the Rivelo world map","Logo, name and link on the yacht, visible to every map visitor","Sponsored label, renews monthly, cancel anytime"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,spotlight_days=EXCLUDED.spotlight_days,placement_slot=EXCLUDED.placement_slot,features=EXCLUDED.features,sort_order=EXCLUDED.sort_order;
-- One active booking per yacht.
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_one_per_yacht ON rivelo.subscriptions (slot_index)
  WHERE plan_id='yacht' AND status IN ('authenticated','active','pending');
INSERT INTO rivelo.schema_migrations (version) VALUES ('004_map_yachts') ON CONFLICT DO NOTHING;
COMMIT;
