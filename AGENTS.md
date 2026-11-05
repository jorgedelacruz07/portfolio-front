# AGENTS.md — Portfolio frontend

Independent React/Vite repository. Read [README.md](README.md) and, when present,
[workspace rules](../AGENTS.md). Paths here are relative to this repository.

- Routes: `src/Router.tsx` and `src/routes/`; components: `components/`; HTTP and
  caching: `lib/api.ts`, `lib/admin-api.ts`, `lib/query-client.ts`, and `hooks/`.
  Do not assume every source folder is under `src/`.
- Preserve public SEO metadata, accessible navigation, deferred section loading,
  and the magic-code admin/session flow. Use existing layout primitives.
- `npm run lint` runs ESLint without fixing files; `npm run lint:fix` applies
  fixes. `npm run format` writes formatting changes, while
  `npm run format:check` is read-only. `npm test` runs the Node test suite in
  `tests/*.test.mjs`.
- `npm run build` creates the production bundle. `npm run analyze` currently
  aliases build; it does not produce a separate bundle-analysis report.
  `npm run quick` runs lint, formatting, tests, and build, and may modify files
  through its lint/format steps; do not use it for documentation-only checks.
- For documentation-only edits, verify links and commands and run `git diff --check`.
- `vite.config.ts` fixes local port 5175. Read `.nvmrc` for the Node version.
- Do not expose credentials or publish admin/session data. Browser mock responses
  are development fixtures, not proof that the live API works.
