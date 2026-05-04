/**
 * factory-doctor — quick health check for autonomous workers (no side effects).
 */
import { existsSync } from "node:fs"
import path from "node:path"
import process from "node:process"

import { resolveStaleThresholdMs } from "@/lib/agent-factory/reclaim-thresholds"

async function spawnCapture(cmd: string, argv: string[], cwd: string) {
  const { spawn } = await import("node:child_process")
  return await new Promise<{ code: number; out: string }>((resolve) => {
    const child = spawn(cmd, argv, { cwd, shell: false })
    let out = ""
    child.stdout?.on("data", (c) => (out += c.toString("utf8")))
    child.stderr?.on("data", (c) => (out += c.toString("utf8")))
    child.on("close", (c) => resolve({ code: c ?? 1, out }))
  })
}

function warn(msg: string) {
  console.warn(`factory:doctor: WARN  ${msg}`)
}

function ok(msg: string) {
  console.log(`factory:doctor: OK    ${msg}`)
}

async function main() {
  const root = process.cwd()
  console.log(`factory:doctor: cwd=${root}`)

  const lockPath = path.join(root, "pnpm-lock.yaml")
  if (!existsSync(lockPath)) warn("pnpm-lock.yaml missing (worktree install will fail)")
  else ok("pnpm-lock.yaml present")

  const nodeV = await spawnCapture("node", ["-v"], root)
  console.log(`factory:doctor: node ${nodeV.out.trim() || "(unknown)"} (exit ${nodeV.code})`)

  const pnpmV = await spawnCapture("pnpm", ["-v"], root)
  console.log(`factory:doctor: pnpm ${pnpmV.out.trim() || "(unknown)"} (exit ${pnpmV.code})`)

  const gitTop = await spawnCapture("git", ["rev-parse", "--show-toplevel"], root)
  if (gitTop.code === 0) ok(`git root: ${gitTop.out.trim()}`)
  else warn("git rev-parse failed — not a git repo?")

  const implementBackend = (process.env.FACTORY_IMPLEMENT_BACKEND ?? "claude").trim()
  console.log(`factory:doctor: FACTORY_IMPLEMENT_BACKEND=${implementBackend || "claude"}`)

  const implementOnMain = (process.env.FACTORY_IMPLEMENT_ON_MAIN ?? "").trim()
  console.log(`factory:doctor: FACTORY_IMPLEMENT_ON_MAIN=${implementOnMain || "(unset)"}`)

  const claudeBin = (process.env.FACTORY_CLAUDE_BIN ?? "claude").trim()
  console.log(`factory:doctor: FACTORY_CLAUDE_BIN=${claudeBin}`)

  if (claudeBin.includes("aider-bridge")) {
    if (!(process.env.GEMINI_API_KEY ?? "").trim() && !(process.env.GROQ_API_KEY ?? "").trim())
      warn("aider-bridge: set GEMINI_API_KEY and/or GROQ_API_KEY for chosen AIDER_MODEL")
    else ok("aider: at least one of GEMINI_API_KEY / GROQ_API_KEY set")
  }

  const staleRun = resolveStaleThresholdMs({
    envValue: process.env.FACTORY_STALE_RUN_MS,
    fallbackMs: 60 * 60 * 1000,
    minMs: 5 * 60 * 1000,
  })
  const staleClaim = resolveStaleThresholdMs({
    envValue: process.env.FACTORY_STALE_CLAIM_MS,
    fallbackMs: 15 * 60 * 1000,
    minMs: 2 * 60 * 1000,
  })
  console.log(
    `factory:doctor: reclaim thresholds — FACTORY_STALE_RUN_MS effective≈${Math.round(staleRun / 1000)}s, FACTORY_STALE_CLAIM_MS effective≈${Math.round(staleClaim / 1000)}s`,
  )

  const installRetries = (process.env.FACTORY_INSTALL_RETRIES ?? "2").trim()
  console.log(`factory:doctor: FACTORY_INSTALL_RETRIES=${installRetries} (retry with plain pnpm install if FACTORY_INSTALL_RETRY_NO_OFFLINE=1)`)

  console.log("factory:doctor: docs: docs/factory/FACTORY_OPERATIONS.md · meaningful paths: docs/factory/FACTORY_MEANINGFUL_WORK.md")
}

main().catch((e) => {
  console.error("factory:doctor failed:", e)
  process.exitCode = 1
})
