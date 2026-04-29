import { execSync } from "node:child_process"

function sh(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).trim()
}

function scoreRisk(files) {
  const high = [/^app\/api\//, /^lib\/db\.ts$/, /^env\.mjs$/, /^\.github\/workflows\//]
  const medium = [/^config\//, /^app\/layout\.tsx$/, /^components\/layout\//, /^playwright\.config\./]

  let level = "low"
  for (const f of files) {
    if (high.some((r) => r.test(f))) return "high"
    if (medium.some((r) => r.test(f))) level = "medium"
  }
  return level
}

function main() {
  const porcelain = sh("git status --porcelain")
  const files = porcelain
    ? porcelain
        .split("\n")
        .map((l) => l.slice(3))
        .filter(Boolean)
    : []

  const risk = scoreRisk(files)

  console.log("\n## Self-review summary\n")
  console.log(`- Risk: ${risk}`)
  console.log(`- Changed files (${files.length}):`)
  for (const f of files) console.log(`  - ${f}`)

  if (files.length) {
    console.log("\n## Diff (stat)\n")
    console.log(sh("git diff --stat"))
  }
  console.log("")
}

main()

