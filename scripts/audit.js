#!/usr/bin/env node
/**
 * Unified audit script — checks design.md + code-architecture-review.md compliance.
 *
 * Usage:
 *   node scripts/audit.js           # run all audits
 *   node scripts/audit.js design    # design only
 *   node scripts/audit.js arch      # architecture only
 *
 * Exit code 1 if violations found (blocks CI).
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const violations = []

// ── Helpers ──────────────────────────────────────────────────────────────────
function walk(dir, ext) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue
    if (entry.isDirectory()) results.push(...walk(full, ext))
    else if (ext.some((e) => entry.name.endsWith(e))) results.push(full)
  }
  return results
}

function rel(p) {
  return path.relative(ROOT, p)
}

function addViolation(file, rule, source, line) {
  violations.push({ file: rel(file), rule, source, line })
}

// ── Design Audit (docs/DESIGN.md) ───────────────────────────────────────────
function auditDesign() {
  const files = [
    ...walk(path.join(ROOT, "app"), [".tsx", ".jsx", ".ts"]),
    ...walk(path.join(ROOT, "components"), [".tsx", ".jsx", ".ts"]),
  ]

  const CONFIG_DIRS = ["styles", "tailwind.config", "config/", "DESIGN.md"]

  for (const file of files) {
    if (CONFIG_DIRS.some((d) => file.includes(d))) continue

    const content = fs.readFileSync(file, "utf8")
    const lines = content.split("\n")

    lines.forEach((line, i) => {
      // Rule: No hardcoded hex colors
      const hexMatches = line.match(/#(?:[0-9a-fA-F]{3}){1,2}(?![0-9a-fA-F])/g)
      if (hexMatches) {
        hexMatches.forEach((hex) => {
          addViolation(file, `Hardcoded color ${hex} — use design tokens`, "DESIGN.md § 2", i + 1)
        })
      }

      // Rule: No 1px solid borders
      if (/1px\s+solid/.test(line)) {
        addViolation(file, 'Inline "1px solid" border — use surface color shifts', "DESIGN.md § 2 No-Line Rule", i + 1)
      }

      // Rule: No twMerge usage
      if (/twMerge\s*\(/.test(line)) {
        addViolation(file, "twMerge() — use cn() from @/lib/utils", "code-architecture-review.md § 6.2", i + 1)
      }
    })
  }
}

// ── Architecture Audit (docs/code-architecture-review.md) ───────────────────
function auditArchitecture() {
  // Check component sizes
  if (fs.existsSync(path.join(ROOT, "components"))) {
    const components = walk(path.join(ROOT, "components"), [".tsx", ".jsx"])
    for (const file of components) {
      const content = fs.readFileSync(file, "utf8")
      const lineCount = content.split("\n").length
      if (lineCount > 300) {
        addViolation(
          file,
          `Component is ${lineCount} lines (max 300) — split into sub-components`,
          "code-architecture-review.md § 2.2",
          1,
        )
      }
    }
  }

  // Check API routes have Zod
  if (fs.existsSync(path.join(ROOT, "app", "api"))) {
    const apiRoutes = walk(path.join(ROOT, "app", "api"), [".ts"])
    for (const file of apiRoutes) {
      if (!file.endsWith("route.ts")) continue
      const content = fs.readFileSync(file, "utf8")
      if (!content.includes("from 'zod'") && !content.includes('from "zod"')) {
        addViolation(file, "API route missing Zod validation", "code-architecture-review.md § 1.1", 1)
      }
    }
  }

  // Check for hardcoded data arrays in components
  if (fs.existsSync(path.join(ROOT, "components"))) {
    const components = walk(path.join(ROOT, "components"), [".tsx", ".jsx"])
    for (const file of components) {
      const content = fs.readFileSync(file, "utf8")
      // Large arrays (3+ objects) hardcoded in component files
      const arrayMatches = content.match(/const\s+\w+\s*=\s*\[\s*\{[\s\S]{200,}?\}\s*\]/g)
      if (arrayMatches) {
        addViolation(file, "Large data array hardcoded in component — move to /lib/", "code-architecture-review.md § 2.5", 1)
      }
    }
  }
}

// ── Run ─────────────────────────────────────────────────────────────────────
const mode = process.argv[2] || "all"

if (mode === "all" || mode === "design") auditDesign()
if (mode === "all" || mode === "arch") auditArchitecture()

// ── Report ──────────────────────────────────────────────────────────────────
if (violations.length === 0) {
  console.log("\n\x1b[32m✅ Audit passed — 0 violations\x1b[0m\n")
  process.exit(0)
} else {
  console.error(`\n\x1b[31m❌ ${violations.length} violation(s) found:\x1b[0m\n`)
  violations.forEach((v) => {
    console.error(`  \x1b[33m${v.file}:${v.line}\x1b[0m`)
    console.error(`    Rule: ${v.rule}`)
    console.error(`    Source: ${v.source}\n`)
  })
  process.exit(1)
}
