import type { z } from "zod"

import { readFile, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

function nowIso() {
  return new Date().toISOString()
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type LockPayload = {
  pid: number
  created_at: string
  worker_id: string | null
}

async function tryAcquireLock(lockPath: string, payload: LockPayload) {
  const { open } = await import("node:fs/promises")
  try {
    const fh = await open(lockPath, "wx")
    await fh.writeFile(`${JSON.stringify(payload)}\n`, "utf8")
    return fh
  } catch (err) {
    const e = err as NodeJS.ErrnoException
    if (e.code === "EEXIST") return null
    throw err
  }
}

async function safeReadLock(lockPath: string): Promise<LockPayload | null> {
  try {
    const raw = await readFile(lockPath, "utf8")
    const parsed = JSON.parse(raw) as Partial<LockPayload>
    if (!parsed || typeof parsed !== "object") return null
    if (typeof parsed.pid !== "number") return null
    if (typeof parsed.created_at !== "string") return null
    const worker_id = typeof parsed.worker_id === "string" ? parsed.worker_id : null
    return { pid: parsed.pid, created_at: parsed.created_at, worker_id }
  } catch {
    return null
  }
}

async function breakStaleLock(lockPath: string, staleMs: number) {
  const payload = await safeReadLock(lockPath)
  if (!payload) return false
  const ageMs = Date.now() - new Date(payload.created_at).getTime()
  if (!Number.isFinite(ageMs) || ageMs < 0) return false
  if (ageMs < staleMs) return false
  await unlink(lockPath).catch(() => null)
  return true
}

export async function withFileLock<T>(args: {
  lockPath: string
  workerId?: string | null
  staleMs?: number
  maxWaitMs?: number
  fn: () => Promise<T>
}) {
  const staleMs = args.staleMs ?? 30_000
  const maxWaitMs = args.maxWaitMs ?? 15_000
  const payload: LockPayload = { pid: process.pid, created_at: nowIso(), worker_id: args.workerId ?? null }

  const started = Date.now()
  let backoffMs = 25
  while (Date.now() - started < maxWaitMs) {
    const fh = await tryAcquireLock(args.lockPath, payload)
    if (fh) {
      try {
        return await args.fn()
      } finally {
        await fh.close().catch(() => null)
        await unlink(args.lockPath).catch(() => null)
      }
    }

    await breakStaleLock(args.lockPath, staleMs)
    await sleep(backoffMs)
    backoffMs = Math.min(500, Math.floor(backoffMs * 1.6))
  }

  throw new Error(`Timed out acquiring lock: ${path.basename(args.lockPath)}`)
}

export async function readJsonFile<T>(filePath: string, schema: z.ZodType<T>): Promise<T> {
  const raw = await readFile(filePath, "utf8")
  return schema.parse(JSON.parse(raw))
}

export async function writeJsonFile(filePath: string, value: unknown) {
  const next = `${JSON.stringify(value, null, 2)}\n`
  await writeFile(filePath, next, "utf8")
}

