---
name: verify-and-audit
description: Run portfolio verification (tsc, lint, audit, build, e2e) and triage failures. Use before committing or when asked to verify the app.
---

# Verify and audit

> **Purpose:** Run and triage `pnpm verify` and `scripts/audit.js` failures before commit or PR.

## When to use

- Before committing or opening a PR
- After UI or routing changes
- When `pnpm verify` or audit failures are reported

## Steps

1. From repo root, run:

   ```bash
   pnpm verify
   ```

2. For hero-only compliance:

   ```bash
   node scripts/audit.js hero
   ```

3. For full design + architecture audit:

   ```bash
   node scripts/audit.js
   ```

## If verify fails

- **tsc / lint**: fix TypeScript and ESLint issues in changed files only (scope discipline).
- **audit.js**: read violation source (`docs/DESIGN.md`, `docs/code-architecture-review.md`, `docs/GOVERNANCE.md`).
- **build**: check `pnpm build` output for missing imports or Next.js errors.
- **e2e**: run `pnpm e2e:smoke` then `pnpm e2e:proof` separately; ensure dev server is not blocking port 3000.

## Definition of done

- `pnpm verify` exits 0
- No new hardcoded hex colors or frozen-file edits unless explicitly requested
