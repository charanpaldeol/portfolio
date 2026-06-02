# Portfolio — Claude Code instructions

cpdeol.com Next.js portfolio. Read `.claude/rules/` for scoped policy; use `.claude/skills/` for workflows.

General behavioral guidelines (think-before-coding, simplicity, surgical changes, goal-driven execution) live in `~/.claude/CLAUDE.md`.

## Always-apply policy

The policy files below are scope, copy, verification, design tokens, hero UI, and feature defaults — they must be in context for every task. They're `@`-imported here rather than just referenced, because in Claude Code only this file is auto-loaded; `.claude/rules/` is not guaranteed to be picked up on its own. If you don't see their contents, stop and read them before proceeding.

@.claude/rules/project-standards.md
@.claude/rules/layout-frozen-files.md
@.claude/rules/design-system.md
@.claude/rules/editorial-hero.md

(In Cursor, these load via the `.claude/` mirror — see Agent layout below.)

## Architecture

Single layout stack: `app/layout.tsx` → `GlobalChrome` → `PortfolioShell` → page content. Homepage sections: `components/home/*`.

## Verify

Run `pnpm verify` before committing — there is no automatic pre-commit hook, so nothing else catches a broken build for you.

- `pnpm verify` = `tsc --noEmit` + `lint` + `node scripts/audit.js` + `build` + e2e (`pnpm e2e:smoke`, then `pnpm e2e:proof`). Set `FACTORY_SKIP_E2E=1` to skip e2e (factory/CI only).
- `pnpm e2e:headless` runs the full Playwright suite; it is **not** part of `pnpm verify`.
- `pnpm verify:full` adds unit tests (Vitest: `pnpm test`).
- `pnpm build` runs a `prebuild` step that can fail independently of app code: `build:content` (regenerates content data) + `sync:graph` (rebuilds the content graph). If `build` fails, check whether it's the app or prebuild before debugging components.
- Enforcement = the audit (`node scripts/audit.js`; `hero` mode for hero-only checks) plus ESLint config (`eslint.config.mjs`).

## Redirect and canonical safety

A cross-host redirect on a static asset breaks hydration and can 404 the `_next` chunks, so canonical/redirect changes need extra care:

- Do not add host-level redirects (`www` ↔ apex) in repo config (`vercel.json`, `next.config.ts`) unless the user explicitly requests that change.
- Before shipping any host/canonical redirect change, verify both hosts for HTML and static-asset behavior. For the asset checks, first grab a real hashed chunk filename (from `.next/` build output, the build manifest, or page source) — a literal `*` in the URL will 404 and hide the problem:
  - `curl -I https://cpdeol.com/`
  - `curl -I https://www.cpdeol.com/`
  - `curl -I https://cpdeol.com/_next/static/chunks/<actual-hashed-chunk>.js`
  - `curl -I https://www.cpdeol.com/_next/static/chunks/<actual-hashed-chunk>.js`
- Block the change if any static-asset path enters a cross-host redirect loop or exceeds one redirect hop.

## Agent layout

| Path | Purpose |
|------|---------|
| `.claude/rules/` | Project rules (markdown) |
| `.claude/skills/` | Skills (`SKILL.md` per folder) |
| `.claude/agents/` | Subagent prompts |
| `.claude/hooks/` | Shell hooks (optional / IDE-specific) |

`.claude/` is the source of truth. In Cursor, enable "Include third-party Plugins, Skills and other configs" to load `.claude/skills/` and this file; any `.cursor/` config is a mirror of `.claude/`, not a separate source.

See `docs/GOVERNANCE.md`, `docs/DESIGN.md`, `docs/code-architecture-review.md`.