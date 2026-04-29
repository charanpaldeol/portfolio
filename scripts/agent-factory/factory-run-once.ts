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

async function runBash(args: { bashCommand: string; cwd?: string; env?: NodeJS.ProcessEnv; logPath: string }) {
  return await runCmd({
    cmd: "bash",
    argv: ["-lc", args.bashCommand],
    cwd: args.cwd,
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

async function ensureCleanWorktree(args: { branch: string; worktreePath: string; logPath: string }) {
  const { branch, worktreePath, logPath } = args

  // If a previous run crashed or was interrupted, the worktree path can remain.
  // Git then refuses to check out the same branch at the same path.
  await runCmd({ cmd: "git", argv: ["worktree", "remove", "--force", worktreePath], logPath })
  await rm(worktreePath, { recursive: true, force: true })
  await runCmd({ cmd: "git", argv: ["branch", "-D", branch], logPath })
}

async function main() {
  const root = process.cwd()
  const queuePath = path.join(root, "agents", "factory-queue.json")
  const runsPath = path.join(root, "agents", "factory-runs.json")
  const workerId = (process.env.FACTORY_WORKER_ID ?? "").trim() || `worker_${process.pid}`

  const nextItem = await claimNextItem({ queuePath, workerId })
  if (!nextItem) {
    console.log("factory: no queued items")
    return
  }

  const runId = `run_${randomUUID()}`
  const startedAt = nowIso()
  const branch = `agent/${nextItem.id.toLowerCase()}-${slugBranchTitle(nextItem.title) || "work"}`
  const worktreesDir = await ensureWorktreesDir(root)
  const worktreePath = path.join(worktreesDir, nextItem.id)
  const logPath = path.join(root, "agents", "factory-logs", `${runId}.${workerId}.log`)

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

  try {
    await ensureCleanWorktree({ branch, worktreePath, logPath })

    const addWorktree = await runCmd({ cmd: "git", argv: ["worktree", "add", "-B", branch, worktreePath], logPath })
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
        env: { ...process.env, FACTORY_ITEM_ID: nextItem.id, FACTORY_ROOT: root },
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

      const shaOut = await new Promise<string>((resolve, reject) => {
        const child = spawn("git", ["rev-parse", "HEAD"], { cwd: worktreePath, shell: false })
        let out = ""
        child.stdout?.on("data", (c) => (out += c.toString("utf8")))
        child.on("close", (code) => (code === 0 ? resolve(out.trim()) : reject(new Error("rev-parse failed"))))
      })
      commitSha = shaOut

      const push = await runCmd({ cmd: "git", argv: ["push", "-u", "origin", branch], cwd: worktreePath, logPath })
      if (push !== 0) throw new Error(`git push failed (exit ${push})`)
    } else {
      console.log("factory: no changes detected; skipping commit/push")
    }

    finishedStatus = "succeeded"
  } catch (err) {
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

    await runCmd({ cmd: "git", argv: ["worktree", "remove", "--force", worktreePath], logPath })
    await rm(worktreePath, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

