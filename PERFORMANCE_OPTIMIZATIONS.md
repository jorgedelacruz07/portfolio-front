# Performance Optimizations Summary

This document reflects the current Vite + React SPA architecture after the recent home-page cleanup and section standardization work.

## Current Optimization Areas

- Route-level code splitting with `React.lazy` and `Suspense` in [`src/Router.tsx`](src/Router.tsx)
- Deferred mounting for below-the-fold home sections via [`hooks/useDeferredRender.ts`](hooks/useDeferredRender.ts)
- Shared home-page layout tokens and consistent section shells to reduce duplicated styling logic
- Critical image preloading for the homepage profile image in [`src/routes/HomePage.tsx`](src/routes/HomePage.tsx) and [`components/Layout.tsx`](components/Layout.tsx)
- Shared TanStack Query caching through [`lib/query-client.ts`](lib/query-client.ts)
- Axios-based API access with development fallback data in [`lib/api.ts`](lib/api.ts)

## Home Page Changes

- [`src/routes/HomePage.tsx`](src/routes/HomePage.tsx) now mounts projects, experiences, and blog sections only when they approach the viewport.
- [`components/pages/home/HomeSection.tsx`](components/pages/home/HomeSection.tsx) provides a single section shell for spacing, heading structure, and CTA alignment.
- [`components/pages/home/HomeProjects.tsx`](components/pages/home/HomeProjects.tsx), [`components/pages/home/HomeExperiences.tsx`](components/pages/home/HomeExperiences.tsx), and [`components/pages/home/HomeBlog.tsx`](components/pages/home/HomeBlog.tsx) now use simpler presentational card structures instead of the older home-only card layer.
- Legacy files removed during the cleanup included the previous home card components, `LazyHydrate`, and several unused UI helpers.

## Key Files

- [`src/Router.tsx`](src/Router.tsx)
- [`src/routes/HomePage.tsx`](src/routes/HomePage.tsx)
- [`components/Layout.tsx`](components/Layout.tsx)
- [`components/pages/home/HomeSection.tsx`](components/pages/home/HomeSection.tsx)
- [`hooks/useDeferredRender.ts`](hooks/useDeferredRender.ts)
- [`lib/utils.ts`](lib/utils.ts)
- [`lib/query-client.ts`](lib/query-client.ts)
- [`lib/api.ts`](lib/api.ts)
- [`vite.config.ts`](vite.config.ts)
- [`firebase.json`](firebase.json)

## Validation

Use the standard workflow to verify performance-sensitive changes:

```bash
npm run lint
npm run build
```

For deeper inspection, review the generated `dist/` output and profile route transitions, first paint, and deferred section loading in the browser.
