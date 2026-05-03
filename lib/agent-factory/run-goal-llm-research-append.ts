import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { z } from "zod"

import { appendFactoryResearchIntakeBlock, extractResearchIntakeSection, parseIntakeItems } from "@/lib/agent-factory/backlog-intake"
import { FactoryGoalSpecSchema } from "@/lib/agent-factory/goal-spec"
import { AgentFactoryQueueSchema } from "@/lib/agent-factory/queue"
import { buildGoalResearchPrompt, isExplicitResearchDone, parseResearchBlocksFromLlm } from "@/lib/agent-factory/research-goal-llm"
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

async function openAiChat(args: { prompt: string }): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const key = (process.env.OPENAI_API_KEY ?? "").trim()
  if (!key) return { ok: false, error: "OPENAI_API_KEY not set" }

  const model = (process.env.FACTORY_RESEARCH_MODEL ?? "gpt-4o-mini").trim()
  const base = (process.env.FACTORY_RESEARCH_OPENAI_BASE ?? "https://api.openai.com/v1").replace(/\/+$/, "")

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
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
      return { ok: false, error: `OpenAI HTTP ${res.status}: ${rawText.slice(0, 800)}` }
    }
    let json: unknown
    try {
      json = JSON.parse(rawText) as unknown
    } catch {
      return { ok: false, error: "OpenAI: non-JSON response" }
    }
    const choices = json && typeof json === "object" && "choices" in json ? (json as { choices?: unknown }).choices : undefined
    const first = Array.isArray(choices) ? choices[0] : undefined
    const msg =
      first && typeof first === "object" && "message" in first
        ? (first as { message?: { content?: unknown } }).message
        : undefined
    const content = msg && typeof msg.content === "string" ? msg.content : ""
    if (!content.trim()) return { ok: false, error: "OpenAI: empty message content" }
    return { ok: true, text: content }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return { ok: false, error: err }
  }
}

/**
 * Calls OpenAI when `OPENAI_API_KEY` is set; appends parsed blocks to `backlog.md` under Factory research intake.
 */
export async function runGoalLlmResearchAppend(
  repoRoot: string,
  improvementPass: boolean,
): Promise<{ appended: number; skippedReason?: string; error?: string }> {
  const key = (process.env.OPENAI_API_KEY ?? "").trim()
  if (!key) return { appended: 0, skippedReason: "no OPENAI_API_KEY" }

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
    return { appended: 0, error: e instanceof Error ? e.message : String(e) }
  }

  let spec: ReturnType<typeof FactoryGoalSpecSchema.parse>
  try {
    spec = FactoryGoalSpecSchema.parse(JSON.parse(specRaw) as unknown)
  } catch (e) {
    return { appended: 0, error: `invalid factory-goal-spec.json: ${e instanceof Error ? e.message : String(e)}` }
  }

  const roadmapRaw = await readFile(roadmapPath, "utf8").catch(() => "{\"version\":1,\"items\":[]}")
  const roadmapParsed = RoadmapLiteSchema.safeParse(JSON.parse(roadmapRaw) as unknown)
  const roadmapItems = roadmapParsed.success && roadmapParsed.data.items ? roadmapParsed.data.items : []
  const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)

  const existingIds = collectExistingIdSet({
    backlogMd,
    roadmapItems,
    queueItems: queue.items.map((i) => ({ id: i.id })),
  })

  const maxTasks = (() => {
    const n = Number(process.env.FACTORY_RESEARCH_MAX_TASKS ?? "8")
    return Number.isFinite(n) && n > 0 && n <= 24 ? Math.floor(n) : 8
  })()

  const prompt = buildGoalResearchPrompt({
    goalMarkdown: goalMd,
    goalStatement: spec.statement,
    roadmapSummary: roadmapItems.map((r) => `${r.id} — ${r.title}`).join("\n"),
    existingIds: [...existingIds],
    maxTasks,
    improvementPass,
  })

  const ai = await openAiChat({ prompt })
  if (!ai.ok) return { appended: 0, error: ai.error }

  const dupSet = new Set<string>(existingIds)
  const warns: string[] = []
  const blocks = parseResearchBlocksFromLlm(ai.text, dupSet, (m) => warns.push(m))
  if (warns.length) for (const w of warns) console.warn(w)

  if (!blocks.length) {
    if (isExplicitResearchDone(ai.text)) return { appended: 0, skippedReason: "llm_explicit_done" }
    return { appended: 0, skippedReason: improvementPass ? "llm_no_parseable_blocks" : "llm_no_parseable_blocks" }
  }

  let md = backlogMd
  let appended = 0
  for (const b of blocks) {
    const r = appendFactoryResearchIntakeBlock({
      markdown: md,
      id: b.id,
      title: b.title,
      priority: b.priority,
      command: b.command,
      extraLines: [`- Notes: LLM research (${improvementPass ? "improvement pass" : "initial plan"})`],
    })
    if (r.appended) {
      md = r.markdown
      appended += 1
    }
  }

  if (appended > 0) {
    await writeFile(backlogPath, md, "utf8")
  }
  return { appended }
}
