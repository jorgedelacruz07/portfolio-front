# Performance Optimizations Summary

This document reflects the current Vite + React SPA architecture after the recent home-page cleanup and section standardization work.

## Current Optimization Areas

- Route-level code splitting with `React.lazy` and `Suspense` in [`src/Router.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/src/Router.tsx)
- Deferred mounting for below-the-fold home sections via [`hooks/useDeferredRender.ts`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/hooks/useDeferredRender.ts)
- Shared home-page layout tokens and consistent section shells to reduce duplicated styling logic
- Critical image preloading for the homepage profile image in [`src/routes/HomePage.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/src/routes/HomePage.tsx) and [`components/Layout.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/components/Layout.tsx)
- Shared TanStack Query caching through [`lib/query-client.ts`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/lib/query-client.ts)
- Axios-based API access with development fallback data in [`lib/api.ts`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/lib/api.ts)

## Home Page Changes

- [`src/routes/HomePage.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/src/routes/HomePage.tsx) now mounts projects, experiences, and blog sections only when they approach the viewport.
- [`components/pages/home/HomeSection.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/components/pages/home/HomeSection.tsx) provides a single section shell for spacing, heading structure, and CTA alignment.
- [`components/pages/home/HomeProjects.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/components/pages/home/HomeProjects.tsx), [`components/pages/home/HomeExperiences.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/components/pages/home/HomeExperiences.tsx), and [`components/pages/home/HomeBlog.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/components/pages/home/HomeBlog.tsx) now use simpler presentational card structures instead of the older home-only card layer.
- Legacy files removed during the cleanup included the previous home card components, `LazyHydrate`, and several unused UI helpers.

## Key Files

- [`src/Router.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/src/Router.tsx)
- [`src/routes/HomePage.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/src/routes/HomePage.tsx)
- [`components/Layout.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/components/Layout.tsx)
- [`components/pages/home/HomeSection.tsx`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/components/pages/home/HomeSection.tsx)
- [`hooks/useDeferredRender.ts`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/hooks/useDeferredRender.ts)
- [`lib/utils.ts`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/lib/utils.ts)
- [`lib/query-client.ts`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/lib/query-client.ts)
- [`lib/api.ts`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/lib/api.ts)
- [`vite.config.ts`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/vite.config.ts)
- [`firebase.json`](/Users/jorge.delacruz/Documents/Personal/portfolio-front/firebase.json)

## Validation

Use the standard workflow to verify performance-sensitive changes:

```bash
npm run lint
npm run build
```

For deeper inspection, review the generated `dist/` output and profile route transitions, first paint, and deferred section loading in the browser.
