---
name: verify-and-audit
description: Run portfolio verification (ship-check, full verify, audit) and triage failures. Use when asked to verify or before commit/ship.
---

# Verify and audit

> **Purpose:** Run and triage `pnpm ship-check`, `pnpm verify`, and `scripts/audit.js` failures.

## When to use

- User asked to verify, commit, or push
- After UI or routing changes
- When verify or audit failures are reported

## Steps

1. **Default (push / quick gate):**

   ```bash
   pnpm ship-check
   ```

2. **Full bar (user asked to commit or merge):**

   ```bash
   pnpm verify
   ```

3. Hero-only:

   ```bash
   node scripts/audit.js hero
   ```

## If ship-check or verify fails

- **tsc / lint**: fix in changed files only (scope discipline). Run `pnpm exec eslint <files>` after import edits.
- **audit.js**: read violation source (`docs/DESIGN.md`, `docs/GOVERNANCE.md`).
- **build**: check prebuild (`build:content`, `sync:graph`) then Next.js errors.
- **e2e** (verify only): `pnpm e2e:smoke` then `pnpm e2e:proof`; free port 3000 first (`pnpm dev:free3000`).

## Definition of done

- `pnpm ship-check` exits 0 before push
- `pnpm verify` exits 0 before commit when user requested commit
- No new hardcoded hex colors or frozen-file edits unless explicitly requested
