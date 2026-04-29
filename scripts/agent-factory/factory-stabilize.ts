import { spawn } from "node:child_process"
import { chmod, mkdir, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

function nowIso() {
  return new Date().toISOString()
}

async function spawnCapture(cmd: string, argv: string[], cwd: string) {
  return await new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(cmd, argv, { cwd, shell: false })
    let stdout = ""
    let stderr = ""
    child.stdout?.on("data", (c) => (stdout += c.toString("utf8")))
    child.stderr?.on("data", (c) => (stderr += c.toString("utf8")))
    child.on("close", (c) => resolve({ code: c ?? 1, stdout, stderr }))
  })
}

async function spawnInherit(cmd: string, argv: string[], cwd: string) {
  return await new Promise<number>((resolve) => {
    const child = spawn(cmd, argv, { cwd, stdio: "inherit", shell: false })
    child.on("close", (c) => resolve(c ?? 1))
  })
}

async function fileExists(p: string) {
  try {
    const { stat } = await import("node:fs/promises")
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function resolveRepoRoot(startCwd: string) {
  const envRoot = (process.env.FACTORY_ROOT ?? "").trim()
  if (envRoot) return envRoot

  const top = await spawnCapture("git", ["rev-parse", "--show-toplevel"], startCwd)
  if (top.code !== 0) throw new Error(`factory:stabilize: failed to resolve repo root (git rev-parse exit ${top.code})`)
  return top.stdout.trim()
}

async function ensureTsxShim(root: string) {
  const shimPath = path.join(root, "node_modules", ".bin", "tsx")
  if (await fileExists(shimPath)) return { ok: true as const, changed: false as const }

  const pnpmDir = path.join(root, "node_modules", ".pnpm")
  if (!(await fileExists(pnpmDir))) return { ok: false as const, reason: "missing node_modules/.pnpm" }

  const entries = await readdir(pnpmDir)
  const candidates = entries.filter((e) => e.startsWith("tsx@")).sort()
  const latest = candidates.at(-1)
  if (!latest) return { ok: false as const, reason: "missing tsx@* in node_modules/.pnpm" }

  const cliPath = path.join(pnpmDir, latest, "node_modules", "tsx", "dist", "cli.mjs")
  if (!(await fileExists(cliPath))) return { ok: false as const, reason: `missing ${cliPath}` }

  await mkdir(path.dirname(shimPath), { recursive: true })
  const shim = `#!/usr/bin/env bash
set -euo pipefail
node "${cliPath}" "$@"
`
  await writeFile(shimPath, shim, "utf8")
  await chmod(shimPath, 0o755)
  return { ok: true as const, changed: true as const, cliPath }
}

async function main() {
  const startCwd = process.cwd()
  const root = await resolveRepoRoot(startCwd)

  console.log(`factory:stabilize: start ${nowIso()}`)
  console.log(`factory:stabilize: root=${root}`)

  const shim = await ensureTsxShim(root)
  if (!shim.ok) console.warn(`factory:stabilize: tsx shim not restored (${shim.reason})`)
  if (shim.ok && shim.changed) console.warn("factory:stabilize: restored tsx shim (node_modules/.bin/tsx)")

  // Reclaim stale queue/runs first; this reduces deadlocks during the cleanup pass.
  await spawnInherit("pnpm", ["-s", "factory:reclaim"], root)

  // Cleanup orphan worktrees + git maintenance (does not depend on incident).
  const maintenanceCode = await spawnInherit("pnpm", ["-s", "factory:maintenance"], root)
  if (maintenanceCode !== 0) throw new Error(`factory:stabilize: factory:maintenance failed (exit ${maintenanceCode})`)

  console.log(`factory:stabilize: done ${nowIso()}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

