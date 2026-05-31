# Portfolio — Claude Code instructions

cpdeol.com Next.js portfolio. Read `.claude/rules/` for scoped policy; use `.claude/skills/` for workflows.

General behavioral guidelines (think-before-coding, simplicity, surgical changes, goal-driven execution) live in `~/.claude/CLAUDE.md`.

## Architecture

Single layout stack: `app/layout.tsx` → `GlobalChrome` → `PortfolioShell` → page content. Homepage sections: `components/home/*`.

## Always-apply policy

Scope, copy, verification, and feature defaults: `.claude/rules/project-standards.md`. Frozen files: `.claude/rules/layout-frozen-files.md`. Both always apply.

## Verify

- Run `pnpm verify` before committing (there is no automatic pre-commit hook).
- `pnpm verify` = `tsc --noEmit` + `lint` + `node scripts/audit.js` + `build` + e2e. `pnpm verify:full` adds unit tests.
- `pnpm build` runs a `prebuild` step (`build:content` + `sync:graph`, i.e. graphify content/graph) that can fail independently of app code.
- Enforcement = the audit (`node scripts/audit.js`, `hero` mode for hero-only checks) plus ESLint config (`eslint.config.mjs`).

## Testing

- Unit: Vitest (`pnpm test`). E2e: Playwright (`pnpm e2e:smoke`, `pnpm e2e:headless`).

## Agent layout

| Path | Purpose |
|------|---------|
| `.claude/rules/` | Project rules (markdown) |
| `.claude/skills/` | Skills (`SKILL.md` per folder) |
| `.claude/agents/` | Subagent prompts |
| `.claude/hooks/` | Shell hooks (optional / IDE-specific) |

`.claude/` is the source of truth. In Cursor, enable "Include third-party Plugins, Skills and other configs" to load `.claude/skills/` and this file; any `.cursor/` config is a mirror of `.claude/`, not a separate source.

See `docs/GOVERNANCE.md`, `docs/DESIGN.md`, `docs/code-architecture-review.md`.
