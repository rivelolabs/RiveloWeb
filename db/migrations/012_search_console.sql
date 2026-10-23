-- Google Search Console connections for Growth subscribers (read-only scope; refresh token is encrypted by the app).
BEGIN;
CREATE TABLE IF NOT EXISTS rivelo.gsc_connections (
  user_id        uuid PRIMARY KEY,
  google_email   text,
  refresh_token  text NOT NULL,
  site_url       text,
  connected_at   timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE rivelo.gsc_connections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON rivelo.gsc_connections FROM anon, authenticated;
INSERT INTO rivelo.schema_migrations (version) VALUES ('012_search_console') ON CONFLICT DO NOTHING;
COMMIT;
