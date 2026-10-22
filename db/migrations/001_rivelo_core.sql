-- Rivelo Labs core schema.
-- Lives in its own `rivelo` schema in the Supabase Postgres database. Tables are only
-- reachable from the Next.js server (DATABASE_URL); the public anon/authenticated
-- Supabase roles get no access, and RLS is enabled with no policies as a second guard.
-- Safe to re-run: everything is IF NOT EXISTS / ON CONFLICT.

BEGIN;

CREATE SCHEMA IF NOT EXISTS rivelo;
REVOKE ALL ON SCHEMA rivelo FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON SCHEMA rivelo FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON SCHEMA rivelo FROM authenticated; END IF;
END $$;

CREATE OR REPLACE FUNCTION rivelo.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;

-- ───────────────────────── Users ─────────────────────────
-- One row per signed-in person (Google or X). id = Supabase auth user id.
CREATE TABLE IF NOT EXISTS rivelo.profiles (
  id            uuid PRIMARY KEY,
  email         text,
  full_name     text,
  username      text,
  avatar_url    text,
  provider      text,                       -- 'google' | 'x'
  role          text NOT NULL DEFAULT 'member' CHECK (role IN ('member','admin')),
  marketing_opt_in boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_key ON rivelo.profiles (lower(email)) WHERE email IS NOT NULL;
DROP TRIGGER IF EXISTS profiles_touch ON rivelo.profiles;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON rivelo.profiles FOR EACH ROW EXECUTE FUNCTION rivelo.touch_updated_at();

-- Link to Supabase Auth when it exists (it always does on Supabase): delete profile with the auth user,
-- and create the profile automatically on first sign-in.
DO $$ BEGIN
  IF to_regclass('auth.users') IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='profiles_auth_user_fk') THEN
      ALTER TABLE rivelo.profiles ADD CONSTRAINT profiles_auth_user_fk FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
    END IF;
    CREATE OR REPLACE FUNCTION rivelo.handle_new_auth_user() RETURNS trigger
      LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $f$
    BEGIN
      INSERT INTO rivelo.profiles (id, email, full_name, username, avatar_url, provider)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        NEW.raw_app_meta_data->>'provider'
      )
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    EXCEPTION WHEN others THEN
      RETURN NEW; -- never block sign-in because of the profile copy
    END $f$;
    DROP TRIGGER IF EXISTS rivelo_on_auth_user_created ON auth.users;
    CREATE TRIGGER rivelo_on_auth_user_created AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION rivelo.handle_new_auth_user();
    -- Backfill people who signed in before this migration.
    INSERT INTO rivelo.profiles (id, email, full_name, username, avatar_url, provider, created_at)
    SELECT u.id, u.email,
           COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
           COALESCE(u.raw_user_meta_data->>'user_name', u.raw_user_meta_data->>'preferred_username'),
           COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
           u.raw_app_meta_data->>'provider', u.created_at
    FROM auth.users u
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- ───────────────────────── Plans & billing (Razorpay) ─────────────────────────
CREATE TABLE IF NOT EXISTS rivelo.plans (
  id               text PRIMARY KEY,            -- 'spotlight' | 'growth'
  name             text NOT NULL,
  price_cents      integer NOT NULL CHECK (price_cents > 0),
  currency         text NOT NULL DEFAULT 'USD',
  billing_interval text NOT NULL DEFAULT 'month',
  spotlight_days   integer NOT NULL DEFAULT 0,  -- homepage header days granted per billing cycle
  ai_reports       boolean NOT NULL DEFAULT false,
  features         jsonb NOT NULL DEFAULT '[]'::jsonb,
  active           boolean NOT NULL DEFAULT true,
  sort_order       integer NOT NULL DEFAULT 0
);
INSERT INTO rivelo.plans (id, name, price_cents, spotlight_days, ai_reports, sort_order, features) VALUES
  ('spotlight', 'Spotlight', 1000, 7, false, 1,
   '["Your product in the homepage header for 7 days every month","Promoted spot in Trending","Sponsored badge on your listing","Reach real visitors discovering new apps and websites"]'::jsonb),
  ('growth', 'Growth', 2000, 7, true, 2,
   '["Everything in Spotlight","AI analysis of your product page and positioning","Agentic AI SEO suggestions you can apply","Reddit communities and threads where your users are","Monthly growth report"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price_cents=EXCLUDED.price_cents, spotlight_days=EXCLUDED.spotlight_days,
  ai_reports=EXCLUDED.ai_reports, sort_order=EXCLUDED.sort_order, features=EXCLUDED.features;

CREATE TABLE IF NOT EXISTS rivelo.subscriptions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid NOT NULL REFERENCES rivelo.profiles(id) ON DELETE CASCADE,
  plan_id                  text NOT NULL REFERENCES rivelo.plans(id),
  product_id               text NOT NULL,         -- catalog product/listing id being promoted
  status                   text NOT NULL DEFAULT 'created'
                           CHECK (status IN ('created','authenticated','active','pending','halted','cancelled','completed','expired')),
  razorpay_subscription_id text UNIQUE,
  razorpay_plan_id         text,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean NOT NULL DEFAULT false,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS subscriptions_user_idx ON rivelo.subscriptions (user_id, status);
DROP TRIGGER IF EXISTS subscriptions_touch ON rivelo.subscriptions;
CREATE TRIGGER subscriptions_touch BEFORE UPDATE ON rivelo.subscriptions FOR EACH ROW EXECUTE FUNCTION rivelo.touch_updated_at();

CREATE TABLE IF NOT EXISTS rivelo.payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES rivelo.profiles(id) ON DELETE SET NULL,
  subscription_id     uuid REFERENCES rivelo.subscriptions(id) ON DELETE SET NULL,
  razorpay_payment_id text NOT NULL UNIQUE,
  razorpay_invoice_id text,
  amount_cents        integer NOT NULL,
  currency            text NOT NULL,
  status              text NOT NULL,              -- captured | failed | refunded ...
  created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_subscription_idx ON rivelo.payments (subscription_id);

-- Every webhook delivery is recorded once (idempotency + audit trail).
CREATE TABLE IF NOT EXISTS rivelo.billing_events (
  id          text PRIMARY KEY,                  -- x-razorpay-event-id
  event       text NOT NULL,
  payload     jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

-- ───────────────────────── Paid promotion ─────────────────────────
-- A week (or more) in the homepage header / promoted in Trending.
CREATE TABLE IF NOT EXISTS rivelo.featured_placements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES rivelo.profiles(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES rivelo.subscriptions(id) ON DELETE CASCADE,
  payment_id      text UNIQUE,                   -- one placement per paid cycle
  product_id      text NOT NULL,
  slot            text NOT NULL DEFAULT 'header' CHECK (slot IN ('header','trending')),
  headline        text,
  image_url       text,
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL CHECK (ends_at > starts_at),
  status          text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','paused','cancelled')),
  impressions     integer NOT NULL DEFAULT 0,
  clicks          integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS featured_live_idx ON rivelo.featured_placements (slot, starts_at, ends_at) WHERE status='scheduled';

-- ───────────────────────── Upvotes & trending ─────────────────────────
CREATE TABLE IF NOT EXISTS rivelo.upvotes (
  user_id    uuid NOT NULL REFERENCES rivelo.profiles(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);
CREATE INDEX IF NOT EXISTS upvotes_product_idx ON rivelo.upvotes (product_id, created_at DESC);

-- ───────────────────────── Launches (Product Hunt, Indie Hackers, …) ─────────────────────────
CREATE TABLE IF NOT EXISTS rivelo.launches (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source       text NOT NULL CHECK (source IN ('producthunt','indiehackers','rivelo')),
  external_id  text NOT NULL,
  name         text NOT NULL,
  tagline      text,
  url          text NOT NULL,                    -- the launch page (credit the source)
  website      text,
  image_url    text,
  topics       text[] NOT NULL DEFAULT '{}',
  votes        integer NOT NULL DEFAULT 0,
  comments     integer NOT NULL DEFAULT 0,
  launched_at  timestamptz NOT NULL,
  fetched_at   timestamptz NOT NULL DEFAULT now(),
  hidden       boolean NOT NULL DEFAULT false,
  UNIQUE (source, external_id)
);
CREATE INDEX IF NOT EXISTS launches_recent_idx ON rivelo.launches (launched_at DESC) WHERE NOT hidden;

-- ───────────────────────── Community ─────────────────────────
CREATE TABLE IF NOT EXISTS rivelo.community_posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   uuid REFERENCES rivelo.profiles(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  email       text,                              -- private; for guests / moderation contact
  topic       text NOT NULL,
  title       text NOT NULL,
  body        text NOT NULL,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','rejected')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_posts_feed_idx ON rivelo.community_posts (status, created_at DESC);
DROP TRIGGER IF EXISTS community_posts_touch ON rivelo.community_posts;
CREATE TRIGGER community_posts_touch BEFORE UPDATE ON rivelo.community_posts FOR EACH ROW EXECUTE FUNCTION rivelo.touch_updated_at();

CREATE TABLE IF NOT EXISTS rivelo.community_replies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     uuid NOT NULL REFERENCES rivelo.community_posts(id) ON DELETE CASCADE,
  author_id   uuid REFERENCES rivelo.profiles(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  email       text,
  body        text NOT NULL,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','rejected')),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_replies_post_idx ON rivelo.community_replies (post_id, created_at);

-- ───────────────────────── AI growth reports ($20 plan) ─────────────────────────
CREATE TABLE IF NOT EXISTS rivelo.ai_reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES rivelo.profiles(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES rivelo.subscriptions(id) ON DELETE SET NULL,
  product_id      text NOT NULL,
  kind            text NOT NULL CHECK (kind IN ('analysis','seo','reddit','monthly')),
  status          text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','ready','failed')),
  result          jsonb,
  error           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz
);
CREATE INDEX IF NOT EXISTS ai_reports_user_idx ON rivelo.ai_reports (user_id, created_at DESC);

-- Lock every table down to the server connection only.
DO $$ DECLARE t text; BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname='rivelo' LOOP
    EXECUTE format('ALTER TABLE rivelo.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON rivelo.%I FROM PUBLIC', t);
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN EXECUTE format('REVOKE ALL ON rivelo.%I FROM anon', t); END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN EXECUTE format('REVOKE ALL ON rivelo.%I FROM authenticated', t); END IF;
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS rivelo.schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
INSERT INTO rivelo.schema_migrations (version) VALUES ('001_rivelo_core') ON CONFLICT DO NOTHING;

COMMIT;
