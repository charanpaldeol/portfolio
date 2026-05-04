# Factory goals — calculator & weather increments (cpdeol.com)

**Mode:** **Product increments** on top of the shipped `/calculator`, `/weather`, and nav surfaces. North star and machine source of truth: **`agents/factory-goal-spec.json`** (`goal_revision: factory-calc-weather-incremental-2026-05`).

## What must ship (this phase)

1. **Weather — location** — Visitors can **choose a location** on **`/weather`** (search / text / lat-lon) and see results; API supports **query flexibility** with safe defaults.
2. **Weather — trust** — **Clear errors and non-silent failures** when the API misbehaves; optional retry.
3. **Calculator — clarity** — **Layout and grouping** that make the keypad easy to use; **keyboard + visible focus** for accessibility.
4. **Calculator — metadata** — Sensible **title/description** for the `/calculator` route.
5. **Nav — discoverability** — **Calculator** and **Weather** stay obvious on **desktop and mobile** nav.

## Happy path after you change the goal or roadmap

From repo root, in order:

1. Edit **`agents/factory-goal-spec.json`** (`statement`, `roadmap_items`, bump **`goal_revision`** when the north star changes).
2. **`pnpm factory:goal-pivot`** — cancels **queued / in_progress / blocked** rows tied to the **previous** `goal_revision`.
3. **`pnpm factory:plan-from-goal`** — merges validated `roadmap_items` into **`agents/factory-roadmap.json`** (or edit the roadmap file directly when replacing the whole tranche).
4. **`pnpm factory:plan-next`** — enqueues missing roadmap ids onto **`agents/factory-queue.json`**.
5. **`pnpm factory:evaluate-goal`** — refreshes **`agents/factory-goal-state.json`**.
6. **Optional:** **`pnpm factory:research-once`** → **`pnpm factory:backlog:intake`** when you want LLM/Ollama proposals in **`backlog.md`**, then plan-next again.

**Default execution:** **`pnpm factory:run-once`** (isolated worktree). Use **`pnpm factory:run-once:main`** only when you intentionally want commits on `main` (see **`docs/factory/FACTORY_OPERATIONS.md`**).

## Constraints for implementers

- Follow **`agents/SKILL-developer.md`** and repo rules: **design tokens** (`DS` / theme classes), **no** new dependencies unless unavoidable.
- **`components/layout/Navbar.tsx`** and **`config/navigation.tsx`** may be edited for this goal (navbar + shared nav config).
- Do **not** edit frozen layout shell files unless required—prefer **`Navbar`** + **`config/navigation`** for links.

## Cursor-first workflow (recommended)

Use this when **Cursor** (or you manually) applies code changes instead of the **Claude Code** CLI. Factory scripts **do not** open Cursor; they only write a handoff file and run **verify** in a worktree.

1. **Pick the item id** — next non-done row in **`agents/factory-queue.json`**, or the id you are working on.
2. **Generate the handoff prompt** (from repo root):

   `pnpm factory:implement:cursor -- <ITEM_ID>`

   This writes **`agents/factory-logs/cursor-task-<ITEM_ID>.md`** (same prompt **`factory:run-once`** would feed to the default implementer).

3. **In Cursor** — open that file (or `@` it in chat) and implement the task on the branch worktrees use (**usually `main`**). Follow **`agents/SKILL-developer.md`** and repo rules.

4. **Gate locally** — **`pnpm verify`**, then **commit** (and push if your merge flow needs it) so the worktree created by **`factory:run-once`** includes your commits.

5. **Run the factory** — **`pnpm factory:run-once:cursor`** (same as `FACTORY_IMPLEMENT_BACKEND=cursor pnpm factory:run-once`). Preflight runs, then **`pnpm verify`** runs again inside the worktree; queue/runs update on success.

**Optional:** `export FACTORY_IMPLEMENT_BACKEND=cursor` in your shell if you prefer not to use the `:cursor` package scripts.

## How to run the factory (quick reference)

Run these from the **repository root** unless a script says otherwise.

| Command | Purpose |
| --- | --- |
| **`pnpm factory:preflight`** | Git / merge env / optional `gh` checks. Also runs automatically at the start of **`factory:run-once`**. |
| **`pnpm factory:status`** | Snapshot of queue, recent runs, log hints. |
| **`pnpm factory:plan-next`** | Enqueue work from **`agents/factory-roadmap.json`** into **`agents/factory-queue.json`**. |
| **`pnpm factory:implement <ID>`** | Default: spawns **Claude Code** CLI in cwd. **Cursor mode:** use **`pnpm factory:implement:cursor -- <ID>`** instead (writes handoff only). |
| **`pnpm factory:run-once`** | One full iteration: worktree, item **`spec.command`**, **`pnpm verify`**, commit/push/merge per policy. **Cursor mode:** **`pnpm factory:run-once:cursor`**. |
| **`pnpm factory:loop`** | Repeats planning/research/run-once style automation (see package script; set env to tune research and exit). |

**After you edit the goal** (`agents/factory-goal-spec.json`): **`pnpm factory:goal-pivot`**, **`pnpm factory:plan-from-goal`**, then **`pnpm factory:plan-next`** — details stay in **Factory behavior** below.

