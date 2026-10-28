# Portfolio Frontend

Personal portfolio frontend built as a Vite + React SPA with React Router, TanStack Query, Tailwind CSS, and React Helmet Async.

The admin Projects section can preview and import curated `*.draft.json` files.
Import always creates a hidden project; reviewing the file, importing it, and
making it visible are separate actions. The editor preserves the long description,
links, featured flag and display order. Public project cards show the long
description in an accessible case-study disclosure. The source manifest and
private report remain outside this frontend; see the workspace README.

Optional browser verification: build with a synthetic API origin and Doppler
markers to skip local dotenv files, then serve an isolated loopback preview:

```bash
DOPPLER_PROJECT=verification DOPPLER_CONFIG=verification VITE_API_URL=https://api.example.com npm run build
DOPPLER_PROJECT=verification DOPPLER_CONFIG=verification npm run start -- --host 127.0.0.1 --port 5197
```

In another shell, run `node scripts/drafts-browser-smoke.mjs`. If Playwright is
installed elsewhere, set `PORTFOLIO_PLAYWRIGHT_PATH` to that installation. The
script mocks the API, blocks other external requests, and checks desktop/mobile
review, hidden import, separate publication and case-study rendering. Screenshots
go to `.cache/drafts-browser/`. It never contacts the deployed API or a database.

## Stack

- Vite + React (versions in `package.json`)
- React Router for client-side routing
- TanStack Query for remote data fetching and caching
- Tailwind CSS with shared home-page layout tokens
- React Helmet Async for document metadata
- Axios for API access with the same public data flow in development and production

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run quick
```

## Development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` if you need local configuration.
3. Start the local dev server with `npm run dev`.
4. Open the local URL printed by Vite.

## Environment Variables

The app currently reads these variables:

```bash
VITE_API_URL=
VITE_GA_ID=
```

- `VITE_API_URL`: Base URL for the portfolio API.
- `VITE_GA_ID`: Google Analytics measurement ID.

`VITE_API_URL` is required in every environment. Missing configuration, network
errors and unsupported endpoints surface as errors; public content is never
silently replaced with sample profiles, projects or GitHub statistics.

GitHub activity revalidates its HTTP response and retries incomplete results
every minute while the page is active, as well as on return to the tab or network
reconnection. An unavailable response keeps the section visible with a retry
button. Complete statistics retain their 30-minute query cache; the API's
upstream cache avoids extra GitHub calls.

Public project ordering uses CMS `featured` and `displayOrder` on both Home and
Projects. Unranked historical projects preserve their existing relative order.
The reviewed public catalog and GitHub profile synchronization tools live in the
parent workspace; neither the frontend nor the browser copies private project
documentation into public content.

`CompanyLogo` is shared by Home and Experiences. It uses an explicit CMS
`companyLogo`, then a verified local brand asset, then the legacy image, and
finally a monogram if images fail. Logos use `object-contain`; locally hosted
filenames include a content hash to avoid stale immutable image caches.
Sources and verification dates are recorded in `docs/company-logo-sources.json`.

## Project Structure

- [`src/main.tsx`](src/main.tsx): App bootstrap, analytics initialization, and providers.
- [`src/Router.tsx`](src/Router.tsx): Route definitions and route-level lazy loading.
- [`src/routes/HomePage.tsx`](src/routes/HomePage.tsx): Home route with deferred below-the-fold sections.
- [`components/pages/home/HomeSection.tsx`](components/pages/home/HomeSection.tsx): Shared home-page section shell.
- [`hooks/useDeferredRender.ts`](hooks/useDeferredRender.ts): Intersection Observer gate for deferred section mounting.
- [`lib/utils.ts`](lib/utils.ts): Shared utility functions and home-page style tokens.

## Recent Architecture Notes

- The homepage now uses a standardized section shell instead of section-specific layout logic.
- Featured home sections are lazy-loaded and only mounted when they approach the viewport.
- Several obsolete home-only files were removed to reduce styling drift and maintenance overhead.

## Deployment

- Production output is generated in `dist/`.
- Firebase Hosting should serve `dist/` and rewrite unknown routes to `/index.html`.
- Run `npm run build` before deployment to verify the optimized bundle.

Production builds require an absolute HTTP(S) `VITE_API_URL` pointing to the remote
API; missing, invalid, or loopback addresses fail the build. Set `VITE_API_URL` in the
Doppler `portfolio` project, `prd` config, before releasing. `npm run deploy` reads it with
`doppler run -c prd` and sets `VITE_VERIFY_PROD_URL=true`, so a missing or local URL fails the build
instead of shipping a bundle that calls `localhost`. Only `VITE_API_URL` is injected; to enable analytics add `VITE_GA_ID` to `prd` and to the `--only-secrets` list in the `deploy` script.

Run the configuration regression checks with:

```bash
node --test tests/production-env.test.mjs
```
