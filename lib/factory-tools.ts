export type FactoryToolDoc = {
  /** Must match the script basename in `scripts/agent-factory/<id>.ts` */
  id: string
  title: string
  purpose: string
  howToUse: string[]
  commands: string[]
  relatedFiles: string[]
}

export const FACTORY_TOOLS: FactoryToolDoc[] = [
  {
    id: "factory-loop",
    title: "Factory loop",
    purpose:
      "Continuously runs `factory:reclaim`, `factory:evaluate-goal`, then (when queued count is below `FACTORY_QUEUE_LOW_WATERMARK`, default 20) `factory:research-once` (OpenAI-compatible goal LLM + optional hook + optional calc/weather code signals), `factory:backlog:intake`, and `factory:plan-next`. Every iteration ends with `factory:run-once` (stops the loop on non-zero exit). Optional `FACTORY_AUTONOMOUS_STALL_LOOPS` exits when the goal is `met`, the queue is empty, and research repeatedly adds nothing.",
    howToUse: [
      "Use when you want one worker running continuously.",
      "Stops if `factory:run-once` returns non-zero.",
      "Without API keys: tries local Ollama (`FACTORY_RESEARCH_OLLAMA_URL`, default `http://127.0.0.1:11434`; disable probe with `FACTORY_RESEARCH_TRY_OLLAMA=0`), then syncs `factory-goal-spec.json` `roadmap_items` into backlog intake (`FACTORY_RESEARCH_GOAL_SPEC_FALLBACK=0` to disable). With keys: set `FACTORY_RESEARCH_API_KEY` or `OPENAI_API_KEY`, optional `FACTORY_RESEARCH_OPENAI_BASE` + `FACTORY_RESEARCH_MODEL`. Set `FACTORY_RESEARCH_HOOK` for a bash snippet before built-in research.",
    ],
    commands: ["pnpm factory:loop", "FACTORY_RESEARCH_PIPELINE=0 pnpm factory:loop"],
    relatedFiles: [
      "scripts/agent-factory/factory-loop.ts",
      "scripts/agent-factory/factory-research-once.ts",
      "scripts/agent-factory/factory-research-calc-weather-once.ts",
      "scripts/agent-factory/factory-backlog-intake.ts",
      "scripts/agent-factory/factory-plan-next.ts",
      "scripts/agent-factory/factory-run-once.ts",
    ],
  },
  {
    id: "factory-swarm",
    title: "Factory swarm",
    purpose:
      "Runs multiple worker loops in parallel for higher throughput, and periodically runs `factory:roadmap:refresh` (market scan → candidates → product select → roadmap generate).",
    howToUse: [
      "Set `FACTORY_WORKERS` to control worker count.",
      "Market refresh: `FACTORY_MARKET_REFRESH_INTERVAL_MS` (default 3600000 = 1h; set 0 to disable).",
      "First market run delay: `FACTORY_MARKET_REFRESH_STAGGER_MS` (default 10000).",
    ],
    commands: ["FACTORY_WORKERS=5 pnpm factory:swarm"],
    relatedFiles: [
      "scripts/agent-factory/factory-swarm.ts",
      "scripts/agent-factory/factory-loop.ts",
      "scripts/agent-factory/factory-roadmap-refresh.ts",
    ],
  },
  {
    id: "factory-preflight",
    title: "Factory worker preflight",
    purpose:
      "Validates git `origin`, merge-strategy env (`FACTORY_MERGE_STRATEGY`, `FACTORY_MONEY_MOVING_PROD`), GitHub CLI auth when PR mode, and deploy URL env when `FACTORY_POST_MERGE_UAT=1` — before `factory:run-once` claims work. The same checks run automatically at the start of each `factory:run-once` (skip with `FACTORY_SKIP_PREFLIGHT=1` for local debugging only).",
    howToUse: [
      "Run in CI or on a worker host before starting `factory:loop` or scheduled `factory:run-once`.",
      "Read `docs/GOVERNANCE.md` for merge vs PR vs money-moving defaults.",
    ],
    commands: ["pnpm factory:preflight"],
    relatedFiles: ["scripts/agent-factory/factory-preflight.ts", "lib/agent-factory/factory-preflight.ts", "docs/GOVERNANCE.md"],
  },
  {
    id: "factory-run-once",
    title: "Run one factory item",
    purpose:
      "Preflight (git origin, optional `gh`, optional deploy URL for post-merge UAT), then claims one queued item, runs its `spec.command` in a clean worktree (or on `main` when `FACTORY_IMPLEMENT_ON_MAIN=1`), runs `pnpm verify` (same bar as human pre-merge: tsc, lint, audit, build, e2e smoke, e2e:goal-smoke, e2e:proof), optional `spec.acceptance` shell checks, optional `spec.require_diff`, then commits/pushes/merges when there are changes.",
    howToUse: [
      "Use for debugging a single iteration.",
      "Use with a single queued item when you want one pass then exit.",
      "Per-item checks: set `spec.acceptance` to a command or string array; set `spec.require_diff: true` to fail no-op commands.",
      "Meaningful diffs: stock `pnpm -s factory:implement <id>` must touch roots under `app/`, `components/`, `lib/`, `config/`, `scripts/`, `e2e/`, or `public/`; `.gitignore`-only diffs fail. Disable with `FACTORY_REQUIRE_MEANINGFUL_PATHS=0`; extend with `FACTORY_MEANINGFUL_PATH_PREFIXES`. See `docs/GOVERNANCE.md` and factory env for install retries and reclaim.",
      "Commit on current `main` (no agent worktree): `pnpm factory:run-once:main` or `FACTORY_IMPLEMENT_ON_MAIN=1 pnpm factory:run-once`. Requires cwd at repo root, checkout on `main`, clean tree, `FACTORY_MERGE_STRATEGY=direct`, merge `origin/main` before implement. Optional `FACTORY_IMPLEMENT_ON_MAIN_INSTALL=1` runs `pnpm install` in the root.",
      "Cursor-only implement: `pnpm factory:run-once:cursor` or `FACTORY_IMPLEMENT_BACKEND=cursor` (see `agents/factory-goal-spec.json` and optional goal prose in `agents/`).",
      "Default `pnpm -s factory:implement <id>` runs `pnpm` directly (no shell). Other `spec.command` values and acceptance checks use `bash -c` (inherits `PATH`). Set `FACTORY_BASH_LOGIN=1` for `bash -lc` if nvm needs a login profile.",
    ],
    commands: [
      "pnpm factory:run-once",
      "pnpm factory:run-once:main",
      "FACTORY_IMPLEMENT_ON_MAIN=1 pnpm factory:run-once",
      "pnpm factory:run-once:cursor",
      "FACTORY_IMPLEMENT_BACKEND=cursor pnpm factory:run-once",
    ],
    relatedFiles: [
      "scripts/agent-factory/factory-run-once.ts",
      "lib/agent-factory/factory-preflight.ts",
      "lib/agent-factory/item-spec.ts",
      "lib/agent-factory/require-diff-guards.ts",
      "docs/GOVERNANCE.md",
      "agents/factory-queue.json",
      "agents/factory-runs.json",
    ],
  },
  {
    id: "factory-plan-next",
    title: "Planner: enqueue next work",
    purpose:
      "Refills the queue from the roadmap. If the roadmap file has **zero** rows, runs market research refresh (scan → score → select → generate roadmap) then retries. If every roadmap id is already on the queue (non-cancelled), it does **not** refresh the roadmap. With `FACTORY_GOAL_STATE_CONTROLS_PLAN=1`, skips enqueue when `agents/factory-goal-state.json` status is `met`.",
    howToUse: ["Use when the queue is low and you want the factory to enqueue next work."],
    commands: ["pnpm factory:plan-next", "FACTORY_GOAL_STATE_CONTROLS_PLAN=1 pnpm factory:plan-next"],
    relatedFiles: [
      "scripts/agent-factory/factory-plan-next.ts",
      "agents/factory-roadmap.json",
      "agents/factory-queue.json",
      "agents/factory-goal-state.json",
      "scripts/agent-factory/factory-roadmap-refresh.ts",
    ],
  },
  {
    id: "factory-plan-from-goal",
    title: "Planner: merge goal spec into roadmap",
    purpose:
      "Reads `agents/factory-goal-spec.json` (`statement`, `roadmap_items`) and upserts those rows into `agents/factory-roadmap.json`, then bumps roadmap meta seq. Use after you (or another agent) decompose a goal into concrete roadmap rows.",
    howToUse: [
      "Edit `agents/factory-goal-spec.json` with `roadmap_items` (id, title, priority, optional `traces_goal` and/or `spec` with first `definition_of_done` bullet tracing the `statement`).",
      "Run `pnpm factory:plan-from-goal`, then `pnpm factory:plan-next` to enqueue.",
    ],
    commands: ["pnpm factory:plan-from-goal"],
    relatedFiles: [
      "scripts/agent-factory/factory-plan-from-goal.ts",
      "agents/factory-goal-spec.json",
      "agents/factory-roadmap.json",
    ],
  },
  {
    id: "factory-research-once",
    title: "Research: goal LLM + optional hook + calc/weather signals",
    purpose:
      "Runs autonomous research for the current `factory-goal-spec.json`: builds the LLM prompt from goal state (`agents/factory-goal-state.json` summary + per-item queue status when present), roadmap rows, optional deterministic calculator/weather **repo signal** hints, and existing ids. Uses **remediation** instructions when state is `blocked` or `queue_failed` > 0 (disable with `FACTORY_RESEARCH_REMEDIATION_PROMPT=0`), **improvement** when status is `met` and `FACTORY_RESEARCH_IMPROVEMENT_WHEN_MET` is on, otherwise milestone planning. Calls an OpenAI-compatible API when keys are set; runs optional `FACTORY_RESEARCH_HOOK`, then optional calc/weather backlog append. Writes `agents/factory-research-last.json` including `research_prompt_mode` and `appended_total`.",
    howToUse: [
      "No keys: Ollama auto-detect + goal-spec `roadmap_items` → backlog intake. With keys: `FACTORY_RESEARCH_API_KEY` or `OPENAI_API_KEY`; optional `FACTORY_RESEARCH_MODEL` and `FACTORY_RESEARCH_OPENAI_BASE` (e.g. Groq).",
      "Use `FACTORY_RESEARCH_HOOK` for a custom bash snippet that edits `backlog.md` before the built-in steps.",
    ],
    commands: ["pnpm factory:research-once"],
    relatedFiles: [
      "scripts/agent-factory/factory-research-once.ts",
      "lib/agent-factory/run-goal-llm-research-append.ts",
      "lib/agent-factory/research-goal-context.ts",
      "lib/agent-factory/research-goal-llm.ts",
      "lib/agent-factory/run-calc-weather-research-append.ts",
      "agents/factory-goal-state.json",
      "agents/factory-research-last.json",
    ],
  },
  {
    id: "factory-research-calc-weather-once",
    title: "Research: calculator / weather code signals only",
    purpose:
      "Runs deterministic scan of `app/calculator/page.tsx`, optional calculator layout, weather page, and weather API sources; appends suggested backlog intake rows to `backlog.md` when signals match (e.g. missing route metadata, keyboard a11y). Does not call an LLM — use after `factory:research-once` when you want calc/weather hints only.",
    howToUse: [
      "Run `pnpm factory:research:calc-weather-once` from repo root; then `pnpm factory:backlog:intake` and `pnpm factory:plan-next` if new rows were appended.",
      "Forced from research pipeline when `FACTORY_RESEARCH_CALC_WEATHER=force`; skipped when set to `0`.",
    ],
    commands: ["pnpm factory:research:calc-weather-once"],
    relatedFiles: [
      "scripts/agent-factory/factory-research-calc-weather-once.ts",
      "lib/agent-factory/run-calc-weather-research-append.ts",
      "lib/agent-factory/research-calc-weather-signals.ts",
      "backlog.md",
    ],
  },
  {
    id: "factory-backlog-intake",
    title: "Planner: merge research backlog into roadmap",
    purpose:
      "Parses the `## Factory research intake` section in `backlog.md` (research agent output) and upserts those rows into `agents/factory-roadmap.json` with default `factory:implement` commands, then bumps roadmap meta seq. Run before `factory:plan-next` so the factory queue can pick up new work.",
    howToUse: [
      "Research agent appends tasks under `## Factory research intake` using the `### ID — title` / `- Priority:` / optional `- Command:` shape.",
      "Run `pnpm factory:backlog:intake`, then `pnpm factory:plan-next` (or rely on `factory:loop` after intake).",
    ],
    commands: ["pnpm factory:backlog:intake"],
    relatedFiles: [
      "scripts/agent-factory/factory-backlog-intake.ts",
      "lib/agent-factory/backlog-intake.ts",
      "backlog.md",
      "agents/factory-roadmap.json",
    ],
  },
  {
    id: "factory-evaluate-goal",
    title: "Goal-level evaluation",
    purpose:
      "Writes `agents/factory-goal-state.json`: compares roadmap ids to queue statuses, runs optional `goal_acceptance` shell checks from `factory-goal-spec.json` when every linked item is done, sets status to `met`, `active`, `blocked`, or `unknown`. Summary and optional `roadmap_not_done` list id+title+queue_status for rows not done. Invoked automatically each `factory:loop` iteration after reclaim.",
    howToUse: [
      "Set `goal_acceptance` when you have a repo-level check that proves the overall outcome.",
      "Use `FACTORY_GOAL_STATE_CONTROLS_PLAN=1` with `factory:plan-next` to stop enqueueing when status is `met`.",
      "Stdout lists each roadmap row not done (id, title, queue/missing); `agents/factory-goal-state.json` may include `roadmap_not_done` for the same.",
    ],
    commands: ["pnpm factory:evaluate-goal"],
    relatedFiles: [
      "scripts/agent-factory/factory-evaluate-goal.ts",
      "lib/agent-factory/goal-spec.ts",
      "agents/factory-goal-spec.json",
      "agents/factory-goal-state.json",
    ],
  },
  {
    id: "factory-goal-pivot",
    title: "Goal pivot (cancel stale queue work)",
    purpose:
      "After you change the north star in `agents/factory-goal-spec.json`, run this to align the factory: first run initializes `agents/factory-goal-meta.json` and stamps `goal_revision` on active queue rows; later runs cancel queued/in_progress/blocked rows whose `goal_revision` no longer matches the current spec so planning can focus on the updated goal.",
    howToUse: [
      "Post–goal-change sequence: bump `goal_revision` (or edit `statement` for hash fallback) → `pnpm factory:goal-pivot` → `pnpm factory:plan-from-goal` (or roadmap regen) → `pnpm factory:plan-next`.",
      "Pivot events append to `agents/factory-pivot-log.jsonl` (gitignored).",
    ],
    commands: ["pnpm factory:goal-pivot"],
    relatedFiles: [
      "scripts/agent-factory/factory-goal-pivot.ts",
      "lib/agent-factory/goal-io.ts",
      "lib/agent-factory/goal-spec.ts",
      "agents/factory-goal-spec.json",
      "agents/factory-goal-meta.json",
      "agents/factory-queue.json",
    ],
  },
  {
    id: "factory-reclaim",
    title: "Reclaim stale claims/runs",
    purpose: "Repairs the queue/runs ledger after crashes by reclaiming stale work and keeping the dashboard consistent.",
    howToUse: [
      "Use when a worker crashed and items look stuck in `in_progress`.",
      "`FACTORY_STALE_CLAIM_MS` / `FACTORY_STALE_RUN_MS` — see `docs/GOVERNANCE.md` (factory env / script defaults).",
    ],
    commands: ["pnpm factory:reclaim"],
    relatedFiles: [
      "scripts/agent-factory/factory-reclaim.ts",
      "lib/agent-factory/reclaim-thresholds.ts",
      "agents/factory-queue.json",
      "agents/factory-runs.json",
    ],
  },
  {
    id: "factory-doctor",
    title: "Factory doctor (worker smoke)",
    purpose:
      "Read-only check: Node/pnpm versions, `pnpm-lock.yaml`, effective reclaim thresholds, implementer env hints (`FACTORY_CLAUDE_BIN`, aider/Gemini).",
    howToUse: ["Run on a worker host before starting `factory:loop` or `factory:swarm`."],
    commands: ["pnpm factory:doctor"],
    relatedFiles: ["scripts/agent-factory/factory-doctor.ts", "docs/GOVERNANCE.md"],
  },
  {
    id: "factory-queue-dedupe",
    title: "Queue dedupe (same title + goal)",
    purpose:
      "Cancels duplicate `queued` rows that share the same title and `goal_revision`, keeping the highest `_V##` suffix in the item id. Dry-run with `FACTORY_QUEUE_DEDUPE_DRY_RUN=1`.",
    howToUse: [
      "Use after research/intake created many calculator-fix clones (V10…V13).",
      "Preview: `FACTORY_QUEUE_DEDUPE_DRY_RUN=1 pnpm factory:queue:dedupe`.",
    ],
    commands: ["pnpm factory:queue:dedupe", "FACTORY_QUEUE_DEDUPE_DRY_RUN=1 pnpm factory:queue:dedupe"],
    relatedFiles: [
      "scripts/agent-factory/factory-queue-dedupe.ts",
      "lib/agent-factory/queue-dedupe.ts",
      "agents/factory-queue.json",
    ],
  },
  {
    id: "factory-stabilize",
    title: "Stabilize environment",
    purpose:
      "Restores a missing `tsx` shim if needed, runs `factory:reclaim`, then `factory:maintenance` to clear orphan worktrees and run git maintenance.",
    howToUse: [
      "Use when `tsx` is missing from `node_modules/.bin` or after worker crashes left the queue in a bad state.",
    ],
    commands: ["pnpm factory:stabilize"],
    relatedFiles: [
      "scripts/agent-factory/factory-stabilize.ts",
      "scripts/agent-factory/factory-reclaim.ts",
      "scripts/agent-factory/factory-maintenance.ts",
    ],
  },
  {
    id: "factory-issue-swarm",
    title: "Issue swarm",
    purpose:
      "Watches swarm incidents (and optional Vercel deploy errors), enqueues `auto_heal` jobs on `factory-queue.json`, and appends the same work as rows under `## Factory research intake` in `backlog.md` so `factory:backlog:intake` can promote them to the roadmap. Disable backlog logging with `FACTORY_ISSUE_SWARM_LOG_BACKLOG_INTAKE=0`.",
    howToUse: [
      "Use when you want the factory to watch for incidents and enqueue maintenance tasks automatically.",
      "After swarm logging, run `pnpm factory:backlog:intake` if roadmap should mirror those heal IDs.",
    ],
    commands: ["pnpm factory:issue-swarm", "FACTORY_ISSUE_SWARM_LOG_BACKLOG_INTAKE=0 pnpm factory:issue-swarm"],
    relatedFiles: [
      "scripts/agent-factory/factory-issue-swarm.ts",
      "agents/factory-logs/swarm-incidents/",
      "backlog.md",
      "lib/agent-factory/backlog-intake.ts",
    ],
  },
  {
    id: "factory-maintenance",
    title: "Maintenance runner",
    purpose: "Applies remediations for a specific incident file produced by the swarm.",
    howToUse: ["Use to remediate a specific incident JSON from `agents/factory-logs/swarm-incidents/`."],
    commands: ['pnpm factory:maintenance "agents/factory-logs/swarm-incidents/<incident>.json"'],
    relatedFiles: ["scripts/agent-factory/factory-maintenance.ts", "agents/factory-logs/swarm-incidents/"],
  },
  {
    id: "factory-learn-github",
    title: "Learn from merged PR reviews",
    purpose: "Pulls high-signal review comments from recently merged PRs into `agents/factory-learnings.json` for later rule/workflow hardening.",
    howToUse: [
      "Requires GitHub CLI (`gh`) authenticated for the repo.",
      "Run on a cadence (weekly) or after major merges.",
    ],
    commands: ["pnpm factory:learn-github"],
    relatedFiles: ["scripts/agent-factory/factory-learn-github.ts", "agents/factory-learnings.json"],
  },
  {
    id: "factory-roadmap-expand",
    title: "Roadmap expander",
    purpose: "Turns roadmap items into actionable `backlog.md` entries so the factory can keep shipping incremental planning work.",
    howToUse: ["Use when you want to expand a roadmap item into a structured backlog entry."],
    commands: ["pnpm factory:roadmap:expand <ITEM_ID>"],
    relatedFiles: ["scripts/agent-factory/factory-roadmap-expand.ts", "agents/factory-roadmap.json"],
  },
  {
    id: "factory-market-scan",
    title: "Market scan",
    purpose: "Fetches configured RSS/URL sources and caches citations into `agents/market-evidence.json`.",
    howToUse: ["Tune sources in `agents/market-sources.json`.", "Optional: `FACTORY_MARKET_FETCH_TIMEOUT_MS`, `FACTORY_MARKET_FETCH_DELAY_MS`."],
    commands: ["pnpm factory:market:scan"],
    relatedFiles: ["scripts/agent-factory/factory-market-scan.ts", "agents/market-sources.json", "agents/market-evidence.json"],
  },
  {
    id: "factory-candidates-refresh",
    title: "Product candidates refresh",
    purpose: "Scores product seeds against evidence and writes `agents/product-candidates.json`.",
    howToUse: ["Edit seeds in `agents/product-seeds.json`.", "Requires `agents/market-evidence.json` (or starts empty)."],
    commands: ["pnpm factory:candidates:refresh"],
    relatedFiles: [
      "scripts/agent-factory/factory-candidates-refresh.ts",
      "agents/product-seeds.json",
      "agents/product-candidates.json",
      "lib/agent-factory/market.ts",
    ],
  },
  {
    id: "factory-product-select",
    title: "Product selection",
    purpose: "Picks the top scored candidate and writes `agents/selected-product.json`.",
    howToUse: ["Run after `pnpm factory:candidates:refresh`."],
    commands: ["pnpm factory:product:select"],
    relatedFiles: ["scripts/agent-factory/factory-product-select.ts", "agents/selected-product.json"],
  },
  {
    id: "factory-roadmap-generate",
    title: "Roadmap generator",
    purpose: "Builds `agents/factory-roadmap.json` from `agents/selected-product.json` using a revenue-loop-first template.",
    howToUse: ["Run after `pnpm factory:product:select`."],
    commands: ["pnpm factory:roadmap:generate"],
    relatedFiles: [
      "scripts/agent-factory/factory-roadmap-generate.ts",
      "agents/selected-product.json",
      "agents/factory-roadmap.json",
      "agents/factory-roadmap-meta.json",
    ],
  },
  {
    id: "factory-roadmap-refresh",
    title: "Roadmap refresh pipeline",
    purpose: "Runs market scan → candidates → product select → roadmap generate (best-effort per step).",
    howToUse: ["Normally invoked by `pnpm factory:plan-next` when the roadmap is exhausted."],
    commands: ["pnpm factory:roadmap:refresh"],
    relatedFiles: ["scripts/agent-factory/factory-roadmap-refresh.ts"],
  },
  {
    id: "factory-implement",
    title: "Developer agent: implement roadmap item",
    purpose:
      "Builds a prompt from ``agents/factory-goal-spec.json` and optional goal prose in repo`, the roadmap row DoD, and `agents/SKILL-developer.md`, then spawns the configured implementer (default `claude` via stdin for `-p` mode) in the current worktree — unless `FACTORY_IMPLEMENT_BACKEND` is `cursor`, `none`, or `skip`, in which case it only writes `agents/factory-logs/cursor-task-<ID>.md` for Cursor/manual work. Does not install, build, or commit; `factory:run-once` runs `pnpm verify` afterward (including `e2e:goal-smoke` for goal-truth UI/API checks per `agents/factory-goal-spec.json`).",
    howToUse: [
      "Typically invoked as `pnpm -s factory:implement <ITEM_ID>` from a queue item `spec.command`.",
      "Set `FACTORY_ROOT` when the worktree cwd is not the repo root.",
      "Cursor-only: `pnpm factory:implement:cursor -- <ITEM_ID>` or `FACTORY_IMPLEMENT_BACKEND=cursor pnpm -s factory:implement <ITEM_ID>` (see ``agents/factory-goal-spec.json` and optional goal prose in repo`).",
    ],
    commands: [
      "pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V1",
      "pnpm factory:implement:cursor -- FACTORY_VERIFY_CALCULATOR_V1",
      "FACTORY_IMPLEMENT_BACKEND=cursor pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V1",
    ],
    relatedFiles: [
      "scripts/agent-factory/factory-implement.ts",
      "agents/factory-roadmap.json",
      "`agents/factory-goal-spec.json` and optional goal prose in repo",
      "e2e/goal-smoke.spec.ts",
    ],
  },
  {
    id: "factory-status",
    title: "Factory status",
    purpose:
      "Prints a concise snapshot of queue health, recent runs, optional worker heartbeats, and log paths for operators debugging the factory loop.",
    howToUse: ["Run `pnpm factory:status` on the repo root or worker host."],
    commands: ["pnpm factory:status"],
    relatedFiles: [
      "scripts/agent-factory/factory-status.ts",
      "agents/factory-queue.json",
      "agents/factory-runs.json",
      "agents/factory-logs/",
    ],
  },
  {
    id: "claude-ollama-wrapper",
    title: "Ollama adapter for factory-implement",
    purpose:
      "Shell wrapper that translates `claude` CLI stdin/stdout protocol to Ollama API calls. Allows `factory:implement` to use local Ollama (e.g., llama3.2) instead of Claude API when `FACTORY_CLAUDE_BIN` points to this script.",
    howToUse: [
      "Set `FACTORY_CLAUDE_BIN='./scripts/agent-factory/claude-ollama-wrapper.sh'` before running `factory:run-once`.",
      "Reads prompt from stdin, sends to Ollama API (default `http://127.0.0.1:11434`; override with `FACTORY_RESEARCH_OLLAMA_URL`).",
      "Uses `FACTORY_RESEARCH_MODEL` (default `llama3.2`) as the Ollama model.",
    ],
    commands: ["FACTORY_CLAUDE_BIN='./scripts/agent-factory/claude-ollama-wrapper.sh' pnpm factory:run-once"],
    relatedFiles: [
      "scripts/agent-factory/claude-ollama-wrapper.sh",
      "scripts/agent-factory/factory-implement.ts",
      "docs/GOVERNANCE.md",
    ],
  },
]

