# Factory merge policy and safe UI defaults (Phase C)

Autonomous factory runs must not widen production blast radius without an explicit, documented policy choice. This file is the operator-facing source of truth for **merge strategy**, **money-moving production**, **post-merge deploy checks**, and **default feature flags** for new user-visible work.

## Environment variables

| Variable | Role |
|----------|------|
| **`FACTORY_MERGE_STRATEGY`** | `direct` — push merged commits to `main` from the merge worktree. `pr` — open a GitHub PR from branch `factory-main` for human or automerge review. |
| **`FACTORY_MONEY_MOVING_PROD`** | When `1`, default merge strategy becomes **`pr`** unless `FACTORY_MERGE_STRATEGY` is set explicitly. Signals Stripe, payouts, or other production money paths: **no silent direct push** without an explicit risk acceptance (see below). |
| **`FACTORY_PR_AUTOMERGE`** | With `pr` mode: run `gh pr merge --auto` after PR creation. |
| **`FACTORY_PR_WAIT_FOR_MERGE`** | With `pr` mode: poll until the PR is merged (use when a human merges manually). |
| **`FACTORY_POST_MERGE_UAT`** | When `1`, after a successful merge to `main`, run deploy smoke (`pnpm deploy:smoke`) and optional prod Playwright (`e2e:prod-smoke` / `e2e:prod-proof`) against a live URL. |
| **`FACTORY_DEPLOY_SMOKE_URL`** / **`DEPLOY_URL`** / **`PLAYWRIGHT_PROD_BASE_URL`** | Base URL for post-merge UAT and `deploy:smoke` (first non-empty wins in factory runtime). Required when **`FACTORY_POST_MERGE_UAT=1`**. |
| **`FACTORY_SKIP_PREFLIGHT`** | Set to `1` **only** for local debugging — skips `factory:preflight` checks (not for production workers). |
| **`FACTORY_I_ACCEPT_DIRECT_MERGE_RISK`** | Set to `1` only if you intentionally combine **`FACTORY_MONEY_MOVING_PROD=1`** with **`FACTORY_MERGE_STRATEGY=direct`** (discouraged). |

Implementation reference: `scripts/agent-factory/factory-run-once.ts` (merge + UAT) and `scripts/agent-factory/factory-preflight.ts`.

## Default narrative

1. **Risky surfaces (default for real product and money-moving contexts)**  
   Use **`FACTORY_MERGE_STRATEGY=pr`** (or leave unset with **`FACTORY_MONEY_MOVING_PROD=1`**, which defaults to `pr`). Require **`gh`** authenticated for the repo. Prefer human review on the PR, or use **`FACTORY_PR_AUTOMERGE`** / **`FACTORY_PR_WAIT_FOR_MERGE`** only when branch protection and review rules match your org policy.

2. **Low-risk / smoke / docs-only automation**  
   **`FACTORY_MERGE_STRATEGY=direct`** may be acceptable when **`FACTORY_MONEY_MOVING_PROD`** is unset or `0`, the queue only touches allowlisted paths (see `.cursorrules` / governance), and you accept immediate push to `main`. **Never** combine direct push with **`FACTORY_MONEY_MOVING_PROD=1`** unless **`FACTORY_I_ACCEPT_DIRECT_MERGE_RISK=1`** is set (preflight blocks otherwise).

3. **Post-merge production checks**  
   If **`FACTORY_POST_MERGE_UAT=1`**, you must supply a deploy base URL so `pnpm deploy:smoke` and prod e2e have a target. **`pnpm factory:preflight`** fails fast if this combination is misconfigured.

## `pnpm factory:preflight`

Run **before** `factory:run-once` / `factory:loop` in CI or on a worker host. It verifies:

- Git repo with **`origin`** remote configured.
- **`FACTORY_MONEY_MOVING_PROD=1` + `FACTORY_MERGE_STRATEGY=direct`** is blocked unless **`FACTORY_I_ACCEPT_DIRECT_MERGE_RISK=1`**.
- In **`pr`** mode: **`gh`** on PATH and **`gh auth status`** succeeds.
- If **`FACTORY_POST_MERGE_UAT=1`**: **`FACTORY_DEPLOY_SMOKE_URL`**, **`DEPLOY_URL`**, or **`PLAYWRIGHT_PROD_BASE_URL`** is set.

`factory:run-once` invokes the same checks automatically before claiming the next queue item (unless **`FACTORY_SKIP_PREFLIGHT=1`**).

## New user-visible factory work — feature flags (`FF_*`)

**Norm:** New **user-visible** sections or behavior shipped by the factory should default to **`lib/feature-flags.ts`** with an env gate **`FF_<FLAG_NAME>=1`** (see `.cursorrules` / `docs/GOVERNANCE.md` AI-agent rules), unless the task explicitly says the feature must be always-on.

- Add `if (featureFlag("your-flag-slug")) { ... }` in server or layout code paths that render the UI.
- Document the exact env key in the item report and in Vercel/host env (e.g. `FF_NEW_WIDGET=1`).

**Factory Definition of Done:** When a roadmap or queue item adds or changes customer-visible UI, include in **`definition_of_done`** (or acceptance) that the change is behind a flag **or** cite the prompt that waived flags. See `docs/factory/DEFINITION_OF_DONE.md`.
