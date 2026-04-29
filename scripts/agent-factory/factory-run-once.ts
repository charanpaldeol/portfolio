import { spawn } from "node:child_process"
import { randomUUID } from "node:crypto"
import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import {
  AgentFactoryQueueSchema,
  AgentFactoryRunsFileSchema,
  pickNextFactoryItem,
  type AgentFactoryQueue,
  type AgentFactoryQueueItem,
  type AgentFactoryRunsFile,
} from "@/lib/agent-factory/queue"
import { readJsonFile, withFileLock, writeJsonFile } from "@/lib/agent-factory/storage"

type SpecCommand = {
  command?: unknown
}

function nowIso() {
  return new Date().toISOString()
}

function parseBool(value: string | undefined) {
  const v = (value ?? "").trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes" || v === "on"
}

function parseMs(value: string | undefined, fallbackMs: number) {
  const n = Number(value ?? "")
  return Number.isFinite(n) && n >= 0 ? n : fallbackMs
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
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

async function resolveRepoRoot(startCwd: string) {
  const envRoot = (process.env.FACTORY_ROOT ?? "").trim()
  if (envRoot) return envRoot

  const top = await spawnCapture("git", ["rev-parse", "--show-toplevel"], startCwd)
  if (top.code !== 0) throw new Error(`factory: failed to resolve repo root (git rev-parse exit ${top.code})`)
  return top.stdout.trim()
}

async function readGitOutput(args: { cwd: string; argv: string[] }) {
  const { cwd, argv } = args
  return await new Promise<string>((resolve, reject) => {
    const child = spawn("git", argv, { cwd, shell: false })
    let out = ""
    child.stdout?.on("data", (c) => (out += c.toString("utf8")))
    child.stderr?.on("data", (c) => (out += c.toString("utf8")))
    child.on("close", (code) => (code === 0 ? resolve(out.trim()) : reject(new Error(`git ${argv.join(" ")} failed`))))
  })
}

async function writeHeartbeat(args: {
  root: string
  workerId: string
  status: "idle" | "running"
  runId: string | null
  itemId: string | null
}) {
  const { root, workerId, status, runId, itemId } = args
  const heartbeatDir = path.join(root, "agents", "factory-logs", "heartbeats")
  await mkdir(heartbeatDir, { recursive: true })
  const heartbeatPath = path.join(heartbeatDir, `${workerId}.json`)
  const payload = {
    worker_id: workerId,
    pid: process.pid,
    status,
    run_id: runId,
    item_id: itemId,
    updated_at: nowIso(),
  }
  await writeFile(heartbeatPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
}

async function runCmd(args: {
  cmd: string
  argv: string[]
  cwd?: string
  env?: NodeJS.ProcessEnv
  logPath: string
}) {
  const { cmd, argv, cwd, env, logPath } = args
  await mkdir(path.dirname(logPath), { recursive: true })

  return await new Promise<number>((resolve) => {
    const child = spawn(cmd, argv, { cwd, env, shell: false })
    const prefix = cwd ? `[${cwd}] ` : ""

    const write = async (chunk: Buffer) => {
      const text = chunk.toString("utf8")
      process.stdout.write(text)
      await writeFile(logPath, `${prefix}${text}`, { flag: "a" })
    }

    child.stdout?.on("data", (chunk) => void write(chunk))
    child.stderr?.on("data", (chunk) => void write(chunk))
    child.on("close", (code) => resolve(code ?? 1))
  })
}

async function runBash(args: { bashCommand: string; cwd?: string; env?: NodeJS.ProcessEnv; logPath: string; fallbackCwd: string }) {
  return await runCmd({
    cmd: "bash",
    argv: ["-lc", args.bashCommand],
    cwd: args.cwd ?? args.fallbackCwd,
    env: args.env,
    logPath: args.logPath,
  })
}

function slugBranchTitle(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48)
}

function extractCommand(spec: unknown): string | null {
  if (typeof spec !== "object" || spec === null) return null
  const maybe = spec as SpecCommand
  if (typeof maybe.command !== "string") return null
  return maybe.command.trim() ? maybe.command.trim() : null
}

function markItem(queue: AgentFactoryQueue, itemId: string, patch: Partial<AgentFactoryQueueItem>) {
  const nextItems = queue.items.map((item: AgentFactoryQueueItem) => {
    const next = item.id !== itemId ? item : { ...item, ...patch, updated_at: nowIso() }
    return {
      ...next,
      claimed_by: typeof next.claimed_by === "string" ? next.claimed_by : null,
      claimed_at: typeof next.claimed_at === "string" ? next.claimed_at : null,
    }
  })
  return { ...queue, items: nextItems } satisfies AgentFactoryQueue
}

async function claimNextItem(args: { queuePath: string; workerId: string }) {
  return await withFileLock({
    lockPath: `${args.queuePath}.lock`,
    workerId: args.workerId,
    fn: async () => {
      const queue = await readJsonFile(args.queuePath, AgentFactoryQueueSchema)
      const candidates = queue.items.filter((it) => it.status === "queued" && it.claimed_by === null)
      const nextItem = pickNextFactoryItem(candidates)
      if (!nextItem) return null
      const claimedQueue = markItem(queue, nextItem.id, {
        status: "in_progress",
        claimed_by: args.workerId,
        claimed_at: nowIso(),
      })
      await writeJsonFile(args.queuePath, AgentFactoryQueueSchema.parse(claimedQueue))
      return nextItem
    },
  })
}

async function ensureWorktreesDir(root: string) {
  const dir = path.join(root, ".agent-worktrees")
  await mkdir(dir, { recursive: true })
  return dir
}

async function ensureCleanWorktree(args: { repoRoot: string; branch: string; worktreePath: string; logPath: string }) {
  const { repoRoot, branch, worktreePath, logPath } = args

  // If a previous run crashed or was interrupted, the worktree path can remain.
  // Git then refuses to check out the same branch at the same path.
  await runCmd({ cmd: "git", argv: ["worktree", "remove", "--force", worktreePath], cwd: repoRoot, logPath })
  try {
    await rm(worktreePath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
  } catch {
    await runBash({
      bashCommand: `rm -rf "${worktreePath.replaceAll('"', '\\"')}"`,
      fallbackCwd: repoRoot,
      logPath,
    })
  }
  await runCmd({ cmd: "git", argv: ["branch", "-D", branch], cwd: repoRoot, logPath })
}

async function ghAvailable(repoRoot: string) {
  const r = await spawnCapture("bash", ["-lc", "command -v gh >/dev/null"], repoRoot)
  return r.code === 0
}

async function waitForDeploySmoke(args: { repoRoot: string; deployUrl: string; logPath: string; timeoutMs: number; intervalMs: number }) {
  const deadline = Date.now() + args.timeoutMs
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const code = await runCmd({
      cmd: "pnpm",
      argv: ["-s", "deploy:smoke"],
      cwd: args.repoRoot,
      env: { ...process.env, DEPLOY_URL: args.deployUrl },
      logPath: args.logPath,
    })
    if (code === 0) return
    if (Date.now() >= deadline) throw new Error(`deploy smoke never became healthy within ${args.timeoutMs}ms`)
    await sleep(args.intervalMs)
  }
}

async function runPostMergeUat(args: { repoRoot: string; logPath: string }) {
  if (!parseBool(process.env.FACTORY_POST_MERGE_UAT)) return

  const deployUrl = (process.env.FACTORY_DEPLOY_SMOKE_URL ?? process.env.DEPLOY_URL ?? process.env.PLAYWRIGHT_PROD_BASE_URL ?? "")
    .trim()
    .replace(/\/+$/, "")
  if (!deployUrl) throw new Error("FACTORY_POST_MERGE_UAT=1 requires FACTORY_DEPLOY_SMOKE_URL/DEPLOY_URL/PLAYWRIGHT_PROD_BASE_URL")

  const waitTimeoutMs = parseMs(process.env.FACTORY_UAT_DEPLOY_WAIT_MS, 15 * 60 * 1000)
  const waitIntervalMs = parseMs(process.env.FACTORY_UAT_DEPLOY_POLL_MS, 10 * 1000)
  await waitForDeploySmoke({
    repoRoot: args.repoRoot,
    deployUrl,
    logPath: args.logPath,
    timeoutMs: waitTimeoutMs,
    intervalMs: waitIntervalMs,
  })

  const mode = (process.env.FACTORY_PROD_UAT_SUITE ?? "smoke").trim().toLowerCase()
  if (mode === "smoke" || mode === "smoke+proof" || mode === "all") {
    const code = await runCmd({
      cmd: "pnpm",
      argv: ["-s", "e2e:prod-smoke"],
      cwd: args.repoRoot,
      env: { ...process.env, PLAYWRIGHT_PROD_BASE_URL: deployUrl, DEPLOY_URL: deployUrl },
      logPath: args.logPath,
    })
    if (code !== 0) throw new Error(`prod UAT smoke failed (exit ${code})`)
  }

  if (mode === "proof" || mode === "smoke+proof" || mode === "all") {
    const code = await runCmd({
      cmd: "pnpm",
      argv: ["-s", "e2e:prod-proof"],
      cwd: args.repoRoot,
      env: { ...process.env, PLAYWRIGHT_PROD_BASE_URL: deployUrl, DEPLOY_URL: deployUrl, PLAN_ID: process.env.PLAN_ID ?? "prod" },
      logPath: args.logPath,
    })
    if (code !== 0) throw new Error(`prod UAT proof failed (exit ${code})`)
  }
}

async function mergeAndPushToMain(args: {
  repoRoot: string
  workerId: string
  branch: string
  worktreesDir: string
  logPath: string
  itemId: string
  itemTitle: string
}): Promise<{ mergedToMain: boolean }> {
  const { repoRoot, workerId, branch, worktreesDir, logPath, itemId, itemTitle } = args
  const lockPath = path.join(repoRoot, "agents", "factory-merge-main.lock")
  const mergeWorktreePath = path.join(worktreesDir, "__merge_main")
  const mergeBranch = "factory-main"

  return await withFileLock({
    lockPath,
    workerId,
    fn: async () => {
      let mergedToMain = false

      const fetchMainRoot = await runCmd({ cmd: "git", argv: ["fetch", "origin", "main"], cwd: repoRoot, logPath })
      if (fetchMainRoot !== 0) throw new Error(`git fetch origin main failed (exit ${fetchMainRoot})`)

      await ensureCleanWorktree({ repoRoot, branch: mergeBranch, worktreePath: mergeWorktreePath, logPath })

      const addWorktree = await runCmd({
        cmd: "git",
        argv: ["worktree", "add", "-B", mergeBranch, mergeWorktreePath, "origin/main"],
        cwd: repoRoot,
        logPath,
      })
      if (addWorktree !== 0) throw new Error(`git worktree add (merge) failed (exit ${addWorktree})`)

      const fetchBranch = await runCmd({ cmd: "git", argv: ["fetch", "origin", branch], cwd: mergeWorktreePath, logPath })
      if (fetchBranch !== 0) throw new Error(`git fetch origin ${branch} failed (exit ${fetchBranch})`)

      const merge = await runCmd({ cmd: "git", argv: ["merge", "--no-edit", "--no-ff", `origin/${branch}`], cwd: mergeWorktreePath, logPath })
      if (merge !== 0) {
        await runCmd({ cmd: "git", argv: ["merge", "--abort"], cwd: mergeWorktreePath, logPath })
        throw new Error(`git merge origin/${branch} into main failed (exit ${merge})`)
      }

      const moneyMoving = parseBool(process.env.FACTORY_MONEY_MOVING_PROD)
      const mergeStrategy = (process.env.FACTORY_MERGE_STRATEGY ?? (moneyMoving ? "pr" : "direct")).trim().toLowerCase()

      if (mergeStrategy === "direct") {
        const sha = await readGitOutput({ cwd: mergeWorktreePath, argv: ["rev-parse", "HEAD"] })
        const pushMain = await runCmd({ cmd: "git", argv: ["push", "origin", `${sha}:main`], cwd: mergeWorktreePath, logPath })
        if (pushMain !== 0) throw new Error(`git push origin main failed (exit ${pushMain})`)
        mergedToMain = true
      } else if (mergeStrategy === "pr") {
        if (!(await ghAvailable(repoRoot))) {
          throw new Error("FACTORY_MERGE_STRATEGY=pr requires GitHub CLI (`gh`) authenticated for this repo")
        }

        const automerge = parseBool(process.env.FACTORY_PR_AUTOMERGE)
        const waitForMerge = parseBool(process.env.FACTORY_PR_WAIT_FOR_MERGE)
        if (moneyMoving && !automerge && !waitForMerge) {
          throw new Error(
            "FACTORY_MONEY_MOVING_PROD=1 requires either FACTORY_PR_AUTOMERGE=1 or FACTORY_PR_WAIT_FOR_MERGE=1 (unsafe to finish without merging to main)",
          )
        }

        const pushBranch = await runCmd({ cmd: "git", argv: ["push", "-u", "origin", mergeBranch], cwd: mergeWorktreePath, logPath })
        if (pushBranch !== 0) throw new Error(`git push origin ${mergeBranch} failed (exit ${pushBranch})`)

        const prTitle = `factory: merge ${itemId} (${branch})`
        const prBody = `Automated factory merge proposal for queued item ${itemId}.\n\n- item: ${itemTitle}\n- agent branch: ${branch}\n`

        const create = await spawnCapture(
          "gh",
          ["pr", "create", "--base", "main", "--head", mergeBranch, "--title", prTitle, "--body", prBody, "--json", "number,url"],
          mergeWorktreePath,
        )
        if (create.code !== 0) {
          throw new Error(`gh pr create failed (exit ${create.code}): ${create.stderr || create.stdout}`.trim())
        }

        let prNumber: number | null = null
        let prUrl: string | null = null
        try {
          const parsed = JSON.parse(create.stdout) as unknown
          if (parsed && typeof parsed === "object") {
            const n = (parsed as { number?: unknown }).number
            const u = (parsed as { url?: unknown }).url
            prNumber = typeof n === "number" ? n : null
            prUrl = typeof u === "string" ? u : null
          }
        } catch {
          prNumber = null
          prUrl = null
        }
        if (!prNumber) throw new Error(`gh pr create returned unexpected JSON: ${create.stdout}`.trim())

        console.log(`factory: opened PR #${prNumber}${prUrl ? `: ${prUrl}` : ""}`)

        if (automerge) {
          const am = await spawnCapture("gh", ["pr", "merge", String(prNumber), "--merge", "--auto"], mergeWorktreePath)
          if (am.code !== 0) {
            throw new Error(`gh pr merge --auto failed (exit ${am.code}): ${am.stderr || am.stdout}`.trim())
          }
        }

        if (waitForMerge) {
          const timeoutMs = parseMs(process.env.FACTORY_PR_MERGE_TIMEOUT_MS, 60 * 60 * 1000)
          const pollMs = parseMs(process.env.FACTORY_PR_MERGE_POLL_MS, 15 * 1000)
          const deadline = Date.now() + timeoutMs

          // eslint-disable-next-line no-constant-condition
          while (true) {
            const view = await spawnCapture("gh", ["pr", "view", String(prNumber), "--json", "state,mergedAt,url"], mergeWorktreePath)
            if (view.code !== 0) throw new Error(`gh pr view failed (exit ${view.code}): ${view.stderr || view.stdout}`.trim())
            let parsed: unknown
            try {
              parsed = JSON.parse(view.stdout) as unknown
            } catch {
              throw new Error("gh pr view returned non-JSON output")
            }
            const state =
              parsed && typeof parsed === "object" && typeof (parsed as { state?: unknown }).state === "string"
                ? ((parsed as { state: string }).state || "").toUpperCase()
                : ""
            if (state === "MERGED") {
              mergedToMain = true
              break
            }
            if (Date.now() >= deadline) throw new Error(`timed out waiting for PR #${prNumber} to merge`)
            await sleep(pollMs)
          }
        }
      } else {
        throw new Error(`unknown FACTORY_MERGE_STRATEGY=${mergeStrategy} (expected direct|pr)`)
      }

      await runCmd({ cmd: "git", argv: ["worktree", "remove", "--force", mergeWorktreePath], cwd: repoRoot, logPath })
      await rm(mergeWorktreePath, { recursive: true, force: true })

      return { mergedToMain }
    },
  })
}

async function main() {
  const startCwd = process.cwd()
  const repoRoot = await resolveRepoRoot(startCwd)
  const queuePath = path.join(repoRoot, "agents", "factory-queue.json")
  const runsPath = path.join(repoRoot, "agents", "factory-runs.json")
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `worker_${process.pid}`

  const nextItem = await claimNextItem({ queuePath, workerId })
  if (!nextItem) {
    console.log("factory: no queued items")
    return
  }

  const runId = `run_${randomUUID()}`
  const startedAt = nowIso()
  const branch = `agent/${nextItem.id.toLowerCase()}-${slugBranchTitle(nextItem.title) || "work"}`
  const worktreesDir = await ensureWorktreesDir(repoRoot)
  const worktreePath = path.join(worktreesDir, nextItem.id)
  const logPath = path.join(repoRoot, "agents", "factory-logs", `${runId}.${workerId}.log`)

  await withFileLock({
    lockPath: `${runsPath}.lock`,
    workerId,
    fn: async () => {
      const runsFile = await readJsonFile(runsPath, AgentFactoryRunsFileSchema)
      const nextRuns: AgentFactoryRunsFile = {
        ...runsFile,
        runs: [
          {
            run_id: runId,
            item_id: nextItem.id,
            title: nextItem.title,
            branch,
            worktree_path: worktreePath,
            worker_id: workerId,
            status: "started",
            started_at: startedAt,
            finished_at: null,
            commit_sha: null,
            error: null,
          },
          ...runsFile.runs,
        ],
      }
      await writeJsonFile(runsPath, AgentFactoryRunsFileSchema.parse(nextRuns))
    },
  })

  let finishedStatus: "succeeded" | "failed" = "failed"
  let finishedError: string | null = null
  let commitSha: string | null = null
  let pushedBranch = false
  let mergedToMain = false

  try {
    await ensureCleanWorktree({ repoRoot, branch, worktreePath, logPath })

    const addWorktree = await runCmd({ cmd: "git", argv: ["worktree", "add", "-B", branch, worktreePath], cwd: repoRoot, logPath })
    if (addWorktree !== 0) throw new Error(`git worktree add failed (exit ${addWorktree})`)

    const install = await runCmd({
      cmd: "pnpm",
      argv: ["-s", "install", "--frozen-lockfile", "--prefer-offline"],
      cwd: worktreePath,
      logPath,
    })
    if (install !== 0) throw new Error(`pnpm install failed (exit ${install})`)

    const maybeCommand = extractCommand(nextItem.spec)
    if (maybeCommand) {
      const cmdExit = await runBash({
        bashCommand: maybeCommand,
        cwd: worktreePath,
        env: { ...process.env, FACTORY_ITEM_ID: nextItem.id, FACTORY_ROOT: repoRoot },
        fallbackCwd: repoRoot,
        logPath,
      })
      if (cmdExit !== 0) throw new Error(`spec.command failed (exit ${cmdExit})`)
    } else {
      console.log("factory: no spec.command provided; skipping task execution")
    }

    const tsc = await runCmd({ cmd: "pnpm", argv: ["-s", "tsc"], cwd: worktreePath, logPath })
    if (tsc !== 0) throw new Error(`pnpm tsc failed (exit ${tsc})`)

    const lint = await runCmd({ cmd: "pnpm", argv: ["-s", "lint"], cwd: worktreePath, logPath })
    if (lint !== 0) throw new Error(`pnpm lint failed (exit ${lint})`)

    const build = await runCmd({ cmd: "pnpm", argv: ["-s", "build"], cwd: worktreePath, logPath })
    if (build !== 0) throw new Error(`pnpm build failed (exit ${build})`)

    const statusOut = await new Promise<string>((resolve, reject) => {
      const child = spawn("git", ["status", "--porcelain"], { cwd: worktreePath, shell: false })
      let out = ""
      child.stdout?.on("data", (c) => (out += c.toString("utf8")))
      child.stderr?.on("data", (c) => (out += c.toString("utf8")))
      child.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error("git status failed"))))
    })

    const hasChanges = statusOut.trim().length > 0
    if (hasChanges) {
      await runCmd({ cmd: "git", argv: ["add", "-A"], cwd: worktreePath, logPath })
      const commit = await runCmd({
        cmd: "git",
        argv: ["commit", "-m", `chore(factory): ${nextItem.id} ${nextItem.title}`],
        cwd: worktreePath,
        logPath,
      })
      if (commit !== 0) throw new Error(`git commit failed (exit ${commit})`)

      commitSha = await readGitOutput({ cwd: worktreePath, argv: ["rev-parse", "HEAD"] })

      const push = await runCmd({ cmd: "git", argv: ["push", "-u", "origin", branch], cwd: worktreePath, logPath })
      if (push !== 0) throw new Error(`git push failed (exit ${push})`)
      pushedBranch = true

      const mergeResult = await mergeAndPushToMain({
        repoRoot,
        workerId,
        branch,
        worktreesDir,
        logPath,
        itemId: nextItem.id,
        itemTitle: nextItem.title,
      })
      mergedToMain = mergeResult.mergedToMain

      if (parseBool(process.env.FACTORY_POST_MERGE_UAT) && !mergedToMain) {
        console.warn("factory: skipping post-merge UAT because main was not updated (PR not merged yet)")
      } else {
        await runPostMergeUat({ repoRoot, logPath })
      }
    } else {
      console.log("factory: no changes detected; skipping commit/push")
    }

    finishedStatus = "succeeded"
  } catch (err) {
    if (pushedBranch) {
      console.error(`factory: branch '${branch}' was pushed but merge-to-main failed; manual intervention may be required`)
    }
    finishedError = err instanceof Error ? err.message : String(err)
    finishedStatus = "failed"
  } finally {
    const finishedAt = nowIso()
    const statusForItem: AgentFactoryQueueItem["status"] = finishedStatus === "succeeded" ? "done" : "failed"

    await withFileLock({
      lockPath: `${runsPath}.lock`,
      workerId,
      fn: async () => {
        const updatedRunsFile = await readJsonFile(runsPath, AgentFactoryRunsFileSchema)
        const updatedRuns: AgentFactoryRunsFile = {
          ...updatedRunsFile,
          runs: updatedRunsFile.runs.map((run: AgentFactoryRunsFile["runs"][number]) => {
            const worker_id = typeof run.worker_id === "string" ? run.worker_id : null
            if (run.run_id !== runId) return { ...run, worker_id }
            return {
              ...run,
              status: finishedStatus,
              finished_at: finishedAt,
              commit_sha: commitSha,
              error: finishedError,
              worker_id,
            }
          }),
        }
        await writeJsonFile(runsPath, AgentFactoryRunsFileSchema.parse(updatedRuns))
      },
    })

    await withFileLock({
      lockPath: `${queuePath}.lock`,
      workerId,
      fn: async () => {
        const finalQueue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
        await writeJsonFile(queuePath, AgentFactoryQueueSchema.parse(markItem(finalQueue, nextItem.id, { status: statusForItem })))
      },
    })

    await runCmd({ cmd: "git", argv: ["worktree", "remove", "--force", worktreePath], cwd: repoRoot, logPath })
    await rm(worktreePath, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

