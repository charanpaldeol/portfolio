import { z } from "zod"
import { access, readFile } from "node:fs/promises"
import path from "node:path"

import { collectCalcWeatherSignals } from "@/lib/agent-factory/research-calc-weather-signals"
import type { GoalResearchPromptMode } from "@/lib/agent-factory/research-goal-llm"

const FactoryGoalStateResearchSchema = z
  .object({
    status: z.string().optional(),
    summary: z.string().optional(),
    roadmap_not_done: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          queue_status: z.string().optional(),
        }),
      )
      .optional(),
    queue_failed: z.number().optional(),
  })
  .passthrough()

export type FactoryGoalStateResearch = z.output<typeof FactoryGoalStateResearchSchema>

export async function readFactoryGoalStateForResearch(repoRoot: string): Promise<FactoryGoalStateResearch | null> {
  const p = path.join(repoRoot, "agents", "factory-goal-state.json")
  try {
    const raw = await readFile(p, "utf8")
    const j = JSON.parse(raw) as unknown
    const parsed = FactoryGoalStateResearchSchema.safeParse(j)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

/** Human-readable block for the research LLM user prompt. */
export function formatGoalEvaluationForResearchPrompt(state: FactoryGoalStateResearch | null): string {
  if (!state) return ""
  const lines: string[] = []
  if (state.status) lines.push(`- status: ${state.status}`)
  if (typeof state.queue_failed === "number") lines.push(`- queue_failed: ${state.queue_failed}`)
  if (state.summary) lines.push(`- summary: ${state.summary.trim()}`)
  const rnd = state.roadmap_not_done
  if (rnd?.length) {
    lines.push("- roadmap_not_done (id — title [queue]):")
    for (const r of rnd) {
      const qs = r.queue_status ? ` [${r.queue_status}]` : ""
      lines.push(`  - ${r.id} — ${r.title}${qs}`)
    }
  }
  return lines.join("\n").trim()
}

async function fileExists(filePath: string) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

function goalStatementMentionsCalcWeatherNav(statement: string): boolean {
  const s = statement.toLowerCase()
  return s.includes("calculator") || s.includes("weather") || s.includes("navbar")
}

/**
 * Short deterministic scan of calculator/weather/api sources for the LLM (not appended to backlog).
 */
export async function buildCalcWeatherRepoSignalsSection(repoRoot: string, goalStatement: string): Promise<string> {
  if (!goalStatementMentionsCalcWeatherNav(goalStatement)) return ""

  const calcPath = path.join(repoRoot, "app", "calculator", "page.tsx")
  const calcLayoutPath = path.join(repoRoot, "app", "calculator", "layout.tsx")
  const weatherPath = path.join(repoRoot, "app", "weather", "page.tsx")
  const apiPath = path.join(repoRoot, "app", "api", "weather", "route.ts")

  let calcSrc: string
  let wxSrc: string
  let apiSrc: string
  try {
    ;[calcSrc, wxSrc, apiSrc] = await Promise.all([
      readFile(calcPath, "utf8"),
      readFile(weatherPath, "utf8"),
      readFile(apiPath, "utf8"),
    ])
  } catch {
    const missing: string[] = []
    if (!(await fileExists(calcPath))) missing.push("app/calculator/page.tsx")
    if (!(await fileExists(weatherPath))) missing.push("app/weather/page.tsx")
    if (!(await fileExists(apiPath))) missing.push("app/api/weather/route.ts")
    return missing.length
      ? `Some expected paths are missing: ${missing.join(", ")}. Propose tasks to add or fix them.`
      : "Could not read calculator/weather/API sources for signals."
  }

  const hasCalcLayout = await fileExists(calcLayoutPath)
  const signals = collectCalcWeatherSignals({
    calculatorPageSource: calcSrc,
    weatherPageSource: wxSrc,
    weatherRouteSource: apiSrc,
    calculatorHasServerLayout: hasCalcLayout,
  })

  if (!signals.length) {
    return "No extra deterministic code signals beyond current files (calculator, weather page, weather API present; extend research-calc-weather-signals if needed)."
  }

  const bullets = signals.map((s) => {
    const note = (s.extraLines?.[0] ?? "").replace(/^-\s*Notes:\s*/i, "").trim()
    return `- ${s.title}${note ? ` — ${note}` : ""}`
  })
  return bullets.join("\n")
}

/**
 * Chooses LLM instructions: met → improvement-only; blocked / queue failures → remediation using goal-state + repo signals; else milestone planning.
 */
export function resolveResearchPromptMode(goalState: FactoryGoalStateResearch | null): GoalResearchPromptMode {
  const st = (goalState?.status ?? "").trim()
  const improvementWhenMet = (process.env.FACTORY_RESEARCH_IMPROVEMENT_WHEN_MET ?? "1").trim() !== "0"
  if (st === "met" && improvementWhenMet) return "improvement_when_met"

  const remediationOff = ["0", "false", "no", "off"].includes(
    (process.env.FACTORY_RESEARCH_REMEDIATION_PROMPT ?? "").trim().toLowerCase(),
  )
  const failed = goalState?.queue_failed ?? 0
  if (!remediationOff && (st === "blocked" || failed > 0)) return "remediation_failed"

  return "milestone"
}
