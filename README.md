# Portfolio Frontend

Personal portfolio frontend built as a Vite + React SPA with React Router, TanStack Query, Tailwind CSS, and React Helmet Async.

## Stack

- Vite + React (versions in `package.json`)
- React Router for client-side routing
- TanStack Query for remote data fetching and caching
- Tailwind CSS with shared home-page layout tokens
- React Helmet Async for document metadata
- Axios for API access with development fallback data

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

If `VITE_API_URL` is omitted in development, the data layer falls back to local mock responses from [`lib/api.ts`](lib/api.ts).

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
