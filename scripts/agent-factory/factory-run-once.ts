import { spawn } from "node:child_process"
import { randomUUID } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import type { z } from "zod"

import {
  AgentFactoryQueueSchema,
  AgentFactoryRunsFileSchema,
  pickNextFactoryItem,
  type AgentFactoryQueue,
  type AgentFactoryQueueItem,
  type AgentFactoryRunsFile,
} from "@/lib/agent-factory/queue"

type SpecCommand = {
  command?: unknown
}

function nowIso() {
  return new Date().toISOString()
}

async function runCmd(args: {
  cmd: string
  cwd?: string
  env?: NodeJS.ProcessEnv
  logPath: string
}) {
  const { cmd, cwd, env, logPath } = args
  await mkdir(path.dirname(logPath), { recursive: true })

  return await new Promise<number>((resolve) => {
    const child = spawn(cmd, { cwd, env, shell: true })
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

async function readJsonFile<T>(filePath: string, schema: z.ZodType<T>): Promise<T> {
  const raw = await readFile(filePath, "utf8")
  return schema.parse(JSON.parse(raw))
}

async function writeJsonFile(filePath: string, value: unknown) {
  const next = `${JSON.stringify(value, null, 2)}\n`
  await writeFile(filePath, next, "utf8")
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
    if (item.id !== itemId) return item
    return { ...item, ...patch, updated_at: nowIso() }
  })
  return { ...queue, items: nextItems } satisfies AgentFactoryQueue
}

async function ensureWorktreesDir(root: string) {
  const dir = path.join(root, ".agent-worktrees")
  await mkdir(dir, { recursive: true })
  return dir
}

async function main() {
  const root = process.cwd()
  const queuePath = path.join(root, "agents", "factory-queue.json")
  const runsPath = path.join(root, "agents", "factory-runs.json")

  const queue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
  const nextItem = pickNextFactoryItem(queue.items)
  if (!nextItem) {
    console.log("factory: no queued items")
    return
  }

  const runId = `run_${randomUUID()}`
  const startedAt = nowIso()
  const branch = `agent/${nextItem.id.toLowerCase()}-${slugBranchTitle(nextItem.title) || "work"}`
  const worktreesDir = await ensureWorktreesDir(root)
  const worktreePath = path.join(worktreesDir, nextItem.id)
  const logPath = path.join(root, "agents", "factory-logs", `${runId}.log`)

  const claimedQueue = markItem(queue, nextItem.id, { status: "in_progress" })
  await writeJsonFile(queuePath, claimedQueue)

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
        status: "started",
        started_at: startedAt,
        finished_at: null,
        commit_sha: null,
        error: null,
      },
      ...runsFile.runs,
    ],
  }
  await writeJsonFile(runsPath, nextRuns)

  let finishedStatus: "succeeded" | "failed" = "failed"
  let finishedError: string | null = null
  let commitSha: string | null = null

  try {
    const addWorktree = await runCmd({
      cmd: `git worktree add -B "${branch}" "${worktreePath}"`,
      logPath,
    })
    if (addWorktree !== 0) throw new Error(`git worktree add failed (exit ${addWorktree})`)

    const maybeCommand = extractCommand(nextItem.spec)
    if (maybeCommand) {
      const cmdExit = await runCmd({
        cmd: `bash -lc ${JSON.stringify(maybeCommand)}`,
        cwd: worktreePath,
        env: { ...process.env, FACTORY_ITEM_ID: nextItem.id },
        logPath,
      })
      if (cmdExit !== 0) throw new Error(`spec.command failed (exit ${cmdExit})`)
    } else {
      console.log("factory: no spec.command provided; skipping task execution")
    }

    const tsc = await runCmd({ cmd: "pnpm -s tsc", cwd: worktreePath, logPath })
    if (tsc !== 0) throw new Error(`pnpm tsc failed (exit ${tsc})`)

    const lint = await runCmd({ cmd: "pnpm -s lint", cwd: worktreePath, logPath })
    if (lint !== 0) throw new Error(`pnpm lint failed (exit ${lint})`)

    const build = await runCmd({ cmd: "pnpm -s build", cwd: worktreePath, logPath })
    if (build !== 0) throw new Error(`pnpm build failed (exit ${build})`)

    const hasChanges = await runCmd({ cmd: 'test -n "$(git status --porcelain)"', cwd: worktreePath, logPath })
    if (hasChanges === 0) {
      await runCmd({ cmd: "git add -A", cwd: worktreePath, logPath })
      const commit = await runCmd({
        cmd: `git commit -m ${JSON.stringify(`chore(factory): ${nextItem.id} ${nextItem.title}`)}`,
        cwd: worktreePath,
        logPath,
      })
      if (commit !== 0) throw new Error(`git commit failed (exit ${commit})`)

      const shaOut = await new Promise<string>((resolve, reject) => {
        const child = spawn("git rev-parse HEAD", { cwd: worktreePath, shell: true })
        let out = ""
        child.stdout?.on("data", (c) => (out += c.toString("utf8")))
        child.on("close", (code) => (code === 0 ? resolve(out.trim()) : reject(new Error("rev-parse failed"))))
      })
      commitSha = shaOut

      const push = await runCmd({ cmd: `git push -u origin "${branch}"`, cwd: worktreePath, logPath })
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

    const updatedRunsFile = await readJsonFile(runsPath, AgentFactoryRunsFileSchema)
    const updatedRuns: AgentFactoryRunsFile = {
      ...updatedRunsFile,
      runs: updatedRunsFile.runs.map((run: AgentFactoryRunsFile["runs"][number]) => {
        if (run.run_id !== runId) return run
        return {
          ...run,
          status: finishedStatus,
          finished_at: finishedAt,
          commit_sha: commitSha,
          error: finishedError,
        }
      }),
    }
    await writeJsonFile(runsPath, updatedRuns)

    const finalQueue = await readJsonFile(queuePath, AgentFactoryQueueSchema)
    const statusForItem: AgentFactoryQueueItem["status"] = finishedStatus === "succeeded" ? "done" : "failed"
    await writeJsonFile(queuePath, markItem(finalQueue, nextItem.id, { status: statusForItem }))
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

