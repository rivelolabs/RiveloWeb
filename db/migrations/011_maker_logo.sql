-- Makers can upload a product logo; the map shows it instead of their X photo.
BEGIN;
ALTER TABLE rivelo.maker_pages ADD COLUMN IF NOT EXISTS logo_url text;
INSERT INTO rivelo.schema_migrations (version) VALUES ('011_maker_logo') ON CONFLICT DO NOTHING;
COMMIT;
