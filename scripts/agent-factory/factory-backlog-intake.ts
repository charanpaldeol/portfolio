import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

import {
  defaultIntakeSpec,
  extractResearchIntakeSection,
  parseIntakeItems,
  researchIntakeSectionHeading,
} from "@/lib/agent-factory/backlog-intake"
import { withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"

const RoadmapSchema = z.object({
  version: z.literal(1),
  items: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      priority: z.number().int().min(0),
      spec: z.unknown().optional(),
    }),
  ),
})

async function main() {
  const root = process.cwd()
  const backlogPath = path.join(root, "backlog.md")
  const roadmapPath = path.join(root, "agents", "factory-roadmap.json")
  const metaPath = path.join(root, "agents", "factory-roadmap-meta.json")
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `backlog_intake_${process.pid}`

  const md = await readFile(backlogPath, "utf8")
  const section = extractResearchIntakeSection(md)
  if (!section.length) {
    console.log(`factory:backlog:intake: no "${researchIntakeSectionHeading()}" section in backlog.md — nothing to merge`)
    return
  }

  const parsed = parseIntakeItems(section, console.warn.bind(console))
  if (!parsed.length) {
    console.log("factory:backlog:intake: section empty or no valid items (need ### ID — title and - Priority: N)")
    return
  }

  await withFileLock({
    lockPath: `${roadmapPath}.lock`,
    workerId,
    fn: async () => {
      const roadmap = RoadmapSchema.parse(JSON.parse(await readFile(roadmapPath, "utf8")) as unknown)
      const incoming = new Map(parsed.map((p) => [p.id, p] as const))
      const seen = new Set<string>()
      const nextItems = []

      for (const item of roadmap.items) {
        const rep = incoming.get(item.id)
        if (rep) {
          nextItems.push({
            id: rep.id,
            title: rep.title,
            priority: rep.priority,
            spec: defaultIntakeSpec(rep.id, rep.command, rep.priority),
          })
          seen.add(rep.id)
        } else {
          nextItems.push(item)
        }
      }
      for (const p of parsed) {
        if (!seen.has(p.id)) {
          nextItems.push({
            id: p.id,
            title: p.title,
            priority: p.priority,
            spec: defaultIntakeSpec(p.id, p.command, p.priority),
          })
          seen.add(p.id)
        }
      }

      await writeJsonFile(roadmapPath, { version: 1, items: nextItems })
    },
  })

  let seq = 1
  try {
    const raw = await readFile(metaPath, "utf8")
    const m = JSON.parse(raw) as { seq?: number }
    seq = (typeof m.seq === "number" ? m.seq : 0) + 1
  } catch {
    seq = 1
  }
  await writeJsonFile(metaPath, { version: 1, seq })

  console.log(`factory:backlog:intake: merged ${parsed.length} item(s) from backlog.md → factory-roadmap.json (meta seq=${seq})`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
