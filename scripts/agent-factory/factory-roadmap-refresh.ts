import { spawn } from "node:child_process"
import process from "node:process"

function nowIso() {
  return new Date().toISOString()
}

async function runStep(cmd: string, argv: string[], cwd: string) {
  return await new Promise<number>((resolve) => {
    const child = spawn(cmd, argv, { cwd, stdio: "inherit", shell: false })
    child.on("close", (code) => resolve(code ?? 1))
  })
}

async function main() {
  const root = process.cwd()
  console.log(`factory:roadmap:refresh: start ${nowIso()}`)

  const steps: Array<[string, string[]]> = [
    ["pnpm", ["-s", "factory:market:scan"]],
    ["pnpm", ["-s", "factory:candidates:refresh"]],
    ["pnpm", ["-s", "factory:product:select"]],
    ["pnpm", ["-s", "factory:roadmap:generate"]],
  ]

  for (const [cmd, argv] of steps) {
    const label = argv.join(" ")
    const code = await runStep(cmd, argv, root)
    if (code !== 0) {
      console.warn(`factory:roadmap:refresh: step failed (${code}): ${label} — continuing`)
    }
  }

  console.log(`factory:roadmap:refresh: done ${nowIso()}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
