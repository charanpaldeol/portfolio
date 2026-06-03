# Project standards (always apply)

> **Purpose:** Always-on agent policy for scope, copy, verification, file metadata, and production guardrails on cpdeol.com.

App Router pitfalls (dev cache, self-fetch, RSC): see `nextjs-pitfalls.md` (imported via `CLAUDE.md`).

## Workflow (mistakes)

When you make a mistake the user cares about, end with: **Update `CLAUDE.md` or `.claude/rules/` so this does not repeat.** (Also in `CLAUDE.md` → Workflow.)

## File purpose (all file types)

When you **create** or **materially edit** any project file, add or update a one-line purpose at the top. State the file’s **role in the project**, not line-by-line behavior.

| File kind | Where to put it |
|-----------|-----------------|
| `.ts`, `.tsx`, `.js`, `.mjs`, `.cjs` | `// Purpose: …` (first line, or after initial comments) |
| `.css`, `.module.css` | `/* Purpose: … */` |
| `.sh` | `# Purpose: …` (immediately after `#!/usr/bin/env …` if present) |
| `.md`, `.mdc` | `> **Purpose:** …` (line 1, or immediately after YAML frontmatter) |
| `.sql` | `-- Purpose: …` |
| `.html`, `.svg` (when hand-edited) | `<!-- Purpose: … -->` |
| `.yaml`, `.yml` | `# Purpose: …` |
| `.json` (e.g. `launch.json`) | `// Purpose: …` on line 1 if JSONC; otherwise nearest parent README |

**Skills** (`.claude/skills/*/SKILL.md`): frontmatter `description` satisfies this if it states the file’s role; otherwise add `> **Purpose:**` after frontmatter.

## Scope discipline

- Only change files required for the task. If the prompt names specific files, stay within that list.
- If a required change touches a frozen file (see `layout-frozen-files.md`), stop and ask for explicit approval.

## Copy discipline

- Do **not** rephrase, rewrite, shorten, or “improve” copy unless exact replacement text is provided **or** the user explicitly requests a copy audit/rewrite and names the files or sections to change (then apply only what they approve).

## Verification bar

| When | Command |
|------|---------|
| Before **push** | `pnpm ship-check` (must pass) |
| Before **commit** when user asked to commit | `pnpm verify` (must pass) |

See `CLAUDE.md` → Verification. `ship-check` = `tsc` + `lint` + `audit` + `build` — same gates Vercel uses, without e2e.

After editing `lib/` or API routes: `pnpm exec tsc --noEmit` on touched paths if you skip full `ship-check`.

## TypeScript strict indexing (Vercel type-check gate)

With `strict` / `noUncheckedIndexedAccess`, **`arr[i]` is `T | undefined`.** Guard on index does not narrow the element.

```ts
const bucket = buckets[month - 1]
if (!bucket) continue
bucket.mean.push(mean)
```

## ESLint imports (Vercel build gate)

`sort-imports` (error) and `import/order` (warn) run inside `next build`.

1. **Never mix `type` and value in one import** — separate lines.
2. **Alphabetize `@/lib/*` paths** and named members within imports.
3. **After editing imports:** `pnpm exec eslint <touched-files>` before push.

Pure helpers for Route Handlers / Server Components live in `lib/`, not `"use client"` files.

**Colocated tests:** `lib/*.test.ts` uses `./foo`, not `@/lib/foo`, unless siblings already use `@/`.

**Types files:** read and merge `lib/*-types.ts`; never self-import; grep exporters after edits.

## Agent-safe development defaults

- New user-visible features behind `lib/feature-flags.ts` when appropriate.
- Feature data in `/lib/[feature]-data.ts`; components receive props (no internal fetch).

## Redirect and canonical safety (production guardrail)

- No host-level `www` ↔ apex redirects in repo config unless the user explicitly asks.
- Verify both hosts for HTML and a real hashed chunk URL before shipping redirect changes.
- Block if static assets enter cross-host redirect loops or exceed one redirect hop.
