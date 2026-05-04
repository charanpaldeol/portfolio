# Factory operations playbook

One place for **worker tuning**, **recovery**, and **hybrid** workflows. See also `FACTORY_MEANINGFUL_WORK.md` (shipping-path gates).

## Before you start workers

1. **`pnpm factory:doctor`** — Node/pnpm, `pnpm-lock.yaml`, reclaim thresholds, implementer env hints.
2. **Commit and push** `main` so worktrees pick up the same `factory-run-once` logic.
3. **Prefer a single worker** claiming the queue, or raise stale thresholds so long `factory:implement` runs are not reclaimed mid-flight.

## Stale reclaim (queue + runs)

`pnpm factory:reclaim` resets:

- **`in_progress`** queue rows with old **`claimed_at`** → back to **`queued`**
- **`started`** runs older than **`FACTORY_STALE_RUN_MS`** → **`failed`**

Env (blanks and **`0`** fall back to defaults; values are **floored** so instant reclaim cannot happen by mistake):

| Variable | Default (effective) | Floor |
|----------|---------------------|-------|
| **`FACTORY_STALE_CLAIM_MS`** | 15 min | 2 min |
| **`FACTORY_STALE_RUN_MS`** | 60 min | 5 min |

If you saw **`Reclaimed stale run after 0s`**, an empty or zero env was treated as **0 ms**. That is fixed: use unset, or set an explicit positive value.

## Implement on `main` (no agent worktree)

Set **`FACTORY_IMPLEMENT_ON_MAIN=1`** (or run **`pnpm factory:run-once:main`**) so **`spec.command`**, **`pnpm verify`**, **`git commit`**, and **`git push origin main`** run in the **repository root** on branch **`main`**, instead of creating **`.agent-worktrees/<ITEM_ID>/`**.

Requirements:

- Process **cwd** must be the repo top-level (same as **`FACTORY_ROOT`** / `git rev-parse --show-toplevel`).
- Current branch must be **`main`**; working tree **clean** before the run (no uncommitted changes).
- **`FACTORY_MERGE_STRATEGY=direct`** (or default when not money-moving). PR mode is incompatible because there is no agent branch.
- Before implement, the script **`git fetch origin main`** and **`git merge origin/main`** so local `main` is up to date.
- **`pnpm install`** in the root is **skipped** by default (your dev tree already has `node_modules`). Set **`FACTORY_IMPLEMENT_ON_MAIN_INSTALL=1`** to run the same retried install as worktree mode.

Risk: a failed verify still leaves **local** edits on `main`; you revert or fix before the next run. Prefer the default worktree flow for isolation unless you explicitly want commits directly on `main`.

## Worktree install retries

`factory:run-once` runs **`pnpm install`** with retries (worktree path only, unless **`FACTORY_IMPLEMENT_ON_MAIN_INSTALL=1`**):

| Variable | Default |
|----------|---------|
| **`FACTORY_INSTALL_RETRIES`** | `2` |
| **`FACTORY_INSTALL_RETRY_DELAY_MS`** | `8000` |
| **`FACTORY_INSTALL_RETRY_NO_OFFLINE`** | `1` (retry attempts use plain `pnpm install` without `--prefer-offline`) |

## Queue deduplication

Same **title** + **`goal_revision`**, **`queued`** only: keep the row with the **highest `_V##`** suffix in the **id** (e.g. `FACTORY_VERIFY_CALCULATOR_V13` wins over `_V10`); cancel the rest as **`cancelled`**.

```bash
# Preview (no write)
FACTORY_QUEUE_DEDUPE_DRY_RUN=1 pnpm factory:queue:dedupe

pnpm factory:queue:dedupe
```

Optional: **`FACTORY_QUEUE_DEDUPE_REASON=…`** overrides the default **`cancel_reason`**.

## Implementer reliability

- **Keys** must be present in the **same** environment as `pnpm factory:run-once` (not only Cursor).
- **`FACTORY_CLAUDE_BIN`** → **`scripts/agent-factory/aider-bridge.sh`**: set **`GEMINI_API_KEY`** (and **`AIDER_MODEL`** if not default).
- **Smoke:** run **`pnpm factory:implement <ITEM_ID>`** in a throwaway worktree and confirm edits under **`app/`** (meaningful-path rules apply on merge).

## Cursor-first (author in IDE, factory verifies)

```bash
pnpm factory:implement:cursor -- <ITEM_ID>
# implement on main, commit, then:
pnpm factory:run-once:cursor
```

## Related commands

| Command | Purpose |
|---------|---------|
| **`pnpm factory:stabilize`** | Reclaim + maintenance |
| **`pnpm factory:status`** | Snapshot; optional stall reclaim |
| **`pnpm factory:goal-pivot`** | Cancel stale queue rows when goal revision changes |
