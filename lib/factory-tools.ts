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
    purpose: "Continuously runs a single worker loop: reclaim → plan → run once.",
    howToUse: ["Use when you want one worker running continuously.", "Stops if `factory:run-once` returns non-zero."],
    commands: ["pnpm factory:loop"],
    relatedFiles: ["scripts/agent-factory/factory-loop.ts", "scripts/agent-factory/factory-run-once.ts"],
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
    id: "factory-run-once",
    title: "Run one factory item",
    purpose:
      "Claims one queued item, runs its `spec.command` in a clean worktree, runs `pnpm tsc` / `lint` / `build`, optional `spec.acceptance` shell checks, optional `spec.require_diff`, then commits/pushes/merges when there are changes.",
    howToUse: [
      "Use for debugging a single iteration.",
      "Use with a single queued item when you want one pass then exit.",
      "Per-item checks: set `spec.acceptance` to a command or string array; set `spec.require_diff: true` to fail no-op commands.",
    ],
    commands: ["pnpm factory:run-once"],
    relatedFiles: ["scripts/agent-factory/factory-run-once.ts", "lib/agent-factory/item-spec.ts", "agents/factory-queue.json", "agents/factory-runs.json"],
  },
  {
    id: "factory-plan-next",
    title: "Planner: enqueue next work",
    purpose:
      "Refills the queue from the roadmap; if no roadmap items remain, runs market research refresh (scan → score → select → generate roadmap) then retries. With `FACTORY_GOAL_STATE_CONTROLS_PLAN=1`, skips enqueue when `agents/factory-goal-state.json` status is `met`.",
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
      "Edit `agents/factory-goal-spec.json` with `roadmap_items` (id, title, priority, optional spec).",
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
    id: "factory-evaluate-goal",
    title: "Goal-level evaluation",
    purpose:
      "Writes `agents/factory-goal-state.json`: compares roadmap ids to queue statuses, runs optional `goal_acceptance` shell checks from `factory-goal-spec.json` when every linked item is done, sets status to `met`, `active`, `blocked`, or `unknown`. Invoked automatically each `factory:loop` iteration after reclaim.",
    howToUse: [
      "Set `goal_acceptance` when you have a repo-level check that proves the overall outcome.",
      "Use `FACTORY_GOAL_STATE_CONTROLS_PLAN=1` with `factory:plan-next` to stop enqueueing when status is `met`.",
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
    id: "factory-reclaim",
    title: "Reclaim stale claims/runs",
    purpose: "Repairs the queue/runs ledger after crashes by reclaiming stale work and keeping the dashboard consistent.",
    howToUse: ["Use when a worker crashed and items look stuck in `in_progress`."],
    commands: ["pnpm factory:reclaim"],
    relatedFiles: ["scripts/agent-factory/factory-reclaim.ts", "agents/factory-queue.json", "agents/factory-runs.json"],
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
    purpose: "Generates maintenance/ops tasks and injects them into the factory queue for self-healing.",
    howToUse: ["Use when you want the factory to watch for incidents and enqueue maintenance tasks automatically."],
    commands: ["pnpm factory:issue-swarm"],
    relatedFiles: ["scripts/agent-factory/factory-issue-swarm.ts", "agents/factory-logs/swarm-incidents/"],
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
    relatedFiles: ["scripts/agent-factory/factory-roadmap-expand.ts", "agents/factory-roadmap.json", "backlog.md"],
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
]

