# Performance Optimizations Summary

This project now runs as a Vite + React SPA. The notes below reflect the current optimization strategy after removing the legacy framework-specific setup.

## Current Optimization Areas

- Critical image preloading for the homepage profile image
- Route-level code splitting with `React.lazy` and `Suspense`
- Shared query caching with TanStack Query
- Tailwind content scanning aligned with the active component tree
- SPA-ready hosting rewrites and static asset output

## Key Files

- `src/Router.tsx`
- `src/routes/HomePage.tsx`
- `components/Layout.tsx`
- `components/OptimizedImage.tsx`
- `lib/query-client.ts`
- `vite.config.ts`
- `firebase.json`

## Validation

Use the standard workflow to verify performance-sensitive changes:

```bash
npm run build
npm run lint
```

Then inspect the production bundle and runtime behavior with browser profiling tools as needed.
