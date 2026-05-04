import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { runCalcWeatherResearchAppend } from "@/lib/agent-factory/run-calc-weather-research-append"
import { runGoalLlmResearchAppend } from "@/lib/agent-factory/run-goal-llm-research-append"
import { writeJsonFile } from "@/lib/agent-factory/storage"

async function readGoalStateStatus(repoRoot: string): Promise<string | null> {
  try {
    const raw = await readFile(path.join(repoRoot, "agents", "factory-goal-state.json"), "utf8")
    const j = JSON.parse(raw) as { status?: unknown }
    return typeof j.status === "string" ? j.status : null
  } catch {
    return null
  }
}

async function readGoalStatement(repoRoot: string): Promise<string> {
  try {
    const raw = await readFile(path.join(repoRoot, "agents", "factory-goal-spec.json"), "utf8")
    const j = JSON.parse(raw) as { statement?: unknown }
    return typeof j.statement === "string" ? j.statement : ""
  } catch {
    return ""
  }
}

function shouldRunCalcWeather(statement: string): boolean {
  const v = (process.env.FACTORY_RESEARCH_CALC_WEATHER ?? "").trim().toLowerCase()
  if (["0", "false", "no", "off"].includes(v)) return false
  if (v === "force") return true
  const s = statement.toLowerCase()
  return s.includes("calculator") || s.includes("weather") || s.includes("navbar")
}

async function main() {
  const root = process.cwd()
  const improvementWhenMet = (process.env.FACTORY_RESEARCH_IMPROVEMENT_WHEN_MET ?? "1").trim() !== "0"
  const goalStatus = await readGoalStateStatus(root)
  const improvementPass = improvementWhenMet && goalStatus === "met"

  const llm = await runGoalLlmResearchAppend(root)
  if (llm.researchMode) console.log(`factory:research: prompt_mode=${llm.researchMode}`)
  if (llm.appended > 0) {
    const label =
      llm.via === "goal_spec" ? "goal-spec sync (no API key)" : llm.via === "ollama" ? "Ollama" : "LLM"
    console.log(`factory:research: ${label} appended ${llm.appended} block(s) to backlog.md`)
  } else if (llm.skippedReason) console.log(`factory:research: llm skipped (${llm.skippedReason})`)
  else if (llm.error) console.warn(`factory:research: llm: ${llm.error}`)

  const hook = (process.env.FACTORY_RESEARCH_HOOK ?? "").trim()
  if (hook) {
    const { spawn } = await import("node:child_process")
    const hookCode = await new Promise<number>((resolve) => {
      const h = spawn("bash", ["-lc", hook], { stdio: "inherit", shell: false, cwd: root, env: process.env })
      h.on("close", (c) => resolve(c ?? 1))
    })
    if (hookCode !== 0) console.warn(`factory:research: FACTORY_RESEARCH_HOOK exited ${hookCode}`)
  }

  const stmt = await readGoalStatement(root)
  let cw = 0
  if (shouldRunCalcWeather(stmt)) {
    cw = await runCalcWeatherResearchAppend(root)
    if (cw > 0) console.log(`factory:research: calc-weather appended ${cw} block(s) to backlog.md`)
  }

  const total = llm.appended + cw
  const payload = {
    version: 1 as const,
    appended_total: total,
    at: new Date().toISOString(),
    llm_appended: llm.appended,
    calc_weather_appended: cw,
    llm_skipped_reason: llm.skippedReason ?? null,
    llm_error: llm.error ?? null,
    llm_via: llm.via ?? null,
    research_prompt_mode: llm.researchMode ?? null,
    goal_status: goalStatus,
    improvement_pass: improvementPass,
  }
  await writeJsonFile(path.join(root, "agents", "factory-research-last.json"), payload)
  console.log(`factory:research: appended_total=${total}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
