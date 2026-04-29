"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type ApiItem = {
  id: number
  title: string
  created_at: string
}

type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "loaded"; items: ApiItem[] }
  | { type: "error"; message: string }

function getStringField(payload: unknown, key: string): string | null {
  if (typeof payload !== "object" || payload === null) return null
  const record = payload as Record<string, unknown>
  const value = record[key]
  return typeof value === "string" ? value : null
}

function getArrayField(payload: unknown, key: string): unknown[] | null {
  if (typeof payload !== "object" || payload === null) return null
  const record = payload as Record<string, unknown>
  const value = record[key]
  return Array.isArray(value) ? value : null
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

export function EvidencePackQuestionnairesClient() {
  const [state, setState] = useState<State>({ type: "idle" })

  const helperText = useMemo(() => {
    if (state.type === "error") return state.message
    if (state.type === "loaded" && state.items.length === 0) return "No questionnaires saved yet."
    return "Uploads → Upload questionnaire → Save to DB (coming next)."
  }, [state])

  useEffect(() => {
    let alive = true
    const run = async () => {
      setState({ type: "loading" })
      try {
        const res = await fetch("/api/evidencepack/questionnaires/list")
        const json: unknown = await res.json().catch(() => null)
        if (!res.ok) throw new Error(getStringField(json, "error") ?? "Failed to load")
        const items = getArrayField(json, "items") ?? []
        if (!Array.isArray(items)) throw new Error("Invalid response")
        if (!alive) return
        setState({ type: "loaded", items: items as ApiItem[] })
      } catch (e) {
        if (!alive) return
        setState({ type: "error", message: e instanceof Error ? e.message : "Failed to load" })
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Questionnaires">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Saved questionnaires</h2>
          <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">{helperText}</p>
        </div>
        <Link
          href="/evidencepack/app/uploads"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial hover:brightness-[1.02]"
        >
          Upload more
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-editorial ring-1 ring-outline-variant/15">
        <div className="bg-surface-container-low px-6 py-4">
          <div className="grid grid-cols-[1fr_10rem_8rem] gap-4 font-sans text-xs font-semibold text-on-surface">
            <div>Title</div>
            <div>Created</div>
            <div className="text-right">Export</div>
          </div>
        </div>
        <div className="divide-y-0">
          {state.type === "loading" ? (
            <div className="px-6 py-5 font-sans text-sm text-on-surface-variant">Loading…</div>
          ) : state.type === "loaded" ? (
            state.items.length === 0 ? (
              <div className="px-6 py-5 font-sans text-sm text-on-surface-variant">No items yet.</div>
            ) : (
              <div className="flex flex-col">
                {state.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={cn(
                      "grid grid-cols-[1fr_10rem_8rem] gap-4 px-6 py-5 font-sans text-sm",
                      idx % 2 === 0 ? "bg-surface" : "bg-surface-container-lowest/60"
                    )}
                  >
                    <div className="min-w-0 truncate text-on-surface">{item.title}</div>
                    <div className="whitespace-nowrap text-on-surface-variant">{formatDate(item.created_at)}</div>
                    <div className="text-right">
                      <a
                        href={`/api/evidencepack/questionnaires/export?id=${item.id}`}
                        className="inline-flex h-9 items-center justify-center rounded-xl bg-surface px-3 font-sans text-xs font-semibold text-on-surface shadow-editorial ring-1 ring-outline-variant/15 hover:bg-surface-container-low"
                      >
                        CSV
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="px-6 py-5 font-sans text-sm text-destructive">{state.type === "error" ? state.message : "Error"}</div>
          )}
        </div>
      </div>
    </section>
  )
}

