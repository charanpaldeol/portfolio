# Factory: meaningful product work

This document describes how **`factory:run-once`** rejects no-op or meta-only commits, and what to implement next so the loop reliably improves **UI, APIs, and tooling**.

## What shipped in code

1. **Non-shipping filter** — `.gitignore` is treated like `agents/` / `docs/`: a diff that touches **only** those paths (plus `backlog.md`, `README.md`) does **not** satisfy `require_diff`.
2. **Meaningful path gate** (default **on**) — for the **stock** command `pnpm -s factory:implement <ITEM_ID>`, after `spec.command` the worktree must include at least one changed file under:
   - `app/`, `components/`, `lib/`, `config/`, `scripts/`, `e2e/`, `public/`
3. **Escape hatches**
   - **`FACTORY_REQUIRE_MEANINGFUL_PATHS=0`** — disable the meaningful-path check (e.g. tasks that only touch root `middleware.ts` or `next.config.ts` via a **custom** `spec.command`).
   - **`FACTORY_MEANINGFUL_PATH_PREFIXES`** — comma-separated extra roots (each entry may omit trailing `/`), appended to the default list.

Implementation: `lib/agent-factory/require-diff-guards.ts` (pure helpers + tests), used from `scripts/agent-factory/factory-run-once.ts`.

## Next implementations (priority order)

### A. Reliable implementer in the worktree

- **One working backend**: stable `FACTORY_CLAUDE_BIN` (aider bridge + `GEMINI_API_KEY`, or Claude Code / Gemini CLI with valid keys in the **same** environment as `pnpm factory:run-once`).
- **Document in shell profile or worker env** — factory does not load `.env` for implement; keys must reach the child process.

### B. Task quality

- **Narrow `definition_of_done`** — name files or routes (`app/calculator/page.tsx`, `/api/weather`, …), not “fix calculator” alone.
- **`spec.acceptance`** — one or two shell checks (e.g. `rg`, small node script) that encode the behavior so verify + acceptance both fail if the implementer stubs.

### C. Queue hygiene

- **Deduplicate** repeated “fix X V7…V12” rows; **one** active slice per theme after `factory:goal-pivot` / `plan-from-goal`.
- Prefer **`require_diff: true`** and stock `pnpm -s factory:implement <id>` so the meaningful-path gate applies.

### D. Cursor-first path for hard UI

- **`FACTORY_IMPLEMENT_BACKEND=cursor`** — you ship the diff in Cursor on `main`; run-once still runs **`pnpm verify`** and merge. Best when CLIs are flaky.

### E. Optional: merge / root-only tasks

- If you add tasks that only change `middleware.ts`, root config, or `styles/`, either:
  - add a prefix via **`FACTORY_MEANINGFUL_PATH_PREFIXES`** (e.g. `styles,middleware.ts` is awkward for single files — prefer moving work under `lib/` or **`FACTORY_REQUIRE_MEANINGFUL_PATHS=0`** for that item with a custom command), or
  - extend default prefixes in `require-diff-guards.ts` after team agreement (watch ESLint frozen-file rules).

## Definition of done for this doc

- New behavior is covered by **`lib/agent-factory/require-diff-guards.test.ts`**.
- Run **`pnpm verify`** before merge.
