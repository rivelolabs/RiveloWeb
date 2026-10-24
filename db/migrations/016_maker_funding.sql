-- Builders can say how their product is funded (side project, bootstrapped, pre-seed, seed, Series A+).
BEGIN;
ALTER TABLE rivelo.maker_pages ADD COLUMN IF NOT EXISTS funding text CHECK (funding IN ('side-project','bootstrapped','pre-seed','seed','series-a-plus'));
INSERT INTO rivelo.schema_migrations (version) VALUES ('016_maker_funding') ON CONFLICT DO NOTHING;
COMMIT;
