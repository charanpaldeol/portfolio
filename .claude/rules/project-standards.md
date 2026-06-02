# Project standards (always apply)

> **Purpose:** Always-on agent policy for scope, copy, verification, file metadata, and production guardrails on cpdeol.com.

## File purpose (all file types)

When you **create** or **materially edit** any project file, add or update a one-line purpose at the top. State the file’s **role in the project**, not line-by-line behavior. Keep it current when the file’s role changes.

| File kind | Where to put it |
|-----------|-----------------|
| `.ts`, `.tsx`, `.js`, `.mjs`, `.cjs` | `// Purpose: …` (first line, or after initial comments) |
| `.css`, `.module.css` | `/* Purpose: … */` |
| `.sh` | `# Purpose: …` (immediately after `#!/usr/bin/env …` if present) |
| `.md`, `.mdc` | `> **Purpose:** …` (line 1, or immediately after YAML frontmatter) |
| `.sql` | `-- Purpose: …` |
| `.html`, `.svg` (when hand-edited) | `<!-- Purpose: … -->` |
| `.yaml`, `.yml` | `# Purpose: …` |
| `.json` (e.g. `launch.json`) | `// Purpose: …` on line 1 if the file is JSONC in this repo; otherwise document in the nearest parent `README.md` or `CLAUDE.md` table |

**Skills** (`.claude/skills/*/SKILL.md`): frontmatter `description` satisfies this rule if it states the file’s role; otherwise add `> **Purpose:**` after the frontmatter.

**Binary or generated files** (images, lockfiles, build output): do not add headers; skip unless you own the generator script—then purpose the script.

## Scope discipline

- Only change files required for the task. If the prompt names specific files, stay within that list.
- If a required change touches a frozen file (see `layout-frozen-files.md`), stop and ask for explicit approval.

## Copy discipline

- Do not rephrase, rewrite, shorten, or “improve” any copy unless exact replacement text is provided.

## Verification bar (before committing)

- Run `pnpm verify` and ensure it passes (see CLAUDE.md → Verify for what it covers).
- **Before push**, at minimum run **`pnpm build`** (or `pnpm lint && pnpm exec tsc --noEmit`). Vercel runs **ESLint and TypeScript** inside `next build`. Targeted eslint/vitest on touched files is not enough — weather shipped with green unit tests but failed on import lint, then on strict `tsc`.

## TypeScript strict indexing (Vercel type-check gate)

With `strict` / `noUncheckedIndexedAccess`, **`arr[i]` is `T | undefined`.** A prior guard on `i` (e.g. `month >= 1 && month <= 12`) does **not** narrow the array element — Vercel failed on `bucket.mean.push` in `lib/weather-climate.ts`.

**Pattern — always narrow after index access:**

```ts
const bucket = buckets[month - 1]
if (!bucket) continue
bucket.mean.push(mean)
```

Same for `valid[0]`, `items.at(n)`, etc. — assign, then `if (!x) return` / `continue` before use.

**After editing `lib/` or API routes**, run `pnpm exec tsc --noEmit` or full `pnpm build` before push, not only Vitest.

## ESLint imports (Vercel build gate)

`eslint.config.mjs` enables **`sort-imports` (error)** and **`import/order` (warn)**. Next.js runs both during `next build`. Weather work shipped twice with green unit tests but failed deploy on these rules.

**Do this on every new/edited import block:**

1. **Never mix `type` and value in one import.** Use separate lines (same module is fine):
   ```ts
   import { geocodeCity, reverseGeocodeCity } from "@/lib/weather-geocode"
   import type { GeoPlace } from "@/lib/weather-geocode"
   ```
   Not `{ type GeoPlace, geocodeCity, … }` — `sort-imports` sorts **members** alphabetically (`GeoPlace` before `geocodeCity` breaks value order).

2. **Alphabetize `@/lib/*` paths** (`import/order`): e.g. `weather-climate` before `weather-code` before `weather-geocode`.

3. **Alphabetize named members** within `{ … }` when multiple values share one import.

4. **After editing imports**, run `pnpm exec eslint <touched-files>` before commit/push.

**Server vs client:** pure helpers used by Route Handlers or Server Components live in `lib/`, not in `"use client"` files — never import server callers from client modules.

**Server pages vs API routes:** Server Components and `app/**/page.tsx` must **not** `fetch` their own Route Handlers over HTTP. Share logic via `lib/*-service.ts` and import from both the handler and the page (`lib/weather-service.ts` is the reference). Self-fetch caused missing weather climate data and flaky local dev.

**Local dev 404 on `_next/static/*`:** stale `.next` after `pnpm build` while `pnpm dev` runs — stop dev, `rm -rf .next`, restart dev (see CLAUDE.md → Local dev).

**Types files:** read and merge `lib/*-types.ts`; never self-import; grep exporters after edits.

**Colocated tests:** `lib/*.test.ts` imports sibling modules with `./foo`, not `@/lib/foo`, unless an existing test in that folder uses `@/`.

## Agent-safe development defaults

- Prefer shipping new user-visible features behind a server-side flag (see `lib/feature-flags.ts`).
- All feature data should live in `/lib/[feature]-data.ts` and be passed into components as props (components should not fetch internally).

## Redirect and canonical safety (production guardrail)

- Do not add host-level redirects (`www` ↔ apex) in repo config (`vercel.json`, `next.config.ts`) unless the user explicitly asks for that change.
- Before shipping any host/canonical redirect change, verify both HTML and static assets for both hosts. For assets, use a real hashed chunk from `.next/` build output or page source — a literal `*` in the URL will 404 and hide problems:
  - `curl -I https://cpdeol.com/`
  - `curl -I https://www.cpdeol.com/`
  - `curl -I https://cpdeol.com/_next/static/chunks/<actual-hashed-chunk>.js`
  - `curl -I https://www.cpdeol.com/_next/static/chunks/<actual-hashed-chunk>.js`
- Block the change if any asset path enters cross-host redirect loops or exceeds one redirect hop.
