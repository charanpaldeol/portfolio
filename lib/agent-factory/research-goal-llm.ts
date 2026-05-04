const IdTitleLineRe = /^###\s+([A-Z][A-Z0-9_]*)\s*[—–-]\s*(.+)$/

export type ParsedResearchBlock = {
  id: string
  title: string
  priority: number
  command: string
}

export type ParseResearchBlocksFromLlmResult = {
  blocks: ParsedResearchBlock[]
  duplicateSkips: number
  invalidSkips: number
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
export function parseResearchBlocksFromLlm(
  content: string,
  existingIds: Set<string>,
  warn: (m: string) => void,
): ParseResearchBlocksFromLlmResult {
  if (isExplicitResearchDone(content)) return { blocks: [], duplicateSkips: 0, invalidSkips: 0 }

  const lines = content.replace(/\r\n/g, "\n").split("\n")
  const blocks: ParsedResearchBlock[] = []
  let duplicateSkips = 0
  let invalidSkips = 0
  let cur: { id: string; title: string; priority?: number; command?: string } | null = null

  const flush = () => {
    if (!cur) return
    const p = cur.priority
    const cmd = cur.command?.trim()
    if (p === undefined || !Number.isFinite(p) || p < 0) {
      invalidSkips += 1
      warn(`factory:research:llm: skip ${cur.id} — missing or invalid Priority`)
      cur = null
      return
    }
    if (!cmd) {
      invalidSkips += 1
      warn(`factory:research:llm: skip ${cur.id} — missing Command`)
      cur = null
      return
    }
    if (existingIds.has(cur.id)) {
      duplicateSkips += 1
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
  return { blocks, duplicateSkips, invalidSkips }
}

export type GoalResearchPromptMode = "milestone" | "improvement_when_met" | "remediation_failed"

function instructionForMode(mode: GoalResearchPromptMode): string {
  if (mode === "improvement_when_met") {
    return "All roadmap work in the last evaluation is DONE (or cancelled). Propose ONLY incremental improvements: polish, accessibility, tests, error handling, performance, copy—no greenfield rewrites. If there is nothing concrete left, output exactly one line: FACTORY_RESEARCH_DONE"
  }
  if (mode === "remediation_failed") {
    return "The latest factory goal evaluation (above) shows blocked work and/or failed queue items tied to the roadmap. Read it together with any repo code signals. Propose NEW small tasks (each `pnpm -s factory:implement <ID>`) that address real gaps, root causes, or missing UX—use NEW ids only; never reuse any id under Existing ids or repeat the same scope under a duplicate id. Prefer 2–6 concrete follow-ups (e.g. fix verify failures, error states, a11y, tests). If the evaluation + signals leave nothing actionable beyond re-running existing queue rows as-is, output exactly one line: FACTORY_RESEARCH_DONE"
  }
  return "Propose concrete, small vertical-slice tasks (each runnable as `pnpm -s factory:implement <ID>` in a git worktree). Prefer 3–8 tasks for the first milestone. Each task must be independently shippable with a clear Definition of Done implied by the title."
}

export function buildGoalResearchPrompt(args: {
  goalMarkdown: string
  goalStatement: string
  roadmapSummary: string
  existingIds: string[]
  maxTasks: number
  mode: GoalResearchPromptMode
  goalEvaluationSection?: string
  repoSignalsSection?: string
}): string {
  const modeLine = instructionForMode(args.mode)

  const evalBlock =
    args.goalEvaluationSection && args.goalEvaluationSection.trim().length > 0
      ? ["## Latest factory goal evaluation (agents/factory-goal-state.json)", args.goalEvaluationSection.trim(), ""]
      : []

  const signalsBlock =
    args.repoSignalsSection && args.repoSignalsSection.trim().length > 0
      ? ["## Repo code signals (deterministic scan; hints only)", args.repoSignalsSection.trim(), ""]
      : []

  return [
    "You are the Factory research agent for a Next.js 15 (App Router) + TypeScript + pnpm repo.",
    "",
    "## North star (factory-goal-spec statement)",
    args.goalStatement || "(empty)",
    "",
    "## Extended goal (FACTORY_GOAL.md excerpt)",
    args.goalMarkdown.slice(0, 14_000),
    "",
    ...evalBlock,
    "## Current roadmap rows (id — title)",
    args.roadmapSummary || "(none)",
    "",
    ...signalsBlock,
    "## Existing ids — do NOT reuse",
    args.existingIds.length ? args.existingIds.sort().join(", ") : "(none)",
    "Never emit a `###` heading for any id listed above; use new unique ALL_CAPS ids only (e.g. FACTORY_R_NEWTHING_V1).",
    "",
    "## Instructions",
    `- ${modeLine}`,
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
