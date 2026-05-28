import fs from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const REPORTS_DIR = path.join(ROOT, "docs", "governance", "reports")

function isMarkdownHeading(line) {
  return /^##\s+/.test(line)
}

function stripListPrefix(line) {
  return line.replace(/^\s*[-*]\s+/, "").trim()
}

async function listReportFiles() {
  try {
    const entries = await fs.readdir(REPORTS_DIR, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => path.join(REPORTS_DIR, e.name))
      .sort()
  } catch {
    return []
  }
}

function extractSectionBullets(markdown, header) {
  const lines = markdown.split("\n")
  const startIdx = lines.findIndex((l) => l.trim() === `## ${header}`)
  if (startIdx === -1) return []

  const bullets = []
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i]
    if (isMarkdownHeading(line)) break
    if (/^\s*[-*]\s+/.test(line)) bullets.push(stripListPrefix(line))
  }
  return bullets
}

async function main() {
  const files = await listReportFiles()
  if (files.length === 0) {
    console.log(`No reports found in ${path.relative(ROOT, REPORTS_DIR)}.`)
    process.exit(0)
  }

  const suggestions = []

  for (const file of files) {
    const content = await fs.readFile(file, "utf8")
    const watchOuts = extractSectionBullets(content, "Anything governance should pay attention to")
    const knownIssues = extractSectionBullets(content, "Known issues or TODOs left for Charan")

    for (const item of watchOuts) {
      suggestions.push({ file: path.relative(ROOT, file), type: "watchout", text: item })
    }
    for (const item of knownIssues) {
      if (!item || item.toLowerCase() === "none") continue
      suggestions.push({ file: path.relative(ROOT, file), type: "todo", text: item })
    }
  }

  if (suggestions.length === 0) {
    console.log("No rule candidates found. Add bullets under the report section:")
    console.log('  "## Anything governance should pay attention to"')
    process.exit(0)
  }

  console.log("\n# Candidate rule / guardrail updates\n")
  console.log(
    "These are extracted from worker completion reports. Convert high-signal items into:\n" +
      "- a `.claude/rules/` entry (behavioral guardrail)\n" +
      "- an ESLint rule / audit check (hard enforcement)\n" +
      "- a test (verifiable contract)\n",
  )

  for (const s of suggestions) {
    console.log(`- [${s.type}] ${s.text}\n  - source: ${s.file}`)
  }
  console.log("")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
