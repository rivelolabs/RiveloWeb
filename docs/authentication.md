# Google and X sign-in

The application uses Supabase Auth with the PKCE flow, cookie-based sessions, code exchange, a login page, an account page, and account/sign-out controls. It signs users in to Rivelo; it does not request social posting permissions or post on their behalf. This is Google account sign-in for the website, not Google Play Games Services.

## Current project configuration

The supplied Supabase URL and publishable key are configured in ignored `.env.local`. The database password is also server-only there and is never a NEXT_PUBLIC value. Keep Google and X client secrets in Supabase's provider settings, not in browser code.

X OAuth 2.0 is now configured: an authorization initiation was verified to return a redirect to x.com. This Auth deployment omits x from the legacy /auth/v1/settings external-provider map, so the application rejects only explicit false flags and lets the authorization service handle omitted providers. Google still reports disabled. A complete account login still requires the user to finish the provider consent screen. Disabled providers return a clear message rather than a fabricated session.

## Enable providers

1. In the Supabase project dashboard, open Authentication → Sign In / Providers.
2. Enable **Google**, using a Google OAuth web client ID and client secret from your Google Cloud project.
3. Enable **X / Twitter (OAuth 2.0)**, using your X developer app's OAuth 2.0 client ID and secret. The application uses provider `x`, not the deprecated OAuth 1.0a `twitter` provider.
4. Set the provider applications' authorized callback URL to `https://vqrcjuckdbknrpxbtuzz.supabase.co/auth/v1/callback`.
5. Under Supabase Authentication → URL Configuration, set Site URL to `https://rivelolabs.com`. Allow the application callbacks:
   - `https://rivelolabs.com/auth/callback`
   - `http://localhost:3000/auth/callback`
   - `http://127.0.0.1:3000/auth/callback`
6. Visit `/login` and test both providers in the browser. Keep the same hostname throughout a local login so the PKCE cookie remains available. Successful code exchange returns to the requested same-site page; failed exchanges return to sign-in.

The callback validates return paths and never trusts an arbitrary forwarded host. Session and verifier cookies are preserved through the callback. Account information is fetched and validated by Supabase in the browser and is not included in server-rendered public page data. Google/X sign-in does not automatically prove ownership of a listed app or website; the existing claim review still applies.

Official guides: [Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [X OAuth 2.0](https://supabase.com/docs/guides/auth/social-login/auth-twitter), [server-side auth](https://supabase.com/docs/guides/auth/server-side/advanced-guide).
