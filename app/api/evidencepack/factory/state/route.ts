import { z } from "zod"

import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

import { readFactoryQueueFile, readFactoryRunsFile } from "@/lib/agent-factory/mutate"
import { requireEvidencePackFactorySession } from "@/lib/evidencepack-factory-auth"

type WorkerHeartbeat = {
  worker_id: string
  pid: number
  status: "idle" | "running"
  run_id: string | null
  item_id: string | null
  updated_at: string
}

async function readHeartbeats(): Promise<WorkerHeartbeat[]> {
  const dir = path.join(process.cwd(), "agents", "factory-logs", "heartbeats")
  try {
    const files = await readdir(dir)
    const jsonFiles = files.filter((f) => f.endsWith(".json"))
    const items = await Promise.all(
      jsonFiles.map(async (f) => {
        try {
          const raw = await readFile(path.join(dir, f), "utf8")
          const parsed = JSON.parse(raw) as Partial<WorkerHeartbeat>
          if (!parsed || typeof parsed !== "object") return null
          if (typeof parsed.worker_id !== "string" || !parsed.worker_id) return null
          if (typeof parsed.pid !== "number") return null
          if (parsed.status !== "idle" && parsed.status !== "running") return null
          if (typeof parsed.updated_at !== "string") return null
          const run_id = typeof parsed.run_id === "string" ? parsed.run_id : null
          const item_id = typeof parsed.item_id === "string" ? parsed.item_id : null
          return { worker_id: parsed.worker_id, pid: parsed.pid, status: parsed.status, run_id, item_id, updated_at: parsed.updated_at }
        } catch {
          return null
        }
      })
    )
    return items.filter((x): x is WorkerHeartbeat => Boolean(x)).sort((a, b) => a.worker_id.localeCompare(b.worker_id))
  } catch {
    return []
  }
}

export async function GET(request: Request) {
  try {
    const auth = await requireEvidencePackFactorySession()
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const url = new URL(request.url)
    const parsed = z
      .object({
        limitRuns: z.coerce.number().int().min(1).max(50).default(15),
      })
      .safeParse(Object.fromEntries(url.searchParams))

    const limitRuns = parsed.success ? parsed.data.limitRuns : 15

    const [queue, runs, workers] = await Promise.all([readFactoryQueueFile(), readFactoryRunsFile(), readHeartbeats()])
    return Response.json({
      queue,
      runs: { ...runs, runs: runs.runs.slice(0, limitRuns) },
      workers,
    })
  } catch (err) {
    console.error("EvidencePack factory state API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

