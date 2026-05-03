import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

const RoadmapItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  priority: z.number().int().min(0),
  spec: z.unknown().optional(),
})

const RoadmapSchema = z.object({
  version: z.literal(1),
  items: z.array(RoadmapItemSchema),
})

function nowIso() {
  return new Date().toISOString()
}

function asRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object") return null
  return v as Record<string, unknown>
}

function readStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.filter((x) => typeof x === "string")
}

function renderBacklogBlock(args: { id: string; title: string; priority: number; definitionOfDone: string[] }) {
  const lines: string[] = []
  lines.push("")
  lines.push(`### ${args.id} — ${args.title}`)
  lines.push("")
  lines.push(`- Priority: ${args.priority}`)
  lines.push(`- Added: ${nowIso()}`)
  lines.push("")
  if (args.definitionOfDone.length) {
    lines.push("**Definition of done**")
    for (const item of args.definitionOfDone) lines.push(`- [ ] ${item}`)
    lines.push("")
  }
  lines.push("**Implementation notes**")
  lines.push("- [ ] (Agent) Break into smaller PR-sized tasks")
  lines.push("- [ ] (Agent) Identify required env vars / manual setup and record here")
  lines.push("")
  return lines.join("\n")
}

async function main() {
  const itemId = process.argv[2]?.trim()
  if (!itemId) {
    console.error("factory:roadmap:expand: missing item id arg")
    process.exitCode = 1
    return
  }

  const root = process.cwd()
  const roadmapPath = path.join(root, "agents", "factory-roadmap.json")
  const entryPath = path.join(root, "backlog", `${itemId}.md`)

  const roadmapRaw = await readFile(roadmapPath, "utf8")
  const roadmap = RoadmapSchema.parse(JSON.parse(roadmapRaw) as unknown)
  const item = roadmap.items.find((i) => i.id === itemId)
  if (!item) {
    console.error(`factory:roadmap:expand: item not found: ${itemId}`)
    process.exitCode = 1
    return
  }

  const spec = asRecord(item.spec) ?? {}
  const definitionOfDone = readStringArray(spec["definition_of_done"])

  await mkdir(path.dirname(entryPath), { recursive: true })
  const block = renderBacklogBlock({ id: item.id, title: item.title, priority: item.priority, definitionOfDone })
  await writeFile(entryPath, block.trimStart() + "\n", "utf8")
  console.log(`factory:roadmap:expand: wrote backlog/${item.id}.md`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

