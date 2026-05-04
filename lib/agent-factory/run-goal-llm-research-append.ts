import { z } from "zod"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { appendFactoryResearchIntakeBlock, extractResearchIntakeSection, parseIntakeItems } from "@/lib/agent-factory/backlog-intake"
import { type FactoryGoalSpec, FactoryGoalSpecSchema } from "@/lib/agent-factory/goal-spec"
import { AgentFactoryQueueSchema } from "@/lib/agent-factory/queue"
import {
  buildCalcWeatherRepoSignalsSection,
  formatGoalEvaluationForResearchPrompt,
  readFactoryGoalStateForResearch,
  resolveResearchPromptMode,
} from "@/lib/agent-factory/research-goal-context"
import {
  buildGoalResearchPrompt,
  type GoalResearchPromptMode,
  isExplicitResearchDone,
  parseResearchBlocksFromLlm,
} from "@/lib/agent-factory/research-goal-llm"
import { readJsonFile } from "@/lib/agent-factory/storage"

const RoadmapLiteSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
})

function envFlag(value: string | undefined, defaultOn: boolean): boolean {
  const v = (value ?? "").trim().toLowerCase()
  if (v === "0" || v === "false" || v === "no" || v === "off") return false
  if (v === "1" || v === "true" || v === "yes" || v === "on") return true
  return defaultOn
}

function collectExistingIdSet(args: {
  backlogMd: string
  roadmapItems: { id: string }[]
  queueItems: { id: string }[]
}): Set<string> {
  const taken = new Set<string>()
  for (const it of args.roadmapItems) taken.add(it.id)
  for (const it of args.queueItems) taken.add(it.id)
  const sectionLines = extractResearchIntakeSection(args.backlogMd)
  const parsed = parseIntakeItems(sectionLines, () => {})
  for (const p of parsed) taken.add(p.id)
  return taken
}

/** OpenAI-compatible chat/completions; prefer research-specific key so Groq etc. need not reuse `OPENAI_API_KEY`. */
function resolveFactoryResearchApiKey(): string {
  return (process.env.FACTORY_RESEARCH_API_KEY ?? process.env.OPENAI_API_KEY ?? "").trim()
}

function ollamaOrigin(): string {
  return (process.env.FACTORY_RESEARCH_OLLAMA_URL ?? "http://127.0.0.1:11434").replace(/\/+$/, "")
}

function ollamaDefaultModel(): string {
  return (process.env.FACTORY_RESEARCH_MODEL ?? "llama3.2").trim() || "llama3.2"
}

async function ollamaReachable(): Promise<boolean> {
  if (!envFlag(process.env.FACTORY_RESEARCH_TRY_OLLAMA, true)) return false
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 800)
  try {
    const r = await fetch(`${ollamaOrigin()}/api/tags`, { signal: ctrl.signal })
    return r.ok
  } catch {
    return false
  } finally {
    clearTimeout(t)
  }
}

async function chatCompletionsText(args: {
  prompt: string
  apiKey: string
  base: string
  model: string
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const base = args.base.replace(/\/+$/, "")
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (args.apiKey.trim()) headers.Authorization = `Bearer ${args.apiKey.trim()}`

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: args.model,
        temperature: 0.35,
        max_tokens: 4096,
        messages: [
          {
            role: "system",
            content:
              "You are a senior product engineer. Output only factory task blocks (### ID — title, - Priority:, - Command:) or the single line FACTORY_RESEARCH_DONE. No markdown code fences, no preamble.",
          },
          { role: "user", content: args.prompt },
        ],
      }),
    })
    const rawText = await res.text()
    if (!res.ok) {
      return { ok: false, error: `LLM HTTP ${res.status}: ${rawText.slice(0, 800)}` }
    }
    let json: unknown
    try {
      json = JSON.parse(rawText) as unknown
    } catch {
      return { ok: false, error: "LLM: non-JSON response" }
    }
    const choices = json && typeof json === "object" && "choices" in json ? (json as { choices?: unknown }).choices : undefined
    const first = Array.isArray(choices) ? choices[0] : undefined
    const msg =
      first && typeof first === "object" && "message" in first
        ? (first as { message?: { content?: unknown } }).message
        : undefined
    const content = msg && typeof msg.content === "string" ? msg.content : ""
    if (!content.trim()) return { ok: false, error: "LLM: empty message content" }
    return { ok: true, text: content }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return { ok: false, error: err }
  }
}

async function openAiChat(args: { prompt: string }): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const key = resolveFactoryResearchApiKey()
  if (!key) return { ok: false, error: "FACTORY_RESEARCH_API_KEY or OPENAI_API_KEY not set" }

  const model = (process.env.FACTORY_RESEARCH_MODEL ?? "gpt-4o-mini").trim()
  const base = (process.env.FACTORY_RESEARCH_OPENAI_BASE ?? "https://api.openai.com/v1").replace(/\/+$/, "")
  return chatCompletionsText({ prompt: args.prompt, apiKey: key, base, model })
}

