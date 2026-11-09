# Project status

Living note so the next session can resume in a couple of minutes. No secrets.

## Current state

Public UI redesign is draft [PR #10](https://github.com/jorgedelacruz07/portfolio-front/pull/10) on `cursor/public-ui-redesign-2504`. Reviews of `c0d338e`: QA ready with observations, AppSec OK. A later commit restricts article canonical URLs to this site and rejects mailbox header injection on the public contact address.

## Recent decisions

- Public site is English only.
- Theme is light and dark. The default follows the system, and a choice is stored.
- Look is minimal, in the spirit of Linear and Vercel.
- Projects mobile Lighthouse one point behind base is accepted. QA measured 92 versus 93 over 5 runs. LCP is the intro paragraph. No further optimization.
- Article canonical URLs must use `https://jorgedelacruzpadilla.dev`. Any other host falls back to that origin.

## Next step

Jorge reviews the draft, then an authorized merge, then deploy through Platform and compare the deployed artifact with `master`.

## Blockers

None.

## Risks

- Admin shares the public color tokens.
- Reviews did not exercise Node 26 (`.nvmrc`).
- Production Lighthouse was not measured.
- `AdminPage.tsx` is still outside Prettier.
- Admin login copy is Spanish.
