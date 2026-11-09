# Project status

Living note so the next session can resume in a couple of minutes. No secrets.

## Current state

[PR #10](https://github.com/jorgedelacruz07/portfolio-front/pull/10) merged at master `b3b71bf` (PR head `1f0fa59`) and deployed to Firebase Hosting (project `portfolio-489421`) on 2026-11-09 14:48:30 America/Lima via `npm run deploy`. The Firebase release id was not recorded.

Production evidence:

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
- Contact email local-parts allow only `[A-Za-z0-9._+-]`.

## Next step

Review the follow-up that rejects `&` in the contact email local-part, keeps `canonicalArticleUrl` from throwing on non-string input, and catches malformed `mailto` percent-encoding.

## Blockers

None.

## Risks

- Admin shares the public color tokens.
- Reviews did not exercise Node 26 (`.nvmrc`).
- Production Lighthouse was not measured.
- `AdminPage.tsx` is still outside Prettier.
- Admin login copy is Spanish.
