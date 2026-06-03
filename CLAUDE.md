# Portfolio — Claude Code instructions

> **Purpose:** Root agent entrypoint for cpdeol.com — architecture, verify bar, policy imports, and layout of `.claude/`.

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

## Local dev (`pnpm dev`)

**Symptom:** localhost returns HTML but the site looks unstyled or dead — browser console / terminal shows **`404` on `/_next/static/chunks/*` or `/_next/static/css/*`**.

**Cause:** `pnpm build` (or deleting `.next`) while **`pnpm dev` is still running** leaves the dev server serving HTML that points at chunk URLs that no longer exist.

**Recovery (stop dev → clear cache → restart):**

```bash
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
rm -rf .next
pnpm dev
```

**Prevention:**

- Do **not** run `pnpm build` in the same terminal session while `pnpm dev` is active. Stop dev first, or run build in a separate checkout/worktree.
- After `pnpm build`, always **restart** `pnpm dev` before manual browser testing — do not assume dev self-heals.
- Smoke-check after restart: open `/` and confirm a chunk URL from page source returns **200** (not 404).

## Server data loading (App Router)

**Do not** have Server Components or `page.tsx` **HTTP-fetch this app's own Route Handlers** (e.g. `fetch(\`http://${host}/api/weather\`)`). Nested self-requests in dev drop fields, time out, or race — weather once rendered without `climateNormals` / “Typical year” while `/api/weather` worked in curl.

**Do** put shared loader logic in `lib/*-service.ts` (see `lib/weather-service.ts`) and call it from both the Route Handler and the page. Reserve `fetch('/api/…')` for **client components** and external callers only.

## Server / client boundaries (App Router)

**Symptom:** browser shows **“Application error: a server-side exception has occurred”** (often on `/weather` or after adding `"use client"` wrappers). Terminal shows:

```text
Error: Functions are not valid as a child of Client Components.
```

**Cause:** A **Server Component** (`page.tsx`, layouts) passed a **function** to a Client Component — render props (`children={(x) => …}`), callbacks, or any non-serializable prop. Only plain data, elements, and `ReactNode` slots composed on the server are allowed.

**Do instead:**

- Keep **`page.tsx` as a Server Component**; put interactivity in leaf **`"use client"`** components.
- Pass **serializable props** (`string`, `number`, typed snapshots) or **server-rendered slots** (`climateSlot={<ServerChild />}`) — never functions.
- Components using **`useSearchParams()`** must sit inside a **`<Suspense>`** boundary (see `WeatherClientShell`, `WeatherLiveConditions`, `WeatherSearch`).
- After editing server/client splits, **`curl -I http://localhost:3000/<route>`** must be **200** — `pnpm build` alone does not catch runtime RSC serialization errors.

Reference pattern: `WeatherLiveConditions` (client refresh + conditions) + `WeatherClimateClient` (client fetch for deferred data) — not render-prop wrappers from `page.tsx`.

## Verify

Run `pnpm verify` before committing — there is no automatic pre-commit hook, so nothing else catches a broken build for you.

- `pnpm verify` = `tsc --noEmit` + `lint` + `node scripts/audit.js` + `build` + e2e (`pnpm e2e:smoke`, then `pnpm e2e:proof`). Set `FACTORY_SKIP_E2E=1` to skip e2e (factory/CI only).
- **Before push:** at minimum run **`pnpm build`** — Vercel runs ESLint and TypeScript inside `next build`; import lint and strict `tsc` both failed deploy after unit tests alone passed.
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