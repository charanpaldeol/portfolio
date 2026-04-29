import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import {
  MarketEvidenceFileSchema,
  ProductCandidatesFileSchema,
  ProductSeedsFileSchema,
  scoreCandidate,
  type ProductCandidate,
} from "@/lib/agent-factory/market"

function nowIso() {
  return new Date().toISOString()
}

function snippetMatchesSeed(text: string, keywords: string[]) {
  const lower = text.toLowerCase()
  return keywords.some((k) => lower.includes(k.toLowerCase()))
}

async function main() {
  const root = process.cwd()
  const evidencePath = path.join(root, "agents", "market-evidence.json")
  const seedsPath = path.join(root, "agents", "product-seeds.json")
  const outPath = path.join(root, "agents", "product-candidates.json")

  let evidence
  try {
    evidence = MarketEvidenceFileSchema.parse(JSON.parse(await readFile(evidencePath, "utf8")) as unknown)
  } catch {
    evidence = MarketEvidenceFileSchema.parse({
      version: 1,
      snippets: [],
      updated_at: nowIso(),
    })
  }
  const seedsFile = ProductSeedsFileSchema.parse(JSON.parse(await readFile(seedsPath, "utf8")) as unknown)

  const corpusParts: string[] = []
  const matchedBySeed = new Map<string, string[]>()
  for (const seed of seedsFile.items) matchedBySeed.set(seed.id, [])

  for (const s of evidence.snippets) {
    const block = `${s.title ?? ""}\n${s.excerpt}`
    corpusParts.push(block)
    for (const seed of seedsFile.items) {
      if (snippetMatchesSeed(block, seed.keywords)) {
        matchedBySeed.get(seed.id)?.push(s.id)
      }
    }
  }
  const fullCorpus = corpusParts.join("\n")

  const candidates: ProductCandidate[] = []
  for (const seed of seedsFile.items) {
    const ids = Array.from(new Set(matchedBySeed.get(seed.id) ?? []))
    const relevantSnippets = evidence.snippets.filter((s) => ids.includes(s.id))
    const localCorpus = relevantSnippets.length
      ? relevantSnippets.map((s) => `${s.title ?? ""}\n${s.excerpt}`).join("\n")
      : fullCorpus

    const score = scoreCandidate({ seed, corpus: localCorpus, snippetIds: ids })
    candidates.push({
      id: seed.id,
      name: seed.name,
      seed_id: seed.id,
      score,
      matched_snippet_ids: ids,
    })
  }

  const file = ProductCandidatesFileSchema.parse({
    version: 1,
    candidates: candidates.sort((a, b) => b.score.weighted_total - a.score.weighted_total),
    updated_at: nowIso(),
  })
  await writeFile(outPath, `${JSON.stringify(file, null, 2)}\n`, "utf8")
  console.log(`factory:candidates:refresh: wrote ${file.candidates.length} candidate(s)`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
