import type { z } from "zod"

import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { AgentFactoryQueueItemSchema, AgentFactoryQueueSchema, AgentFactoryRunSchema, AgentFactoryRunsFileSchema } from "@/lib/agent-factory/queue"

function repoPath(...parts: string[]) {
  return path.join(process.cwd(), ...parts)
}

function nowIso() {
  return new Date().toISOString()
}

function makeId(prefix: string) {
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${stamp}_${rand}`
}

export async function readFactoryQueueFile() {
  const raw = await readFile(repoPath("agents", "factory-queue.json"), "utf8")
  return AgentFactoryQueueSchema.parse(JSON.parse(raw))
}

export async function writeFactoryQueueFile(queue: unknown) {
  const parsed = AgentFactoryQueueSchema.parse(queue)
  await writeFile(repoPath("agents", "factory-queue.json"), `${JSON.stringify(parsed, null, 2)}\n`, "utf8")
  return parsed
}

export async function readFactoryRunsFile() {
  const raw = await readFile(repoPath("agents", "factory-runs.json"), "utf8")
  return AgentFactoryRunsFileSchema.parse(JSON.parse(raw))
}

export async function writeFactoryRunsFile(runs: unknown) {
  const parsed = AgentFactoryRunsFileSchema.parse(runs)
  await writeFile(repoPath("agents", "factory-runs.json"), `${JSON.stringify(parsed, null, 2)}\n`, "utf8")
  return parsed
}

export async function addFactoryTask(input: { title: string; spec?: unknown; priority: number }) {
  const queue = await readFactoryQueueFile()
  const ts = nowIso()
  const item = AgentFactoryQueueItemSchema.parse({
    id: makeId("task"),
    title: input.title,
    spec: input.spec ?? {},
    status: "queued",
    priority: input.priority,
    created_at: ts,
    updated_at: ts,
  })
  const next = { ...queue, items: [item, ...queue.items] }
  await writeFactoryQueueFile(next)
  return item
}

export async function setFactoryTaskStatus(input: { id: string; status: "queued" | "in_progress" | "blocked" | "done" | "failed" | "cancelled" }) {
  const queue = await readFactoryQueueFile()
  const idx = queue.items.findIndex((item) => item.id === input.id)
  if (idx === -1) return null
  const updated = { ...queue.items[idx], status: input.status, updated_at: nowIso() }
  const items = queue.items.slice()
  items[idx] = AgentFactoryQueueItemSchema.parse(updated)
  const next = { ...queue, items }
  await writeFactoryQueueFile(next)
  return items[idx]
}

type AgentFactoryRunInput = z.input<typeof AgentFactoryRunSchema>

export async function appendFactoryRun(input: Omit<AgentFactoryRunInput, "run_id">) {
  const runsFile = await readFactoryRunsFile()
  const run = AgentFactoryRunSchema.parse({
    run_id: makeId("run"),
    ...input,
  })
  const next = { ...runsFile, runs: [run, ...runsFile.runs].slice(0, 500) }
  await writeFactoryRunsFile(next)
  return run
}

