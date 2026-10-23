-- Allow Show HN posts on the New launches page.
BEGIN;
ALTER TABLE rivelo.launches DROP CONSTRAINT IF EXISTS launches_source_check;
ALTER TABLE rivelo.launches ADD CONSTRAINT launches_source_check CHECK (source IN ('producthunt','indiehackers','rivelo','hackernews'));
INSERT INTO rivelo.schema_migrations (version) VALUES ('009_hackernews_launches') ON CONFLICT DO NOTHING;
COMMIT;
