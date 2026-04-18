#!/usr/bin/env node
/**
 * Copies the latest graphify output into portfolio/public/knowledge-graph/ so
 * the /knowledge-graph page serves the freshest graph.
 *
 * Source:   ../graphify-visitor/graph.html            -> public/knowledge-graph/graph.html
 *           ../graphify-visitor/graph.json            -> public/knowledge-graph/graph.json
 *           ../graphify-visitor/.graphify_labels.json -> public/knowledge-graph/labels.json
 *
 * graph.html is graphify's own standalone vis.js viewer and is what the
 * /knowledge-graph page iframes. graph.json + labels.json are kept alongside
 * it for tooling / future custom views.
 *
 * Runs as a `prebuild` step. When the source files are missing (e.g. Vercel
 * builds, where graphify-visitor/ is not part of the deploy), the script logs
 * a warning and exits 0 so the build can continue using the committed copy.
 */
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const portfolioRoot = resolve(__dirname, "..")
const repoRoot = resolve(portfolioRoot, "..")

const sources = [
  {
    from: resolve(repoRoot, "graphify-visitor/graph.html"),
    to: resolve(portfolioRoot, "public/knowledge-graph/graph.html"),
    label: "graph.html",
  },
  {
    from: resolve(repoRoot, "graphify-visitor/graph.json"),
    to: resolve(portfolioRoot, "public/knowledge-graph/graph.json"),
    label: "graph.json",
  },
  {
    from: resolve(repoRoot, "graphify-visitor/.graphify_labels.json"),
    to: resolve(portfolioRoot, "public/knowledge-graph/labels.json"),
    label: "labels.json",
  },
]

const destDir = resolve(portfolioRoot, "public/knowledge-graph")
if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })

let copied = 0
let missing = 0

for (const { from, to, label } of sources) {
  if (!existsSync(from)) {
    console.warn(`[sync:graph] skip ${label} — source not found at ${from}`)
    missing += 1
    continue
  }
  copyFileSync(from, to)
  const size = (statSync(to).size / 1024).toFixed(1)
  console.log(`[sync:graph] copied ${label} (${size} KB)`)
  copied += 1
}

if (copied === 0 && missing > 0) {
  console.warn(
    "[sync:graph] no source files found — using existing public/knowledge-graph/ snapshot.",
  )
}
