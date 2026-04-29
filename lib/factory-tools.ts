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
    purpose: "Runs multiple worker loops in parallel for higher throughput.",
    howToUse: [
      "Set `FACTORY_WORKERS` to control worker count.",
      "Use when you have multiple queued tasks and want parallel execution.",
    ],
    commands: ["FACTORY_WORKERS=5 pnpm factory:swarm"],
    relatedFiles: ["scripts/agent-factory/factory-swarm.ts", "scripts/agent-factory/factory-loop.ts"],
  },
  {
    id: "factory-run-once",
    title: "Run one factory item",
    purpose: "Claims one queued item, runs its `spec.command` in a clean worktree, verifies, commits/pushes, and merges to main.",
    howToUse: [
      "Use for debugging a single iteration.",
      "Use with a single queued item when you want one pass then exit.",
    ],
    commands: ["pnpm factory:run-once"],
    relatedFiles: ["scripts/agent-factory/factory-run-once.ts", "agents/factory-queue.json", "agents/factory-runs.json"],
  },
  {
    id: "factory-plan-next",
    title: "Planner: enqueue next work",
    purpose: "Refills the queue with deterministic next items based on roadmap/maintenance needs.",
    howToUse: ["Use when the queue is low and you want the factory to enqueue next work."],
    commands: ["pnpm factory:plan-next"],
    relatedFiles: ["scripts/agent-factory/factory-plan-next.ts", "agents/factory-roadmap.json", "agents/factory-queue.json"],
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
]

