import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import {
  ProductCandidatesFileSchema,
  ProductSeedsFileSchema,
  SelectedProductSchema,
  selectTopCandidate,
} from "@/lib/agent-factory/market"

function nowIso() {
  return new Date().toISOString()
}

async function main() {
  const root = process.cwd()
  const candidatesPath = path.join(root, "agents", "product-candidates.json")
  const seedsPath = path.join(root, "agents", "product-seeds.json")
  const outPath = path.join(root, "agents", "selected-product.json")

  const candidatesFile = ProductCandidatesFileSchema.parse(JSON.parse(await readFile(candidatesPath, "utf8")) as unknown)
  const seedsFile = ProductSeedsFileSchema.parse(JSON.parse(await readFile(seedsPath, "utf8")) as unknown)
  const seedById = new Map(seedsFile.items.map((s) => [s.id, s] as const))

  const top = selectTopCandidate(candidatesFile.candidates)
  if (!top) {
    console.error("factory:product:select: no candidates")
    process.exitCode = 1
    return
  }

  const seed = seedById.get(top.seed_id)
  const icp =
    seed?.icp ??
    "B2B teams buying security/compliance software with recurring procurement cycles (refine after customer interviews)."
  const pricing_hypothesis =
    seed?.pricing_hypothesis ??
    "Usage-based or per-seat monthly subscription with annual option; start with a single paid tier."

  const selected = SelectedProductSchema.parse({
    version: 1,
    product_id: top.id,
    name: top.name,
    icp,
    pricing_hypothesis,
    chosen_at: nowIso(),
    score: top.score,
    evidence_snippet_ids: top.matched_snippet_ids,
  })

  await writeFile(outPath, `${JSON.stringify(selected, null, 2)}\n`, "utf8")
  console.log(`factory:product:select: selected ${selected.product_id} (${selected.name})`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