async function tryOllamaResearchChat(args: { prompt: string }): Promise<{ ok: true; text: string } | { ok: false; reason: string }> {
  if (!(await ollamaReachable())) return { ok: false, reason: "ollama_unreachable" }
  const base = `${ollamaOrigin()}/v1`
  const r = await chatCompletionsText({
    prompt: args.prompt,
    apiKey: "ollama",
    base,
    model: ollamaDefaultModel(),
  })
  if (!r.ok) return { ok: false, reason: r.error }
  return { ok: true, text: r.text }
}

function implementCommandFromItemSpec(spec: unknown, id: string): string {
  if (spec && typeof spec === "object" && spec !== null && "command" in spec) {
    const c = (spec as { command?: unknown }).command
    if (typeof c === "string" && c.trim()) return c.trim()
  }
  return `pnpm -s factory:implement ${id}`
}

function collectIdsInResearchIntakeOnly(backlogMd: string): Set<string> {
  const lines = extractResearchIntakeSection(backlogMd)
  const parsed = parseIntakeItems(lines, () => {})
  const s = new Set<string>()
  for (const p of parsed) s.add(p.id)
  return s
}

async function appendGoalSpecRoadmapToResearchIntake(args: {
  backlogPath: string
  backlogMd: string
  spec: FactoryGoalSpec
}): Promise<number> {
  let md = args.backlogMd
  let appended = 0
  const alreadyIntake = collectIdsInResearchIntakeOnly(md)
  const sorted = args.spec.roadmap_items.slice().sort((a, b) => b.priority - a.priority)
  for (const item of sorted) {
    if (alreadyIntake.has(item.id)) continue
    const cmd = implementCommandFromItemSpec(item.spec, item.id)
    const r = appendFactoryResearchIntakeBlock({
      markdown: md,
      id: item.id,
      title: item.title,
      priority: item.priority,
      command: cmd,
      extraLines: [`- Notes: goal-spec fallback (no cloud LLM API key; install Ollama or set keys for richer proposals)`],
    })
    if (r.appended) {
      md = r.markdown
      appended += 1
      alreadyIntake.add(item.id)
    }
  }
  if (appended > 0) await writeFile(args.backlogPath, md, "utf8")
  return appended
}

function llmResearchNoteTag(mode: GoalResearchPromptMode): string {
  if (mode === "improvement_when_met") return "improvement pass"
  if (mode === "remediation_failed") return "remediation (goal evaluation + repo signals)"
  return "initial plan"
}

async function applyLlmTextToBacklog(args: {
  backlogPath: string
  backlogMd: string
  text: string
  mode: GoalResearchPromptMode
  existingIdArray: string[]
}): Promise<{ appended: number; skippedReason?: string }> {
  const dupSet = new Set<string>(args.existingIdArray)
  const warns: string[] = []
  const parsed = parseResearchBlocksFromLlm(args.text, dupSet, (m) => warns.push(m))
  const blocks = parsed.blocks
  if (warns.length) for (const w of warns) console.warn(w)

  if (!blocks.length) {
    if (isExplicitResearchDone(args.text)) return { appended: 0, skippedReason: "llm_explicit_done" }
    if (parsed.duplicateSkips > 0 && parsed.invalidSkips === 0) {
      return { appended: 0, skippedReason: "llm_all_duplicate_ids" }
    }
    if (parsed.invalidSkips > 0 && parsed.duplicateSkips === 0) {
      return { appended: 0, skippedReason: "llm_invalid_blocks" }
    }
    if (parsed.duplicateSkips > 0 && parsed.invalidSkips > 0) {
      return { appended: 0, skippedReason: "llm_duplicate_and_invalid_blocks" }
    }
    return { appended: 0, skippedReason: "llm_no_parseable_blocks" }
  }

  let md = args.backlogMd
  let appended = 0
  const noteTag = llmResearchNoteTag(args.mode)
  for (const b of blocks) {
    const r = appendFactoryResearchIntakeBlock({
      markdown: md,
      id: b.id,
      title: b.title,
      priority: b.priority,
      command: b.command,
      extraLines: [`- Notes: LLM research (${noteTag})`],
    })
    if (r.appended) {
      md = r.markdown
      appended += 1
    }
  }

  if (appended > 0) await writeFile(args.backlogPath, md, "utf8")
  return { appended }
}

export type GoalResearchAppendResult = {
  appended: number
  skippedReason?: string
  error?: string
  /** Populated when `appended > 0` from this module (cloud API, local Ollama, or goal-spec sync). */
  via?: "api" | "ollama" | "goal_spec"
  /** Prompt mode used for this run (goal-state + env driven). */
  researchMode?: GoalResearchPromptMode
}

/**
 * Goal research: OpenAI-compatible API when keys are set; else local Ollama (`FACTORY_RESEARCH_TRY_OLLAMA`, default on);
 * else syncs `factory-goal-spec.json` `roadmap_items` into backlog research intake when `FACTORY_RESEARCH_GOAL_SPEC_FALLBACK` is on (default).
 */
