# Project status

Living note so the next session can resume in a couple of minutes. No secrets.

## Current state

[PR #11](https://github.com/jorgedelacruz07/portfolio-front/pull/11) is merged and not deployed. Jorge merged it on 2026-11-09 at 15:12 America/Lima as [`1d3576a`](https://github.com/jorgedelacruz07/portfolio-front/commit/1d3576a97ba6ab79bf5b0342bed27bab8215bd36) (head [`7e85c0a`](https://github.com/jorgedelacruz07/portfolio-front/commit/7e85c0ae6c9b0aecd443d8c2795347cdae687602)). Independent post-merge reviews of that head: QA ready with observations, AppSec OK, 70/70 tests.

Production still serves the [PR #10](https://github.com/jorgedelacruz07/portfolio-front/pull/10) merge [`b3b71bf`](https://github.com/jorgedelacruz07/portfolio-front/commit/b3b71bf66dfe8c1f09244383ce9c45b877d12059). It was deployed on 2026-11-09 at 14:48:30 America/Lima through Firebase Hosting (project `portfolio-489421`, `npm run deploy`). The Firebase release id was not recorded.

Evidence for that production build:

- Asset hashes matched the local build (`index-CR0vh9C8.css`, `index-DL89bHrL.js`).
- HTTP 200 on `/`, `/projects`, `/experiences`, `/articles`, and the SPA 404 route.
- Canonical and JSON-LD present.
- Inter served locally without Google Fonts.
- 67/67 tests passed.

## Recent decisions

- Public site is English only.
- Theme is light and dark. The default follows the system, and a choice is stored.
- Look is minimal, in the spirit of Linear and Vercel.
- Projects mobile Lighthouse one point behind base is accepted. QA measured 92 versus 93 over 5 runs. LCP is the intro paragraph. No further optimization.
- Article canonical URLs must use `https://jorgedelacruzpadilla.dev`. Any other host falls back to that origin.
- Contact email local-parts allow only `[A-Za-z0-9._+-]` ([`lib/safe-href.ts`](../lib/safe-href.ts)). An apostrophe is outside that set, so `o'brien@` is rejected.

## Next step

Deploy master `1d3576a` after Jorge authorizes it. Production stays on `b3b71bf` until that deploy.

## Blockers

None.

## Risks

- Admin shares the public color tokens.
- Reviews did not exercise Node 26 (`.nvmrc`).
- Production Lighthouse was not measured.
- `AdminPage.tsx` is still outside Prettier.
- Admin login copy is Spanish.
