-- Maker pages built from replies to an X post ("drop your startup").
BEGIN;
CREATE TABLE IF NOT EXISTS rivelo.maker_pages (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  x_user_id           text UNIQUE,
  username            text NOT NULL,
  name                text NOT NULL,
  bio                 text,
  avatar_url          text,
  followers           integer,
  website             text,
  source_post_url     text,
  source_author       text,
  reply_text          text,
  product_name        text,
  product_url         text,
  product_description text,
  city                text,
  lat                 double precision CHECK (lat BETWEEN -85 AND 85),
  lng                 double precision CHECK (lng BETWEEN -180 AND 180),
  status              text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','claimed','hidden')),
  claimed_by          uuid REFERENCES rivelo.profiles(id) ON DELETE SET NULL,
  claimed_at          timestamptz,
  invited_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS maker_pages_username_key ON rivelo.maker_pages (lower(username));
CREATE INDEX IF NOT EXISTS maker_pages_status_idx ON rivelo.maker_pages (status, created_at DESC);
DROP TRIGGER IF EXISTS maker_pages_touch ON rivelo.maker_pages;
CREATE TRIGGER maker_pages_touch BEFORE UPDATE ON rivelo.maker_pages FOR EACH ROW EXECUTE FUNCTION rivelo.touch_updated_at();
ALTER TABLE rivelo.maker_pages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON rivelo.maker_pages FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON rivelo.maker_pages FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON rivelo.maker_pages FROM authenticated; END IF;
END $$;
INSERT INTO rivelo.schema_migrations (version) VALUES ('005_maker_pages') ON CONFLICT DO NOTHING;
COMMIT;