export async function runGoalLlmResearchAppend(repoRoot: string): Promise<GoalResearchAppendResult> {
  const goalPath = path.join(repoRoot, "agents", "FACTORY_GOAL.md")
  const specPath = path.join(repoRoot, "agents", "factory-goal-spec.json")
  const roadmapPath = path.join(repoRoot, "agents", "factory-roadmap.json")
  const queuePath = path.join(repoRoot, "agents", "factory-queue.json")
  const backlogPath = path.join(repoRoot, "backlog.md")

  let goalMd: string
  let specRaw: string
  let backlogMd: string
  try {
    ;[goalMd, specRaw, backlogMd] = await Promise.all([
      readFile(goalPath, "utf8").catch(() => ""),
      readFile(specPath, "utf8"),
      readFile(backlogPath, "utf8"),
    ])
  } catch (e) {
    return { appended: 0, error: e instanceof Error ? e.message : String(e), researchMode: "milestone" }
  }

  let spec: ReturnType<typeof FactoryGoalSpecSchema.parse>
  try {
    spec = FactoryGoalSpecSchema.parse(JSON.parse(specRaw) as unknown)
  } catch (e) {
    return { appended: 0, error: `invalid factory-goal-spec.json: ${e instanceof Error ? e.message : String(e)}`, researchMode: "milestone" }
  }

  const goalState = await readFactoryGoalStateForResearch(repoRoot)
  const researchMode = resolveResearchPromptMode(goalState)
  const goalEvaluationSection = formatGoalEvaluationForResearchPrompt(goalState)
  const repoSignalsSection = await buildCalcWeatherRepoSignalsSection(repoRoot, spec.statement)

  const roadmapRaw = await readFile(roadmapPath, "utf8").catch(() => "{\"version\":1,\"items\":[]}")
  const roadmapParsed = RoadmapLiteSchema.safeParse(JSON.parse(roadmapRaw) as unknown)
  const roadmapItems = roadmapParsed.success && roadmapParsed.data.items ? roadmapParsed.data.items : []
  const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)

  const existingIds = collectExistingIdSet({
    backlogMd,
    roadmapItems,
    queueItems: queue.items.map((i) => ({ id: i.id })),
  })
  const existingIdArray: string[] = []
  existingIds.forEach((id) => existingIdArray.push(id))

  const maxTasks = (() => {
    const n = Number(process.env.FACTORY_RESEARCH_MAX_TASKS ?? "8")
    return Number.isFinite(n) && n > 0 && n <= 24 ? Math.floor(n) : 8
  })()

  const prompt = buildGoalResearchPrompt({
    goalMarkdown: goalMd,
    goalStatement: spec.statement,
    roadmapSummary: roadmapItems.map((r) => `${r.id} — ${r.title}`).join("\n"),
    existingIds: existingIdArray,
    maxTasks,
    mode: researchMode,
    goalEvaluationSection,
    repoSignalsSection,
  })

  // Try Ollama first (preferred: local, free, fast)
  const ollama = await tryOllamaResearchChat({ prompt })
  if (ollama.ok) {
    const out = await applyLlmTextToBacklog({
      backlogPath,
      backlogMd,
      text: ollama.text,
      mode: researchMode,
      existingIdArray,
    })
    return out.appended > 0 ? { ...out, via: "ollama", researchMode } : { ...out, researchMode }
  }

  // Fall back to Claude/OpenAI API if Ollama unavailable or unreachable
  const apiKey = resolveFactoryResearchApiKey()
  if (apiKey) {
    const ai = await openAiChat({ prompt })
    if (!ai.ok) return { appended: 0, error: ai.error, researchMode }
    const out = await applyLlmTextToBacklog({
      backlogPath,
      backlogMd,
      text: ai.text,
      mode: researchMode,
      existingIdArray,
    })
    return out.appended > 0 ? { ...out, via: "api", researchMode } : { ...out, researchMode }
  }

  if (!envFlag(process.env.FACTORY_RESEARCH_GOAL_SPEC_FALLBACK, true) || researchMode === "improvement_when_met") {
    if (researchMode === "improvement_when_met") {
      return { appended: 0, skippedReason: "no_llm_credentials_improvement_pass", researchMode }
    }
    return { appended: 0, skippedReason: "no_llm_credentials", researchMode }
  }

  const fb = await appendGoalSpecRoadmapToResearchIntake({
    backlogPath,
    backlogMd,
    spec,
  })
  if (fb > 0) return { appended: fb, via: "goal_spec", researchMode }
  return {
    appended: 0,
    researchMode,
    skippedReason:
      ollama.ok === false && ollama.reason !== "ollama_unreachable"
        ? `ollama_failed_then_goal_spec_empty (${ollama.reason})`
        : "goal_spec_fallback_nothing_new",
  }
}
