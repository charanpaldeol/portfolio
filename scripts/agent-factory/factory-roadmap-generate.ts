import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { z } from "zod"

import { SelectedProductSchema, buildRoadmapTemplateForProduct } from "@/lib/agent-factory/market"

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
  const selectedPath = path.join(root, "agents", "selected-product.json")
  const roadmapPath = path.join(root, "agents", "factory-roadmap.json")
  const metaPath = path.join(root, "agents", "factory-roadmap-meta.json")

  let roadmapRevision = 1
  try {
    const raw = await readFile(metaPath, "utf8")
    const m = JSON.parse(raw) as { seq?: number }
    roadmapRevision = (typeof m.seq === "number" ? m.seq : 0) + 1
  } catch {
    roadmapRevision = 1
  }
  await writeFile(metaPath, `${JSON.stringify({ version: 1, seq: roadmapRevision }, null, 2)}\n`, "utf8")

  const selected = SelectedProductSchema.parse(JSON.parse(await readFile(selectedPath, "utf8")) as unknown)
  const template = buildRoadmapTemplateForProduct({
    productName: selected.name,
    productId: selected.product_id,
    roadmapRevision,
  })

  const items = template.map((t) => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    spec: {
      command: `pnpm -s factory:roadmap:expand ${t.id}`,
      definition_of_done: t.definition_of_done,
    },
  }))

  const roadmap = RoadmapSchema.parse({ version: 1, items })
  await writeFile(roadmapPath, `${JSON.stringify(roadmap, null, 2)}\n`, "utf8")
  console.log(`factory:roadmap:generate: wrote ${items.length} item(s) for ${selected.product_id} (revision R${roadmapRevision})`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
