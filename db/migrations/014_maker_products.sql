-- Builders can show more than one product on their page. The main product stays on maker_pages
-- (product_name / product_url / product_description / logo_url); extra products live here.
BEGIN;
CREATE TABLE IF NOT EXISTS rivelo.maker_products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  maker_id    uuid NOT NULL REFERENCES rivelo.maker_pages(id) ON DELETE CASCADE,
  name        text NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  url         text NOT NULL CHECK (url ~ '^https://'),
  logo_url    text,
  description text,
  position    integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS maker_products_maker_idx ON rivelo.maker_products (maker_id, position);
ALTER TABLE rivelo.maker_products ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON rivelo.maker_products FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON rivelo.maker_products FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON rivelo.maker_products FROM authenticated; END IF;
END $$;
INSERT INTO rivelo.schema_migrations (version) VALUES ('014_maker_products') ON CONFLICT DO NOTHING;
COMMIT;
