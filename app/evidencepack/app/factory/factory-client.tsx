"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type QueueItem = {
  id: string
  title: string
  status: "queued" | "in_progress" | "blocked" | "done" | "failed" | "cancelled"
  priority: number
  created_at: string
  updated_at: string
}

type QueueFile = {
  version: 1
  items: QueueItem[]
}

type RunItem = {
  run_id: string
  item_id: string
  title: string
  branch: string
  worktree_path: string
  status: "started" | "succeeded" | "failed"
  started_at: string
  finished_at: string | null
  commit_sha: string | null
  error: string | null
}

type RunsFile = {
  version: 1
  runs: RunItem[]
}

type State =
  | { type: "idle"; queue: QueueFile; runs: RunsFile }
  | { type: "loading"; queue: QueueFile; runs: RunsFile }
  | { type: "error"; message: string; queue: QueueFile; runs: RunsFile }

function getStringField(payload: unknown, key: string): string | null {
  if (typeof payload !== "object" || payload === null) return null
  const record = payload as Record<string, unknown>
  const value = record[key]
  return typeof value === "string" ? value : null
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

function groupCounts(items: QueueItem[]) {
  const counts = { queued: 0, in_progress: 0, done: 0 } as Record<"queued" | "in_progress" | "done", number>
  for (const item of items) {
    if (item.status === "queued") counts.queued += 1
    if (item.status === "in_progress") counts.in_progress += 1
    if (item.status === "done") counts.done += 1
  }
  return counts
}

export function EvidencePackFactoryClient({
  initialQueue,
  initialRuns,
}: {
  initialQueue: QueueFile
  initialRuns: RunsFile
}) {
  const [state, setState] = useState<State>({ type: "idle", queue: initialQueue, runs: initialRuns })
  const [newTitle, setNewTitle] = useState("")
  const [newPriority, setNewPriority] = useState(0)

  const [runItemId, setRunItemId] = useState("")
  const [runBranch, setRunBranch] = useState("")
  const [runWorktree, setRunWorktree] = useState("")
  const [runStatus, setRunStatus] = useState<RunItem["status"]>("started")
  const [runError, setRunError] = useState("")

  const counts = useMemo(() => groupCounts(state.queue.items), [state.queue.items])

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, type: "loading" }))
    try {
      const res = await fetch("/api/evidencepack/factory/state?limitRuns=25", { cache: "no-store" })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Failed to load")

      if (typeof json !== "object" || json === null) throw new Error("Invalid response")
      const record = json as Record<string, unknown>
      const queue = record["queue"]
      const runs = record["runs"]
      if (!queue || !runs) throw new Error("Invalid response")

      setState({ type: "idle", queue: queue as QueueFile, runs: runs as RunsFile })
    } catch (e) {
      setState((s) => ({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to load",
        queue: s.queue,
        runs: s.runs,
      }))
    }
  }, [])

  useEffect(() => {
    let alive = true
    const tick = async () => {
      if (!alive) return
      await refresh()
    }
    const id = window.setInterval(tick, 3000)
    tick()
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [refresh])

  async function addTask() {
    const title = newTitle.trim()
    if (!title) return
    try {
      const res = await fetch("/api/evidencepack/factory/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, priority: newPriority, spec: {} }),
      })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not add task")
      setNewTitle("")
      setNewPriority(0)
      await refresh()
    } catch (e) {
      setState((s) => ({
        type: "error",
        message: e instanceof Error ? e.message : "Could not add task",
        queue: s.queue,
        runs: s.runs,
      }))
    }
  }

  async function setStatus(id: string, status: QueueItem["status"]) {
    try {
      const res = await fetch(`/api/evidencepack/factory/tasks/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not update task")
      await refresh()
    } catch (e) {
      setState((s) => ({
        type: "error",
        message: e instanceof Error ? e.message : "Could not update task",
        queue: s.queue,
        runs: s.runs,
      }))
    }
  }

  async function appendRun() {
    const itemId = runItemId.trim()
    if (!itemId) return

    const itemTitle = (() => {
      const item = state.queue.items.find((q) => q.id === itemId)
      return item?.title ?? "Untitled"
    })()

    try {
      const res = await fetch("/api/evidencepack/factory/runs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          item_id: itemId,
          title: itemTitle,
          branch: runBranch.trim() || "main",
          worktree_path: runWorktree.trim() || ".",
          status: runStatus,
          error: runError.trim() ? runError.trim() : null,
        }),
      })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not append run")
      setRunError("")
      await refresh()
    } catch (e) {
      setState((s) => ({
        type: "error",
        message: e instanceof Error ? e.message : "Could not append run",
        queue: s.queue,
        runs: s.runs,
      }))
    }
  }

  const helperText = state.type === "error" ? state.message : "Live-refreshing every ~3s."

  const itemsSorted = useMemo(() => {
    return state.queue.items.slice().sort((a, b) => {
      if (a.status !== b.status) return a.status.localeCompare(b.status)
      if (b.priority !== a.priority) return b.priority - a.priority
      return b.updated_at.localeCompare(a.updated_at)
    })
  }, [state.queue.items])

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Factory dashboard">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Dashboard</h2>
            <p className={cn("mt-2 font-sans text-sm font-normal leading-[1.7]", state.type === "error" ? "text-destructive" : "text-on-surface-variant")}>
              {helperText}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refresh}
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-xl bg-surface px-4 font-sans text-sm font-semibold text-on-surface shadow-editorial",
                "ring-1 ring-outline-variant/15 hover:bg-surface-container-low"
              )}
            >
              Refresh now
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-surface p-5 shadow-editorial ring-1 ring-outline-variant/15">
            <p className="font-sans text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">Queued</p>
            <p className="mt-2 font-display text-3xl font-bold text-on-surface">{counts.queued}</p>
          </div>
          <div className="rounded-2xl bg-surface p-5 shadow-editorial ring-1 ring-outline-variant/15">
            <p className="font-sans text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">In progress</p>
            <p className="mt-2 font-display text-3xl font-bold text-on-surface">{counts.in_progress}</p>
          </div>
          <div className="rounded-2xl bg-surface p-5 shadow-editorial ring-1 ring-outline-variant/15">
            <p className="font-sans text-xs font-semibold tracking-[0.18em] text-on-surface-variant uppercase">Completed</p>
            <p className="mt-2 font-display text-3xl font-bold text-on-surface">{counts.done}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Queue">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Queue</h2>
            <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">
              Backed by <span className="font-semibold text-on-surface">agents/factory-queue.json</span>.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New task title"
              className="h-11 w-full rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/25 sm:w-72"
            />
            <input
              value={String(newPriority)}
              onChange={(e) => setNewPriority(Number(e.target.value) || 0)}
              inputMode="numeric"
              className="h-11 w-full rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 focus:outline-none focus:ring-2 focus:ring-primary/25 sm:w-24"
              aria-label="Priority"
            />
            <button
              type="button"
              onClick={addTask}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial hover:brightness-[1.02]"
            >
              Add task
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-outline-variant/15">
          <div className="bg-surface-container-low px-6 py-4">
            <div className="grid grid-cols-[1fr_7rem_10rem] gap-4 font-sans text-xs font-semibold text-on-surface">
              <div>Task</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
          </div>
          {itemsSorted.length === 0 ? (
            <div className="bg-surface px-6 py-5 font-sans text-sm text-on-surface-variant">No tasks yet.</div>
          ) : (
            <div className="flex flex-col">
              {itemsSorted.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    "grid grid-cols-[1fr_7rem_10rem] gap-4 px-6 py-5 font-sans text-sm",
                    idx % 2 === 0 ? "bg-surface" : "bg-surface-container-lowest/60"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-on-surface">
                      <span className="mr-2 font-mono text-xs font-medium text-on-surface-variant">{item.id}</span>
                      {item.title}
                    </p>
                    <p className="mt-1 font-mono text-xs text-on-surface-variant">
                      p{item.priority} • updated {formatDate(item.updated_at)}
                    </p>
                  </div>
                  <div className="whitespace-nowrap font-semibold text-on-surface-variant">{item.status.replaceAll("_", " ")}</div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus(item.id, "in_progress")}
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-surface px-3 font-sans text-xs font-semibold text-on-surface shadow-editorial ring-1 ring-outline-variant/15 hover:bg-surface-container-low"
                    >
                      In progress
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(item.id, "done")}
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-surface px-3 font-sans text-xs font-semibold text-on-surface shadow-editorial ring-1 ring-outline-variant/15 hover:bg-surface-container-low"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Latest runs">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Recent runs</h2>
            <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">
              Backed by <span className="font-semibold text-on-surface">agents/factory-runs.json</span>.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-outline-variant/15">
          <div className="bg-surface-container-low px-6 py-4">
            <div className="grid grid-cols-[1fr_12rem_8rem] gap-4 font-sans text-xs font-semibold text-on-surface">
              <div>Run</div>
              <div>Started</div>
              <div className="text-right">Status</div>
            </div>
          </div>
          {state.runs.runs.length === 0 ? (
            <div className="bg-surface px-6 py-5 font-sans text-sm text-on-surface-variant">No runs yet.</div>
          ) : (
            <div className="flex flex-col">
              {state.runs.runs.slice(0, 15).map((run, idx) => (
                <div
                  key={run.run_id}
                  className={cn(
                    "grid grid-cols-[1fr_12rem_8rem] gap-4 px-6 py-5 font-sans text-sm",
                    idx % 2 === 0 ? "bg-surface" : "bg-surface-container-lowest/60"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-on-surface">
                      <span className="mr-2 font-mono text-xs font-medium text-on-surface-variant">{run.item_id}</span>
                      {run.title}
                    </p>
                    <p className="mt-1 font-mono text-xs text-on-surface-variant">{run.branch}</p>
                  </div>
                  <div className="whitespace-nowrap font-mono text-xs text-on-surface-variant">{formatDate(run.started_at)}</div>
                  <div className="text-right font-semibold text-on-surface-variant">{run.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl bg-surface p-6 shadow-editorial ring-1 ring-outline-variant/15">
          <h3 className="font-sans text-sm font-semibold text-on-surface">Append run log entry</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={runItemId}
              onChange={(e) => setRunItemId(e.target.value)}
              placeholder="Task id"
              className="h-11 rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            <input
              value={runBranch}
              onChange={(e) => setRunBranch(e.target.value)}
              placeholder="Branch (default: main)"
              className="h-11 rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            <input
              value={runWorktree}
              onChange={(e) => setRunWorktree(e.target.value)}
              placeholder="Worktree path (default: .)"
              className="h-11 rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            <select
              value={runStatus}
              onChange={(e) => setRunStatus(e.target.value as RunItem["status"])}
              className="h-11 rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              <option value="started">started</option>
              <option value="succeeded">succeeded</option>
              <option value="failed">failed</option>
            </select>
            <input
              value={runError}
              onChange={(e) => setRunError(e.target.value)}
              placeholder="Error (optional)"
              className="h-11 rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/25 md:col-span-2"
            />
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={appendRun}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial hover:brightness-[1.02]"
            >
              Append run
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

