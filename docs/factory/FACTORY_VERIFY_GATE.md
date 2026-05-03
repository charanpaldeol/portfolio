# Factory verify gate (Phase A1)

## Preflight (Phase C)

Before claiming a queue item, `factory:run-once` runs the same checks as **`pnpm factory:preflight`** (`lib/agent-factory/factory-preflight.ts`): `git` **`origin`** remote, merge-strategy env consistency, **`gh`** when `FACTORY_MERGE_STRATEGY=pr`, and deploy URL env when **`FACTORY_POST_MERGE_UAT=1`**. Run **`pnpm factory:preflight`** alone in CI to fail fast on a broken worker. Merge policy and **`FF_*`** defaults: **`docs/factory/FACTORY_MERGE_POLICY.md`**.

---

`pnpm factory:run-once` runs **`pnpm verify`** in the item worktree **after** `spec.command` and **before** git commit. That matches the **`verify` script in `package.json`**: `tsc`, `lint`, `node scripts/audit.js`, `build`, port cleanup (`dev:free3000`), `e2e:smoke`, `e2e:goal-smoke`, then `e2e:proof` against `playwright.verify.config.ts` (production `next start` + Playwright).

There is **no default lighter path** for marking a queue item done when code ships: autonomous runs use the **same** verification chain as governance and `.cursorrules` (“before every commit: `pnpm verify`”).

## Goal-truth smoke (Phases A2–A3)

- **`e2e/goal-smoke.spec.ts`** holds **deterministic** checks keyed to roadmap ids in **`agents/factory-goal-spec.json`** (calculator behavior, weather API + page, navbar desktop + mobile). If the stated goal claims a URL or flow, Playwright failures indicate it is missing or regressed.
- **`pnpm e2e:goal-smoke`** runs only that file (Chromium, `playwright.verify.config.ts`) for a **short** DOM/API pass. It is part of **`pnpm verify`**, so **`factory:run-once`** always exercises this path after the broad route smoke. There is no separate “UI-only” skip of the rest of `verify`; goal-smoke is the north-star slice, not a replacement for the full gate.

## Intentional differences (not skips)

| Path | What it does |
|------|----------------|
| **`pnpm verify:full`** | Adds **`pnpm test --run`** (Vitest). Not part of `pnpm verify`. Factory does not run `verify:full` unless you add it to `spec.acceptance` for a specific item. |
| **GitHub CI** (`.github/workflows/ci.yml`) | Splits typecheck, lint, build, unit tests across jobs; **e2e** may run in a separate workflow. Collectively CI may equal or exceed `verify`; factory still keys off **`pnpm verify`** so local/merge intent stays one command. |
| **`FACTORY_POST_MERGE_UAT`** | After a merge to `main`, optional **production** smoke/proof (`e2e:prod-smoke` / `e2e:prod-proof`). This is **additive** UAT against a live URL; it does **not** replace pre-merge `pnpm verify`. |

## If verify fails in a worktree

Ensure `pnpm install --frozen-lockfile` succeeded and Playwright browsers are available (same as running `pnpm verify` from a fresh clone on the host).
