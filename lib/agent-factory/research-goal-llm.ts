const IdTitleLineRe = /^###\s+([A-Z][A-Z0-9_]*)\s*[—–-]\s*(.+)$/

export type ParsedResearchBlock = {
  id: string
  title: string
  priority: number
  command: string
}

/** True when the model explicitly signals no further factory tasks. */
export function isExplicitResearchDone(content: string): boolean {
  const t = content.trim()
  if (!t) return true
  if (/^FACTORY_RESEARCH_DONE\b/im.test(t) && t.length < 500) return true
  return false
}

/**
 * Parse LLM output: only `### ID — title` blocks with `- Priority:` and `- Command:` (same rules as backlog intake).
 * Skips IDs that already exist in `existingIds`.
 */
export function parseResearchBlocksFromLlm(content: string, existingIds: Set<string>, warn: (m: string) => void): ParsedResearchBlock[] {
  if (isExplicitResearchDone(content)) return []

  const lines = content.replace(/\r\n/g, "\n").split("\n")
  const blocks: ParsedResearchBlock[] = []
  let cur: { id: string; title: string; priority?: number; command?: string } | null = null

  const flush = () => {
    if (!cur) return
    const p = cur.priority
    const cmd = cur.command?.trim()
    if (p === undefined || !Number.isFinite(p) || p < 0) {
      warn(`factory:research:llm: skip ${cur.id} — missing or invalid Priority`)
      cur = null
      return
    }
    if (!cmd) {
      warn(`factory:research:llm: skip ${cur.id} — missing Command`)
      cur = null
      return
    }
    if (existingIds.has(cur.id)) {
      warn(`factory:research:llm: skip ${cur.id} — already exists`)
      cur = null
      return
    }
    blocks.push({ id: cur.id, title: cur.title.trim(), priority: p, command: cmd })
    existingIds.add(cur.id)
    cur = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    const hm = line.match(IdTitleLineRe)
    if (hm?.[1] && hm[2] != null) {
      flush()
      cur = { id: hm[1], title: hm[2].trim() }
      continue
    }
    if (!cur) continue
    const pm = line.match(/^-\s*Priority:\s*(\d+)\s*$/i)
    if (pm?.[1]) {
      cur.priority = Number(pm[1])
      continue
    }
    const cm = line.match(/^-\s*Command:\s+(.+)$/i)
    if (cm?.[1]) {
      cur.command = cm[1].trim()
      continue
    }
  }
  flush()
  return blocks
}

export function buildGoalResearchPrompt(args: {
  goalMarkdown: string
  goalStatement: string
  roadmapSummary: string
  existingIds: string[]
  maxTasks: number
  improvementPass: boolean
}): string {
  const mode = args.improvementPass
    ? "All roadmap work in the last evaluation is DONE (or cancelled). Propose ONLY incremental improvements: polish, accessibility, tests, error handling, performance, copy—no greenfield rewrites. If there is nothing concrete left, output exactly one line: FACTORY_RESEARCH_DONE"
    : "Propose concrete, small vertical-slice tasks (each runnable as `pnpm -s factory:implement <ID>` in a git worktree). Prefer 3–8 tasks for the first milestone. Each task must be independently shippable with a clear Definition of Done implied by the title."

  return [
    "You are the Factory research agent for a Next.js 15 (App Router) + TypeScript + pnpm repo.",
    "",
    "## North star (factory-goal-spec statement)",
    args.goalStatement || "(empty)",
    "",
    "## Extended goal (FACTORY_GOAL.md excerpt)",
    args.goalMarkdown.slice(0, 14_000),
    "",
    "## Current roadmap rows (id — title)",
    args.roadmapSummary || "(none)",
    "",
    "## Existing ids — do NOT reuse",
    args.existingIds.length ? args.existingIds.sort().join(", ") : "(none)",
    "",
    "## Instructions",
    `- ${mode}`,
    `- Output ONLY task blocks in this exact shape (repeat for each task, up to ${args.maxTasks} tasks):`,
    "### YOUR_ID_V1 — Short imperative title",
    "- Priority: <integer 500–950, higher = sooner>",
    "- Command: pnpm -s factory:implement YOUR_ID_V1",
    "",
    "ID rules: `^[A-Z][A-Z0-9_]*$` (uppercase letters, digits, underscores).",
    "Do not wrap in markdown fences. No prose before the first ###.",
    "",
  ].join("\n")
}
