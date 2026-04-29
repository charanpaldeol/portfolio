# portfolio

Personal portfolio — cpdeol.com

## Quickstart

```bash
pnpm install
pnpm agent:start
```

## Factory commands (agent-friendly)

```bash
pnpm verify            # tsc + lint + audit + build + e2e (includes screenshot proof)
pnpm verify:full       # verify + unit tests
pnpm e2e:smoke         # fast chromium-only route sanity (<60s target)
pnpm e2e:headless      # full Playwright suite (all configured browsers/projects)
pnpm extract-rules     # extract guardrail candidates from governance reports
DEPLOY_URL=https://cpdeol.com pnpm deploy:smoke
```

### Visual proof screenshots

For UI-affecting work, run:

```bash
PLAN_ID=PLAN-04 pnpm verify
```

Screenshots are written to:
- `agents/governance/screenshots/PLAN-04/desktop/*.png`
- `agents/governance/screenshots/PLAN-04/mobile/*.png`

## Agent entrypoints

- `agents/START_HERE.md`
- `agents/CURSOR-START.md`
- `agents/plans/_LAUNCH.md`
- `agents/plans/_PROJECT_CONTEXT.md`

## Standards

| Document | What It Covers |
|----------|---------------|
| `docs/DESIGN.md` | Editorial Expert design system |
| `docs/code-architecture-review.md` | Architecture grades + action items |
| `docs/GOVERNANCE.md` | Enforcement rules + AI-agent development (includes **canonical editorial hero** — `EditorialPageHero` + `/what-i-bring`) |
| `.cursorrules` § 2.5 | Editorial page hero — must use shared component; default reference is `/what-i-bring` |
| `.cursorrules` § 8 | AI-agent rules (read automatically) |

## Enforcement

Rules are enforced by code, not documentation:

- **ESLint rules** — `lib/eslint-rules/` (6 custom rules)
- **Audit script** — `node scripts/audit.js` (design + architecture + editorial hero scanner; `hero` for hero-only)
- **Pre-commit hook** — `.husky/pre-commit` (blocks bad commits)

Run `node scripts/audit.js` to check compliance.

## Data Architecture

All feature data lives in `/lib/[feature]-data.ts`. Components accept props, never fetch.
