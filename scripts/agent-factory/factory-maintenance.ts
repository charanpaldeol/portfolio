import { spawn } from "node:child_process"
import { readdir, rm } from "node:fs/promises"
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

async function resolveRepoRoot(startCwd: string) {
  const envRoot = (process.env.FACTORY_ROOT ?? "").trim()
  if (envRoot) return envRoot

  const top = await spawnCapture("git", ["rev-parse", "--show-toplevel"], startCwd)
  if (top.code !== 0) throw new Error(`factory:maintenance: failed to resolve repo root (git rev-parse exit ${top.code})`)
  return top.stdout.trim()
}

function parseWorktreeListPorcelain(stdout: string) {
  const lines = stdout.split("\n")
  const paths: string[] = []
  for (const line of lines) {
    if (!line.startsWith("worktree ")) continue
    const p = line.slice("worktree ".length).trim()
    if (p) paths.push(p)
  }
  return paths
}

async function cleanOrphanWorktreeDirs(root: string) {
  const { code, stdout } = await spawnCapture("git", ["worktree", "list", "--porcelain"], root)
  if (code !== 0) {
    console.warn(`factory:maintenance: git worktree list failed (exit ${code}); skipping orphan cleanup`)
    return
  }

  const active = new Set(parseWorktreeListPorcelain(stdout).map((p) => path.resolve(p)))
  const worktreesDir = path.join(root, ".agent-worktrees")
  let entries: string[] = []
  try {
    entries = await readdir(worktreesDir)
  } catch {
    return
  }

  for (const entry of entries) {
    const full = path.join(worktreesDir, entry)
    const resolved = path.resolve(full)
    if (active.has(resolved)) continue
    // Only touch our managed area, and only when it is NOT an active worktree.
    await rm(full, { recursive: true, force: true })
  }
}

async function main() {
  const startCwd = process.cwd()
  const root = await resolveRepoRoot(startCwd)
  const incidentPath = process.argv.slice(2).join(" ").trim() || null

  console.log(`factory:maintenance: start ${nowIso()}`)
  if (incidentPath) console.log(`factory:maintenance: incident=${incidentPath}`)
  console.log(`factory:maintenance: root=${root}`)

  await spawnInherit("git", ["worktree", "prune"], root)
  await cleanOrphanWorktreeDirs(root)
  await spawnInherit("git", ["gc", "--prune=now"], root)

  console.log(`factory:maintenance: done ${nowIso()}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

