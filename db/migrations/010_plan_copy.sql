-- Plan descriptions as self-serve software features (no manual SEO/outreach services).
BEGIN;
UPDATE rivelo.plans SET features='["Everything in Spotlight (7 days in the homepage header every month)","1 map yacht free all month","AI analysis of your listing and positioning","Automated SEO tracking with AI suggestions you can apply","Monthly report emailed to you"]'::jsonb WHERE id='growth';
INSERT INTO rivelo.schema_migrations (version) VALUES ('010_plan_copy') ON CONFLICT DO NOTHING;
COMMIT;
