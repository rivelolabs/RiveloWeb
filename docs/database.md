# Rivelo database

All new data lives in the `rivelo` schema of the Supabase Postgres database (`DATABASE_URL`).
Only the Next.js server can read or write it: the `anon`/`authenticated` roles are revoked and RLS is on.

Apply / update the schema (safe to re-run):

    node --env-file=.env.local scripts/migrate.mjs

| Table | What it stores |
|---|---|
| `profiles` | Every signed-in user (Google / X): email, name, avatar, provider. Created automatically on first sign-in by a trigger on `auth.users`. |
| `plans` | `spotlight` ($10/mo, homepage header 7 days per cycle) and `growth` ($20/mo, + AI analysis, SEO, Reddit suggestions). |
| `subscriptions` | A user's Razorpay subscription for one product. |
| `payments` | Every Razorpay charge. |
| `billing_events` | Each Razorpay webhook, stored once (idempotency + audit). |
| `featured_placements` | Paid homepage header weeks. One per paid cycle. Shown with a **Sponsored** label. |
| `upvotes` | One upvote per user per product → Trending. |
| `launches` | Launches imported from Product Hunt, plus new Rivelo listings. |
| `community_posts`, `community_replies` | Community discussions (moved out of the catalog JSON; migration 002 copies old posts). |
| `ai_reports` | Queued AI growth reports for Growth subscribers. |

Routes: `/api/billing/{subscribe,verify,webhook,me,cancel}`, `/api/upvotes`, `/api/cron/launches`, page `/launches`.
