-- Comments on apps and websites (product detail dialog and product pages).
BEGIN;
CREATE TABLE IF NOT EXISTS rivelo.product_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  text NOT NULL,
  author_id   uuid NOT NULL REFERENCES rivelo.profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  avatar_url  text,
  body        text NOT NULL CHECK (char_length(body) BETWEEN 2 AND 1000),
  status      text NOT NULL DEFAULT 'published' CHECK (status IN ('published','hidden')),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS product_comments_product_idx ON rivelo.product_comments (product_id, created_at DESC) WHERE status='published';
ALTER TABLE rivelo.product_comments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON rivelo.product_comments FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON rivelo.product_comments FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON rivelo.product_comments FROM authenticated; END IF;
END $$;
INSERT INTO rivelo.schema_migrations (version) VALUES ('003_product_comments') ON CONFLICT DO NOTHING;
COMMIT;
