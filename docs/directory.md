# Rivelo discovery directory

The public homepage is now an app and website directory with a sidebar, genre and platform filters, search, sorting, saved products, detail dialogs, and a builder registration flow. It uses the existing ecosystem products and original screenshot assets. Decorative product artwork is rendered in CSS; no remote stock images or invented usage statistics are used.

Calquors is credited as the company behind Rivelo Labs, and OmegleVC appears in the ecosystem. Anthropic links to the official Claude Startups program as a resource for builders. There is no claim of investment, sponsorship, acceptance into a program, or endorsement from Anthropic.

## Registration

`POST /api/registry` is a new endpoint. A valid submission is saved as a private JSON file with status `pending`; it does not automatically publish into the directory. The submitter receives a pending-review receipt only after the file is successfully written. Repeating an identical request with its original UUID returns the same receipt. Reusing the UUID with different contents is rejected.

Local development saves submissions under `.data/registry/`, which is Git-ignored. To run in production, set `DIRECTORY_DATA_DIR` to an absolute path on persistent writable storage outside the public directory. Registration returns an unavailable response if no production storage location is configured. A serverless host needs a durable database/object-store adapter; ephemeral filesystem storage should not be used for production submissions.

The owner can review the private JSON records in that directory. Public listings are curated in `src/lib/directory.ts`; no unauthenticated publishing or administration UI is exposed. Contact emails are private, never returned by an API or published. Publishing is currently a manual review and source update.

Saved product IDs and submission receipts are stored in the current browser. “My submissions” describes this scope. These are not cross-device accounts. The original registrations remain server-side. Existing `/api/send-project`, privacy, support, account-deletion, moderation, and child-safety routes and policy content are unchanged.

## Validation

Run `node --test tests/registry.test.cjs` for request validation, URL checks, durable saving, duplicate handling, and failure behavior. Test records are written to a disposable temporary directory. `npm run build` validates the Next.js application.

Official resource: https://claude.com/programs/startups

## Completed checks

- Production build and TypeScript validation passed.
- All six registration and directory filter tests passed.
- The homepage and all existing privacy, support, deletion, and safety URLs returned HTTP 200, including retained redirect aliases.
- Git confirms that protected route sources, policy content and components, the existing API, Next.js headers, legacy global styles, and app-ads.txt are unchanged.
- A synthetic local registration returned HTTP 201 and a pending receipt, and its private on-disk record was verified. Only that test record was removed afterward.
- Visual browser automation was not available in this session. The existing local preview is available at http://127.0.0.1:3000/ for visual review.


## SEO, dark mode, and readability update

- The existing Next.js App Router app remains in place. Product cards are visible in the first HTML response without JavaScript-dependent entrance opacity. Product names link to statically generated `/products/[slug]` pages.
- Each public product page has its own title, description, canonical URL, Open Graph metadata, application schema, and breadcrumbs. The homepage includes collection/ItemList structured data. The sitemap includes the five product pages and retains existing policy entries; obsolete homepage fragment URLs are removed.
- `src/app/opengraph-image.tsx` generates the branded 1200×630 social preview through Next.js.
- Functional text uses a substantially larger type scale: body and card copy 14–16px, product titles 19–23px, and readable form fields and controls. Mobile uses a single card column on narrow screens instead of shrinking the labels.
- Light and dark palettes use shared semantic CSS tokens, including dialog fields, validation, pending states, and the public product pages. The theme toggle remembers an explicit preference, follows the OS before a preference is set, and still works with blocked local storage. An early bootstrap applies the theme before hydration.
- Key text and control color pairs were measured at 4.5:1 contrast or higher in both palettes. Dark and light CSS are scoped to the directory; existing policy content and global policy styles are untouched.
- Nine tests passed across registration, filtering, theme resolution, blocked storage bootstrap, and structured data. Production build passed. HTTP inspection verified all product pages, canonicals, structured data, the sitemap, and the PNG preview image.
- Visual browser automation remains unavailable in this session; actual visual and pointer interaction checks have not been performed.

Next.js references: https://nextjs.org/docs/app/getting-started/metadata-and-og-images and https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap


## System theme preference

The site now follows the device color scheme on initial load and when the system preference changes while the page is open. Saved manual overrides are ignored, and the manual theme controls were removed from the directory and product pages. No browser storage is required for theme selection.
