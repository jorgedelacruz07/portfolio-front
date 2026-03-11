# Portfolio Frontend

Personal portfolio frontend built as a Vite + React SPA with React Router, TanStack Query, Tailwind CSS, and React Helmet Async.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
```

## Development

1. Install dependencies with `npm install`.
2. Start the local dev server with `npm run dev`.
3. Open the local URL printed by Vite.

## Environment Variables

Create a local `.env` file when needed:

```bash
VITE_API_URL=
VITE_GOOGLE_ANALYTICS_ID=
```

If `VITE_API_URL` is omitted in development, the app falls back to mock data.

## Deployment

- Build output is generated in `dist/`.
- Firebase Hosting should serve `dist/` and rewrite unknown routes to `/index.html`.
