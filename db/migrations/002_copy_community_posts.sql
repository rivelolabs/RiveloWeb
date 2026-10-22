-- Copy community posts/replies that were stored inside the old catalog JSON blob
-- into the new tables. Read-only on the old data; safe to re-run.
BEGIN;
DO $$ BEGIN
  IF to_regclass('rivelo_directory.catalog_state') IS NOT NULL THEN
    INSERT INTO rivelo.community_posts (id, author_name, email, topic, title, body, status, created_at)
    SELECT (p->>'id')::uuid, left(p->>'author',60), p->>'email', p->>'topic', left(p->>'title',160), left(p->>'body',2000),
           COALESCE(p->>'status','pending'), COALESCE((p->>'createdAt')::timestamptz, now())
    FROM rivelo_directory.catalog_state s, jsonb_array_elements(COALESCE(s.payload->'posts','[]'::jsonb)) p
    WHERE s.id='primary' AND (p->>'id') ~* '^[0-9a-f-]{36}$'
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO rivelo.community_replies (id, post_id, author_name, email, body, status, created_at)
    SELECT (r->>'id')::uuid, (p->>'id')::uuid, left(r->>'author',60), r->>'email', left(r->>'body',2000),
           COALESCE(r->>'status','pending'), COALESCE((r->>'createdAt')::timestamptz, now())
    FROM rivelo_directory.catalog_state s,
         jsonb_array_elements(COALESCE(s.payload->'posts','[]'::jsonb)) p,
         jsonb_array_elements(COALESCE(p->'replies','[]'::jsonb)) r
    WHERE s.id='primary' AND (p->>'id') ~* '^[0-9a-f-]{36}$' AND (r->>'id') ~* '^[0-9a-f-]{36}$'
      AND EXISTS (SELECT 1 FROM rivelo.community_posts cp WHERE cp.id=(p->>'id')::uuid)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
INSERT INTO rivelo.schema_migrations (version) VALUES ('002_copy_community_posts') ON CONFLICT DO NOTHING;
COMMIT;
