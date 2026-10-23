-- Short holds while someone is in checkout, so two people can't pay for the same yacht or the last Spotlight spot.
BEGIN;
CREATE TABLE IF NOT EXISTS rivelo.slot_holds (
  id          bigserial PRIMARY KEY,
  kind        text NOT NULL CHECK (kind IN ('yacht','spotlight')),
  slot_index  int,
  user_id     uuid NOT NULL,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS slot_holds_live_idx ON rivelo.slot_holds (kind, expires_at);
ALTER TABLE rivelo.slot_holds ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON rivelo.slot_holds FROM anon, authenticated;
INSERT INTO rivelo.schema_migrations (version) VALUES ('013_slot_holds') ON CONFLICT DO NOTHING;
COMMIT;
