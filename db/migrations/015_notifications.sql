-- In-app notifications: someone upvoted or commented on your product, or replied to your community post.
BEGIN;
CREATE TABLE IF NOT EXISTS rivelo.notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES rivelo.profiles(id) ON DELETE CASCADE,
  kind         text NOT NULL CHECK (kind IN ('upvote','comment','reply')),
  actor_id     uuid REFERENCES rivelo.profiles(id) ON DELETE SET NULL,
  actor_name   text NOT NULL,
  actor_avatar text,
  subject_id   text NOT NULL,          -- product id, or community post id
  title        text NOT NULL,          -- product name or post title
  body         text,                   -- comment / reply excerpt
  href         text NOT NULL,
  read_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON rivelo.notifications (user_id, created_at DESC);
-- One upvote notification per person per product (un-vote / re-vote doesn't spam).
CREATE UNIQUE INDEX IF NOT EXISTS notifications_upvote_once ON rivelo.notifications (user_id, actor_id, subject_id) WHERE kind='upvote';
ALTER TABLE rivelo.notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON rivelo.notifications FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON rivelo.notifications FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON rivelo.notifications FROM authenticated; END IF;
END $$;
INSERT INTO rivelo.schema_migrations (version) VALUES ('015_notifications') ON CONFLICT DO NOTHING;
COMMIT;
