# Governance — AI-agent development

> **Purpose:** Human-readable agent enforcement summary — hero, verify, feature flags, data layout, and governance reports.

Enforcement for autonomous work on this portfolio. **Policy lives in** `CLAUDE.md` and `.claude/rules/`; **workflows** in `.claude/skills/` (on demand). **File purpose headers**: `.claude/rules/project-standards.md` § File purpose.

## Editorial page hero (canonical UI)

- **Component:** `components/portfolio/EditorialPageHero.tsx`
- **Reference route:** `/what-i-bring` (`app/what-i-bring/page.tsx`)
- **Audit:** `node scripts/audit.js hero` (or full `node scripts/audit.js`)

Do not duplicate editorial hero markup in page files. Extend `EditorialPageHero` props instead. Rule file: `.claude/rules/editorial-hero.md`.

## Verification

| When | Command |
|------|---------|
| Before push | `pnpm ship-check` |
| Before merge / commit | `pnpm verify` |

`ship-check`: `tsc`, `lint`, `scripts/audit.js`, `build`.

`verify`: `ship-check` + e2e smoke + visual proof (unless `FACTORY_SKIP_E2E=1`).

## Feature flags

New user-visible features ship behind server-side flags:

- Utility: `lib/feature-flags.ts`
- Pattern: `if (featureFlag("flag-name")) { ... }`
- Env: `FF_FLAG_NAME=1`

## Data architecture

- Feature data: `/lib/[feature]-data.ts`
- Components accept props — no internal fetch in `/components`
- API routes: Zod validation (`safeParse` on POST bodies)

## Weather (`/weather`)

- **Overview:** `docs/features/weather.md` (routes, APIs, UX, tests).
- Server load: `lib/weather-service.ts` (not self-fetch from `page.tsx`).
- Agent policy: `.claude/rules/weather-search.md` (compound bar, Enter-to-go, recents, URL sync).
- Cursor mirror: `.cursor/rules/weather-search.mdc` → same policy.
- E2E smoke: `e2e/goal-smoke.spec.ts` weather tests.

## Governance reports (optional)

Worker completion reports for rule extraction:

- Directory: `docs/governance/reports/*.md`
- Extract candidates: `pnpm extract-rules`

Sections used by `scripts/extract-rules.mjs`:

- `## Anything governance should pay attention to`
- `## Known issues or TODOs left for Charan`

## Visual proof (e2e)

UI proof screenshots: Playwright `pnpm e2e:proof` during `pnpm verify` (`e2e/visual-proof.spec.ts`). Artifacts under `playwright-report/` or `test-results/` (gitignored).
