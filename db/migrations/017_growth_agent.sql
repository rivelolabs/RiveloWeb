-- Growth plan: Claude agent (SEO / GEO only) with a monthly AI credit cap, AI-visibility tracking and the sales agent.
BEGIN;
-- Every Claude call, with its cost (micro-dollars). The monthly cap is enforced from this table.
CREATE TABLE IF NOT EXISTS rivelo.ai_usage (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES rivelo.profiles(id) ON DELETE CASCADE,
  task          text NOT NULL,
  input_tokens  integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  searches      integer NOT NULL DEFAULT 0,
  cost_micros   integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_usage_user_month_idx ON rivelo.ai_usage (user_id, created_at DESC);
-- What the agent works on: the product, its category, competitors, buyer questions and ideal customer.
CREATE TABLE IF NOT EXISTS rivelo.ai_settings (
  user_id      uuid PRIMARY KEY REFERENCES rivelo.profiles(id) ON DELETE CASCADE,
  product_name text NOT NULL DEFAULT '',
  site_url     text NOT NULL DEFAULT '',
  category     text NOT NULL DEFAULT '',
  description  text NOT NULL DEFAULT '',
  competitors  text[] NOT NULL DEFAULT '{}',
  questions    text[] NOT NULL DEFAULT '{}',
  audience     text NOT NULL DEFAULT '',
  weekly_email boolean NOT NULL DEFAULT true,
  updated_at   timestamptz NOT NULL DEFAULT now()
);
-- Saved agent output: visibility runs, rewrites, keyword ideas, outlines, llms.txt, leads, conversations, drafts, weekly reports.
CREATE TABLE IF NOT EXISTS rivelo.ai_results (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES rivelo.profiles(id) ON DELETE CASCADE,
  kind       text NOT NULL,
  payload    jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_results_user_kind_idx ON rivelo.ai_results (user_id, kind, created_at DESC);
ALTER TABLE rivelo.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE rivelo.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rivelo.ai_results ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON rivelo.ai_usage, rivelo.ai_settings, rivelo.ai_results FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON rivelo.ai_usage, rivelo.ai_settings, rivelo.ai_results FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON rivelo.ai_usage, rivelo.ai_settings, rivelo.ai_results FROM authenticated; END IF;
END $$;
INSERT INTO rivelo.schema_migrations (version) VALUES ('017_growth_agent') ON CONFLICT DO NOTHING;
COMMIT;
