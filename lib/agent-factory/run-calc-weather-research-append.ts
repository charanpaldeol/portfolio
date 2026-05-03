import { access, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { appendFactoryResearchIntakeBlock, extractResearchIntakeSection, parseIntakeItems } from "@/lib/agent-factory/backlog-intake"
import { collectCalcWeatherSignals } from "@/lib/agent-factory/research-calc-weather-signals"
import { AgentFactoryQueueSchema } from "@/lib/agent-factory/queue"
import { readJsonFile } from "@/lib/agent-factory/storage"

async function fileExists(filePath: string) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

function roadmapIdsFromUnknown(raw: unknown): Set<string> {
  const ids = new Set<string>()
  if (!raw || typeof raw !== "object") return ids
  const items = (raw as { items?: unknown }).items
  if (!Array.isArray(items)) return ids
  for (const it of items) {
    if (it && typeof it === "object" && "id" in it && typeof (it as { id: unknown }).id === "string") {
      ids.add((it as { id: string }).id)
    }
  }
  return ids
}

/** Appends calc/weather code-signal tasks to `backlog.md`. Returns count appended. */
export async function runCalcWeatherResearchAppend(repoRoot: string): Promise<number> {
  const backlogPath = path.join(repoRoot, "backlog.md")
  const roadmapPath = path.join(repoRoot, "agents", "factory-roadmap.json")
  const queuePath = path.join(repoRoot, "agents", "factory-queue.json")

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
    return 0
  }

  const hasCalcLayout = await fileExists(calcLayoutPath)
  const signals = collectCalcWeatherSignals({
    calculatorPageSource: calcSrc,
    weatherPageSource: wxSrc,
    weatherRouteSource: apiSrc,
    calculatorHasServerLayout: hasCalcLayout,
  })

  const [backlogMd, roadmapRaw, queue] = await Promise.all([
    readFile(backlogPath, "utf8"),
    readFile(roadmapPath, "utf8").catch(() => "{}"),
    readJsonFile(queuePath, AgentFactoryQueueSchema),
  ])

  const taken = roadmapIdsFromUnknown(JSON.parse(roadmapRaw) as unknown)
  for (const it of queue.items) taken.add(it.id)

  const sectionLines = extractResearchIntakeSection(backlogMd)
  const parsed = parseIntakeItems(sectionLines, () => {})
  for (const p of parsed) taken.add(p.id)

  let md = backlogMd
  let appended = 0
  for (const s of signals) {
    if (taken.has(s.id)) continue
    const r = appendFactoryResearchIntakeBlock({
      markdown: md,
      id: s.id,
      title: s.title,
      priority: s.priority,
      command: s.command,
      extraLines: s.extraLines,
    })
    if (r.appended) {
      md = r.markdown
      appended += 1
      taken.add(s.id)
    }
  }

  if (appended > 0) {
    await writeFile(backlogPath, md, "utf8")
  }
  return appended
}
