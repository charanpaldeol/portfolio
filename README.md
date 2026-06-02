# portfolio

> **Purpose:** Human-facing repo overview — quickstart, agent layout, verify commands, and doc index for cpdeol.com.

Personal portfolio — cpdeol.com

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
| `.claude/skills/` | Task skills (`/skill-name` or auto-invoked) |
| `.claude/agents/` | Subagent prompts (`verify-app`, `pr-review`) |
| `.claude/hooks/` | Optional shell scripts |

Legacy `.cursorrules` is deprecated; use `CLAUDE.md` and `.claude/`.

**Cursor users:** enable “Include third-party Plugins, Skills and other configs” to load `.claude/skills/` and `CLAUDE.md`.

## Verify before commit

```bash
pnpm verify            # tsc + lint + audit + build + e2e smoke + visual proof
pnpm verify:full       # verify + unit tests
pnpm e2e:smoke         # fast chromium route sanity
pnpm e2e:proof         # visual proof (part of verify)
pnpm e2e:headless      # full Playwright suite (not run by verify)
pnpm extract-rules     # guardrail candidates from docs/governance/reports
pnpm clean             # remove local generated dirs (graphify, .next, etc.)
```

## Standards

| Document | What it covers |
|----------|----------------|
| `docs/DESIGN.md` | Editorial Expert design system |
| `docs/code-architecture-review.md` | Architecture grades + action items |
| `docs/GOVERNANCE.md` | Agent verification, hero, feature flags |
| `.claude/rules/` | Enforced agent behavior |

## Enforcement

- **ESLint** — `lib/eslint-rules/` (custom rules)
- **Audit** — `node scripts/audit.js` (`hero` for hero-only)
- **Before commit** — run `pnpm verify` manually (no Husky pre-commit hook in this repo)

## Data architecture

All feature data lives in `/lib/[feature]-data.ts`. Components accept props, never fetch.
