# Discovery, registration, business map, and community

This extends the existing Next.js application. Boop, Klyq, RevFit, their policy/safety/moderation/support pages, existing registry endpoint, and send-project endpoint remain untouched.

## Local setup

Copy the fields in `.env.discovery.example` into your own ignored `.env.local`, using independently generated long random admin and cron secrets. Do not expose them as NEXT_PUBLIC values. Open `/admin/discovery` and use CATALOG_ADMIN_KEY. The key is held in tab memory only. Local data is private `.data/catalog/state.json`; back it up securely.

Enable daily imports in the admin desk. Run `node --env-file=.env.local scripts/discovery-worker.mjs` alongside `npm run dev`. The worker checks hourly; the job processes one source per day (23-hour minimum gap), with an expiring lease to prevent overlapping runs. Five default Apple App Store search phrases target India, one category per run. Imports stay pending until reviewed. “Run now” can force a selected source without enabling the daily schedule. Stop the worker with Ctrl-C.

For production, use the PostgreSQL adapter described below, or a persistent Node host with CATALOG_DATA_DIR on a private durable volume. Schedule an authenticated GET to `/api/cron/discover` once daily using `Authorization: Bearer <CRON_SECRET>`. A scheduler alone does not provide persistence. Ephemeral/serverless deployments should use CATALOG_STORE=postgres; file mode does not work across isolated instances. It serializes same-volume writes with an atomic rename and a lock file. Deploy behind an edge rate limiter for distributed abuse protection; the included public request limiter is per-process. The scheduler is not installed or deployed automatically by this change.

## Owner registration and locations

`/register` accepts public website, Apple App Store, and Google Play URLs. Preview imports name/description/image when the source supports it. Owners can correct the text or enter it manually when importing is unavailable. Google Play requires SERPAPI_API_KEY. Final submission re-fetches the image server-side (it never trusts arbitrary client image URLs), stores a private email and owner-confirmed location, and returns a real pending receipt. A link alone cannot reliably identify a physical business address. Owners click the map or enter coordinates and explicitly consent to displaying them. City-center locations are supported to avoid exposing a home address.

In the admin desk, review ownership evidence, submitted text, image permission, and the location. Publish the product, then approve its map pin. Only approved pins with a published product reach `/map`. Email and review status never reach public map props. There are no fabricated people, pins, online counts, or activity statistics. Category and city filters provide transparent matching. Removing a product from publication also hides its pin immediately. The old `/api/registry` stays compatible; its legacy pending files are separate from the new owner registration workflow.

## Importers

- Apple: official iTunes Search/Lookup API, software results only, capped at five per source run. Keep requests below documented rate limits and review Apple's usage terms before displaying their content commercially.
- Google Play: optional SerpAPI provider for public app metadata. The Android Publisher API is for a developer's own account; it is not used for other developers' public apps. Credentials stay on the server.
- Websites: robots.txt and page indexing directives are checked; only title/description/image metadata is extracted. URLs are HTTP(S) only. Requests resolve DNS, reject private/reserved addresses, pin the approved address during the request, revalidate redirects, limit response bytes, and time out. Use a final website URL if its HTML page redirects. Source image requests use a bounded same-origin proxy, raster MIME allowlist, DNS validation, and caching.
- Imported data is pending. Review rights and add an original useful summary before publishing. No ratings, prices, downloads, or social metrics are fabricated. Published copy is not overwritten on a scheduled refresh. The current importer does not bypass crawl restrictions, paywalls, or authentication.

Published products have server-rendered detail pages, canonical URLs, source attribution, directory schema, and sitemap entries. Pending submissions, private admin, and claim pages are not indexed. New routes use a system-selected theme; light is white/gray/orange and dark is charcoal/blue.

## Community

`/community` offers topic/search filters, Top (reply count), New, and Unanswered sorting. New posts and replies are stored pending in the review desk. Only approved posts/replies become public. Public data omits email. No third-party social posting is performed. Owner invitations and community are separate systems.

## Ownership claims and outreach

