#!/usr/bin/env node
/**
 * Remove local generated artifacts (safe to delete; most are gitignored).
 *
 * Usage: node scripts/clean.mjs [--next]
 */
import fs from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const includeNext = process.argv.includes("--next")

const TARGETS = [
  "graphify-content",
  "graphify-out",
  "graphify-visitor",
  "graphify-out.inner-backup",
  "playwright-report",
  "test-results",
  ...(includeNext ? [".next"] : []),
]

async function rmDir(rel) {
  const full = path.join(ROOT, rel)
  try {
    await fs.rm(full, { recursive: true, force: true })
    console.log(`removed ${rel}`)
  } catch (err) {
    console.warn(`skip ${rel}: ${err instanceof Error ? err.message : String(err)}`)
  }
}

async function main() {
  console.log("\nCleaning local artifacts...\n")
  for (const t of TARGETS) await rmDir(t)
  console.log("\nDone.\n")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
