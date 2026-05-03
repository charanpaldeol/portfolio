import { spawn } from "node:child_process"
import path from "node:path"
import process from "node:process"

function parseBool(value: string | undefined) {
  const v = (value ?? "").trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes" || v === "on"
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

export async function resolveFactoryRepoRoot(startCwd: string) {
  const envRoot = (process.env.FACTORY_ROOT ?? "").trim()
  if (envRoot) return path.resolve(envRoot)

  const top = await spawnCapture("git", ["rev-parse", "--show-toplevel"], startCwd)
  if (top.code !== 0) throw new Error(`factory:preflight: failed to resolve repo root (git rev-parse exit ${top.code})`)
  return top.stdout.trim()
}

function mergeStrategyFromEnv() {
  const moneyMoving = parseBool(process.env.FACTORY_MONEY_MOVING_PROD)
  const mergeStrategy = (process.env.FACTORY_MERGE_STRATEGY ?? (moneyMoving ? "pr" : "direct")).trim().toLowerCase()
  return { moneyMoving, mergeStrategy }
}

function deployUrlForUat() {
  return (process.env.FACTORY_DEPLOY_SMOKE_URL ?? process.env.DEPLOY_URL ?? process.env.PLAYWRIGHT_PROD_BASE_URL ?? "")
    .trim()
    .replace(/\/+$/, "")
}

/**
 * Validates host environment before `factory:run-once` claims a queue item.
 * Set `FACTORY_SKIP_PREFLIGHT=1` only for local debugging.
 */
export async function assertFactoryPreflight(repoRoot: string): Promise<void> {
  if (parseBool(process.env.FACTORY_SKIP_PREFLIGHT)) {
    console.warn("factory:preflight: skipped (FACTORY_SKIP_PREFLIGHT=1)")
    return
  }

  const inside = await spawnCapture("git", ["rev-parse", "--is-inside-work-tree"], repoRoot)
  if (inside.code !== 0 || inside.stdout.trim() !== "true") {
    throw new Error("factory:preflight: not a git work tree (git rev-parse --is-inside-work-tree)")
  }

  const remote = await spawnCapture("git", ["remote", "get-url", "origin"], repoRoot)
  if (remote.code !== 0 || !remote.stdout.trim()) {
    throw new Error("factory:preflight: git remote `origin` is missing or has no URL")
  }

  const { moneyMoving, mergeStrategy } = mergeStrategyFromEnv()

  if (moneyMoving && mergeStrategy === "direct" && !parseBool(process.env.FACTORY_I_ACCEPT_DIRECT_MERGE_RISK)) {
    throw new Error(
      "factory:preflight: FACTORY_MONEY_MOVING_PROD=1 with FACTORY_MERGE_STRATEGY=direct is disallowed unless FACTORY_I_ACCEPT_DIRECT_MERGE_RISK=1 (see docs/factory/FACTORY_MERGE_POLICY.md)",
    )
  }

  if (mergeStrategy === "pr") {
    const ghWhich = await spawnCapture("bash", ["-lc", "command -v gh >/dev/null"], repoRoot)
    if (ghWhich.code !== 0) {
      throw new Error("factory:preflight: FACTORY_MERGE_STRATEGY=pr requires GitHub CLI (`gh`) on PATH")
    }
    const auth = await spawnCapture("gh", ["auth", "status"], repoRoot)
    if (auth.code !== 0) {
      throw new Error(
        `factory:preflight: gh is not authenticated for this environment (exit ${auth.code}). Run: gh auth login\n${auth.stderr || auth.stdout}`.trim(),
      )
    }
  }

  if (parseBool(process.env.FACTORY_POST_MERGE_UAT)) {
    if (!deployUrlForUat()) {
      throw new Error(
        "factory:preflight: FACTORY_POST_MERGE_UAT=1 requires FACTORY_DEPLOY_SMOKE_URL, DEPLOY_URL, or PLAYWRIGHT_PROD_BASE_URL (deploy smoke / prod Playwright)",
      )
    }
  }

  console.log("factory:preflight: ok (git origin, merge strategy env, optional gh / deploy URL checks)")
}
