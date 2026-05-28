# Governance — AI-agent development

Enforcement for autonomous work on this portfolio. **Policy lives in** `CLAUDE.md` and `.claude/rules/`; **workflows** in `.claude/skills/`.

## Editorial page hero (canonical UI)

- **Component:** `components/portfolio/EditorialPageHero.tsx`
- **Reference route:** `/what-i-bring` (`app/what-i-bring/page.tsx`) — Hero must compose only `EditorialPageHero`
- **Audit:** `node scripts/audit.js hero` (or full `node scripts/audit.js`)

Do not duplicate editorial hero markup in page files. Extend `EditorialPageHero` props instead.

## Verification

Before merge:

```bash
pnpm verify
```

Includes: `tsc`, `lint`, `scripts/audit.js`, `build`, e2e smoke + visual proof (unless `FACTORY_SKIP_E2E=1`).

## Feature flags

New user-visible features ship behind server-side flags:

- Utility: `lib/feature-flags.ts`
- Pattern: `if (featureFlag("flag-name")) { ... }`
- Env: `FF_FLAG_NAME=1`

## Data architecture

- Feature data: `/lib/[feature]-data.ts`
- Components accept props — no internal fetch in `/components`
- API routes: Zod validation (`safeParse` on POST bodies)

## Governance reports (optional)

Worker completion reports for rule extraction:

- Directory: `docs/governance/reports/*.md`
- Extract candidates: `pnpm extract-rules`

Sections used by `scripts/extract-rules.mjs`:

- `## Anything governance should pay attention to`
- `## Known issues or TODOs left for Charan`

## Visual proof (e2e)

UI proof screenshots are produced by Playwright during `pnpm verify` / `pnpm e2e:proof` (see `e2e/visual-proof.spec.ts`). Store artifacts locally under `playwright-report/` or `test-results/` (gitignored).
