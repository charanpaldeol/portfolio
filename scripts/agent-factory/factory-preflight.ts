import process from "node:process"

import { assertFactoryPreflight, resolveFactoryRepoRoot } from "@/lib/agent-factory/factory-preflight"

async function main() {
  const startCwd = process.cwd()
  const repoRoot = await resolveFactoryRepoRoot(startCwd)
  await assertFactoryPreflight(repoRoot)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