`/claim` issues a claim-specific token shown to the requester. Where a trusted developer domain exists, ownership is proved with `/.well-known/rivelo-verify.txt`; an admin still approves the claim. App store claims without a trusted domain need manual evidence. The claim endpoint does not grant accounts or edit access based only on email.

Invitations require an admin-entered, reviewed business recipient. No personal emails are scraped. The admin can review a professional draft for a specific product; sending requires configured Resend credentials, a verified sender, a real business mailing address, OUTREACH_ENABLED=true, and explicit confirmation for that recipient. Opt-outs use a separate token and suppression list. Unsubscribe GET only displays a confirmation form; POST performs suppression. Provider calls have idempotency keys. No emails are sent by imports or tests. A crashed “sending” record requires delivery verification and manual recovery before retrying; do not reset it without checking the provider. The app does not claim that provider acceptance guarantees inbox delivery.

`/premium` offers scoped SEO reviews, editorial positioning, relevant outreach, and community-appropriate promotion with pricing by enquiry. It does not promise rankings, bulk Reddit promotion, or purchased ranking links. Paid links must use rel=sponsored; the product model supports sponsored placement. Growth enquiries are stored in the private admin desk, not silently emailed.

## Map provider

Leaflet uses OpenStreetMap standard tiles with visible attribution, normal browser caching, no prefetch, and no offline downloads. Set NEXT_PUBLIC_MAP_TILE_URL and matching NEXT_PUBLIC_MAP_ATTRIBUTION for a production provider when traffic requires it. Tile requests disclose browser network information to the configured provider. No browser geolocation request is made. The map remains usable through category/city filtering and accessible coordinate fields when tiles are unavailable.

Primary references: [Apple Search API](https://performance-partners.apple.com/search-api), [Android Publisher API](https://developers.google.com/android-publisher/getting_started), [SerpAPI Google Play](https://serpapi.com/google-play-product-api), [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/), [Google link spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [Reddit spam guidance](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam).


## PostgreSQL storage

The supplied Supabase connection is configured server-side and has been verified using full TLS certificate and hostname validation. The public CA certificate is in `certs/supabase-ca.crt`. Do not disable certificate verification. An alternative certificate can be supplied with DATABASE_CA_PATH or DATABASE_CA_CERT. The bundled provider CA was downloaded from Supabase's download bucket over HTTPS; review its expiry when renewing your database certificate configuration.

`node --env-file=.env.local scripts/setup-postgres.mjs` initializes only the new `rivelo_directory` schema through the private admin endpoint. It creates a catalog state row and copies the existing local catalog only when the row does not already exist. It never overwrites an existing database catalog or changes other application tables. Local files remain as a backup. Set CATALOG_STORE=postgres after initialization. This switch is active in the current local environment.

The private schema and table deny access to public, anon, and authenticated roles; RLS is enabled with no client policies. Only the server's database connection accesses it. A JSONB catalog row is serialized with SELECT FOR UPDATE inside a transaction, so multiple app instances cannot overwrite each other's changes. This bounded catalog implementation is appropriate for the current directory size; split data into indexed tables as traffic and write volume grow.

A separate public_payload column is rebuilt atomically on every state update. Public React pages select only this sanitized snapshot, including in development tracing: published products, approved pins, approved posts/replies, and no contact emails, invitation drafts, claim tokens, or pending records. Private API handlers read the full payload only after authorization where required. The public snapshot is not exposed by PostgREST, and public app pages continue to use server-rendered metadata and canonical URLs.

No cron job is installed in Supabase by database initialization. The local worker continues to call the protected Next.js cron endpoint, which now reads and writes PostgreSQL. Deploy that worker or a hosted authenticated daily scheduler with the site for unattended production discovery. Keep the database URL and admin/cron secrets server-side. Configure a shared rate limiter at your production edge.

Map now uses the full-canvas Rivelo Atlas layout, initial world view, collapsible results, real product markers grouped by zoom level, and a reset-world control. Registration keeps its dedicated location picker. Theme controls now offer Light, Dark, and System; manual choices are stored under rivelo-theme-preference and applied before hydration. OAuth setup is in `docs/authentication.md`.
