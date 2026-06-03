# portfolio

> **Purpose:** Human-facing repo overview — quickstart, agent layout, verify commands, and doc index for cpdeol.com.

Personal portfolio — cpdeol.com

**Features:** Marketing pages, blog, contact form, **[weather](/weather)** (location search, 16-day forecast, compare two places), and more — see `docs/features/weather.md` for the weather tool.

## Quickstart

```bash
pnpm install
pnpm agent:start
```

## Agent setup (Claude Code)

| Path | Purpose |
|------|---------|
| `CLAUDE.md` | Always-on project context |
| `.claude/rules/` | Project rules (markdown) |
| `.claude/skills/` | Task skills (on demand) |
| `.claude/agents/` | Subagent prompts (`verify-app`, `pr-review`) |
| `.claude/hooks/` | Optional shell scripts |

Legacy `.cursorrules` is deprecated; use `CLAUDE.md` and `.claude/`.

**Cursor users:** enable “Include third-party Plugins, Skills and other configs” to load `.claude/skills/` and `CLAUDE.md`.

## Verify

| Command | When |
|---------|------|
| `pnpm ship-check` | Before **push** — tsc, lint, audit, build (no e2e) |
| `pnpm verify` | Before **commit** / merge — ship-check + e2e smoke + visual proof |
| `pnpm verify:full` | verify + unit tests |
| `pnpm e2e:headless` | Full Playwright (not in verify) |

`FACTORY_SKIP_E2E=1` skips e2e inside `pnpm verify` (CI/factory only).

```bash
pnpm extract-rules     # guardrail candidates from docs/governance/reports
pnpm clean             # remove local generated dirs (graphify, .next, etc.)
```

## Standards

| Document | What it covers |
|----------|----------------|
| `docs/DESIGN.md` | Editorial Expert design system |
| `docs/features/weather.md` | `/weather` routes, APIs, search UX, tests |
| `docs/code-architecture-review.md` | Architecture grades + action items |
| `docs/GOVERNANCE.md` | Agent verification, hero, feature flags |
| `.claude/rules/` | Enforced agent behavior (`.cursor/rules/` mirrors for Cursor) |

## Enforcement

- **ESLint** — `eslint.config.mjs` (+ `lib/eslint-rules/` where referenced)
- **Audit** — `node scripts/audit.js` (`hero` for hero-only)
- **Before push** — `pnpm ship-check`; **before commit** — `pnpm verify` (manual; no Husky hook)

## Data architecture

All feature data lives in `/lib/[feature]-data.ts`. Components accept props, never fetch.