## Factory behavior

- **After you change the north star** (`agents/factory-goal-spec.json`): edit **`statement` / `roadmap_items`** and bump **`goal_revision`**, then run **`pnpm factory:goal-pivot`** (cancels stale queue rows), **`pnpm factory:plan-from-goal`** — which **refuses to merge** until every `roadmap_items` row **traces** the current `statement` (`traces_goal` or first `definition_of_done` bullet with keyword overlap) — then **`pnpm factory:plan-next`** so new work matches the revised goal. (Roadmap regen via market pipeline is an alternative to `plan-from-goal` when that fits your workflow.) Optional later: **`factory:doctor`** if meta / roadmap / queue revisions drift.
- **Execution roadmap (Eric / goal-truth, phases A–E):** **`docs/CODE-FACTORY-PLAN.md`** — verification gate, traceability to the goal, safe autonomy, env harness, learning loop.
- **Merge policy, preflight, default `FF_*` for new UI:** **`docs/factory/FACTORY_MERGE_POLICY.md`**; run **`pnpm factory:preflight`** on workers before loops (also runs at the start of each **`factory:run-once`**). **`factory:run-once`** runs `spec.command` / acceptance with **`bash -c`** (inherits the same **`PATH`** as the `pnpm factory:loop` process). If a command needs nvm loaded from a login shell, set **`FACTORY_BASH_LOGIN=1`** to use **`bash -lc`** instead.
- **Roadmap** is the source of truth: **`agents/factory-roadmap.json`** (kept in sync with **`agents/factory-goal-spec.json` `roadmap_items`** via **`pnpm factory:plan-from-goal`** or manual edits). Run tasks with **`pnpm factory:implement <ID>`** inside **`factory:run-once`**, or your agent loop.
- **Cursor-only (no Claude Code CLI):** set **`FACTORY_IMPLEMENT_BACKEND=cursor`** (or **`none`** / **`skip`**) for the process, or use **`pnpm factory:implement:cursor`** / **`pnpm factory:run-once:cursor`**. Then **`pnpm factory:implement <ID>`** only writes **`agents/factory-logs/cursor-task-<ID>.md`** and does not call **`claude`**. For **`pnpm factory:run-once`**: implement your changes **in Cursor on `main`**, **`pnpm verify`**, **commit** locally so the new worktree includes them, then run **`pnpm factory:run-once:cursor`** (or **`FACTORY_IMPLEMENT_BACKEND=cursor pnpm factory:run-once`**) — it still runs **`pnpm verify`** in the worktree and updates queue/runs; **`require_diff`** is relaxed when that env is set so a clean worktree does not fail before verify.
- **Meaningful diffs / reclaim / install retries / queue dedupe**: **`docs/factory/FACTORY_MEANINGFUL_WORK.md`** and **`docs/factory/FACTORY_OPERATIONS.md`**. Quick check: **`pnpm factory:doctor`**.
- **While verifying:** avoid **`factory:roadmap:refresh`** / market pipeline overwriting the roadmap—e.g. set **`FACTORY_MARKET_REFRESH_INTERVAL_MS=0`** for **`factory:swarm`**, or run **`factory:loop`** without refresh.
- **Research / intake:** Optional. **`backlog.md`** is cleaned; use **`## Factory research intake`** only if you add follow-ups.
- **Autonomous loop (`pnpm factory:loop`):** When the queue is below **`FACTORY_QUEUE_LOW_WATERMARK`**, the loop runs **`pnpm factory:research-once`** → **`factory:backlog:intake`** → **`factory:plan-next`**. Set **`OPENAI_API_KEY`** so the LLM can propose tasks from **`agents/factory-goal-spec.json`** + **`FACTORY_GOAL.md`** (model: **`FACTORY_RESEARCH_MODEL`**, default `gpt-4o-mini`). When **`agents/factory-goal-state.json`** is **`met`**, research runs in **improvement-only** mode (disable with **`FACTORY_RESEARCH_IMPROVEMENT_WHEN_MET=0`**). Optional **`FACTORY_RESEARCH_HOOK`** runs first (bash snippet) to append backlog rows yourself. Calculator/weather **code signals** run only if the goal `statement` mentions calculator, weather, or navbar (**`FACTORY_RESEARCH_CALC_WEATHER=force`** always runs them; **`0`** skips). To **exit** when the goal is met, the queue is empty, and research adds nothing for several rounds, set **`FACTORY_AUTONOMOUS_STALL_LOOPS`** (e.g. `5`); **`0`** never exits for that reason. The loop **resets the stall counter** when **`goal_revision`** or the goal **`statement`** text changes so a **new north star** (e.g. tomorrow “game XYZ”) does not inherit yesterday’s “done + no research” exit counter — still run **`pnpm factory:goal-pivot`** and **`pnpm factory:plan-from-goal`** after you change the goal so queue/roadmap align. Disable the research→intake→plan block entirely with **`FACTORY_RESEARCH_PIPELINE=0`**.

## §6 Active research bet

- **Bet:** *Incremental cpdeol.com calculator + weather UX (location search, errors, layout/a11y, API params, metadata, nav)—see `factory-goal-spec.json` roadmap rows.*
