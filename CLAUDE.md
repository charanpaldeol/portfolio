# Portfolio — Claude Code instructions

> **Purpose:** Root agent entrypoint for cpdeol.com — architecture, tiered verify, policy imports, and `.claude/` layout.

cpdeol.com Next.js portfolio. **Enforcement** lives in `.claude/rules/` (imported below). **Workflows** in `.claude/skills/` (on demand only — do not load `content-research-writer` unless the user attaches it or asks for writing help).

General behavioral guidelines live in `~/.claude/CLAUDE.md`.

## Always-apply policy

If you do not see the rule files below, stop and read them before proceeding.

@.claude/rules/project-standards.md
@.claude/rules/layout-frozen-files.md
@.claude/rules/nextjs-pitfalls.md

**Read when relevant (not duplicated here):**

| When | Read |
|------|------|
| Editing `app/**` or `components/**` UI | `.claude/rules/design-system.md` |
| Editorial / marketing page heroes | `.claude/rules/editorial-hero.md` |
| Committing or pushing | `.claude/skills/safe-ship/SKILL.md` |
| User asks to verify | `.claude/skills/verify-and-audit/SKILL.md` |

## Architecture

Single layout stack: `app/layout.tsx` → `GlobalChrome` → `PortfolioShell` → page content. Homepage sections: `components/home/*`.

Feature data: `/lib/[feature]-data.ts` — components receive props (no fetch in `/components`).

## Verification (tiered)

Source of truth: `package.json` scripts. **No Husky pre-commit hook** — run checks manually.

| When | Command | Covers |
|------|---------|--------|
| **Before push** (default) | `pnpm ship-check` | `tsc` + `lint` + `audit` + `build` (matches Vercel; no e2e) |
| **Before commit / merge** (user asked to commit or ship) | `pnpm verify` | `ship-check` bar + e2e smoke + visual proof |
| **CI / factory only** | `FACTORY_SKIP_E2E=1 pnpm verify` | Skips e2e |
| **Optional depth** | `pnpm verify:full` | `verify` + Vitest |
| **Not in verify** | `pnpm e2e:headless` | Full Playwright suite |

Do **not** use `FACTORY_SKIP_E2E` for normal commits. Do **not** treat Vitest-only green as ship-ready — Vercel runs ESLint and TypeScript inside `next build`.

`pnpm build` runs `prebuild` (`build:content`, `sync:graph`) — if build fails, check prebuild before debugging components.

Enforcement: `node scripts/audit.js` (`hero` for hero-only) + `eslint.config.mjs`.

## Redirect and canonical safety

Do not add host-level redirects (`www` ↔ apex) in `vercel.json` / `next.config.ts` unless the user explicitly requests it. Before shipping redirect changes, verify both hosts for HTML and a **real** hashed `_next/static/chunks/<hash>.js` URL (not `*`). Block if static assets loop or exceed one redirect hop. Details: `project-standards.md` § Redirect.

## SEO / large audits

For “SEO audit” requests: start with `node scripts/audit.js`, repo metadata/sitemap checks, and at most **2–3** focused passes. Launch the full multi-subagent SEO fleet **only** when the user explicitly asks for a comprehensive / full-site audit.

## Workflow

When you make a mistake the user cares about, end with: **Update `CLAUDE.md` or `.claude/rules/` so this does not repeat.**

## Agent layout

| Path | Purpose |
|------|---------|
| `.claude/rules/` | Project rules (markdown) |
| `.claude/skills/` | Task skills (on demand) |
| `.claude/agents/` | Subagent prompts |
| `.claude/hooks/` | Shell hooks (optional) |

`.claude/` is the source of truth. In Cursor, enable "Include third-party Plugins, Skills and other configs". Any `.cursor/` config mirrors `.claude/`, not a separate source.

See `docs/GOVERNANCE.md`, `docs/DESIGN.md`, `docs/code-architecture-review.md`.
