"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type InviteRow = {
  id: number
  invited_email: string
  note: string | null
  created_at: string
}

type State =
  | { type: "idle"; items: InviteRow[] }
  | { type: "loading"; items: InviteRow[] }
  | { type: "error"; message: string; items: InviteRow[] }

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

export function EvidencePackInvitesAdminClient() {
  const [state, setState] = useState<State>({ type: "idle", items: [] })
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")

  const helperText = useMemo(() => {
    if (state.type === "error") return state.message
    if (state.type === "loading") return "Refreshing…"
    return "Changes apply immediately."
  }, [state.type, state])

  const refresh = useCallback(async () => {
    setState((s) => ({ type: "loading", items: s.items }))
    try {
      const res = await fetch("/api/evidencepack/admin/invites", { cache: "no-store" })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Failed to load invites")
      if (typeof json !== "object" || json === null) throw new Error("Invalid response")
      const record = json as Record<string, unknown>
      const items = record["items"]
      if (!Array.isArray(items)) throw new Error("Invalid response")
      setState({ type: "idle", items: items as InviteRow[] })
    } catch (e) {
      setState((s) => ({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to load invites",
        items: s.items,
      }))
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addInvite() {
    const emailTrimmed = email.trim()
    if (!emailTrimmed) return

    setState((s) => ({ type: "loading", items: s.items }))
    try {
      const res = await fetch("/api/evidencepack/admin/invites", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: emailTrimmed, note: note.trim() ? note.trim() : undefined }),
      })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not add invite")
      setEmail("")
      setNote("")
      await refresh()
    } catch (e) {
      setState((s) => ({
        type: "error",
        message: e instanceof Error ? e.message : "Could not add invite",
        items: s.items,
      }))
    }
  }

  async function removeInvite(id: number) {
    setState((s) => ({ type: "loading", items: s.items }))
    try {
      const res = await fetch("/api/evidencepack/admin/invites/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not remove invite")
      await refresh()
    } catch (e) {
      setState((s) => ({
        type: "error",
        message: e instanceof Error ? e.message : "Could not remove invite",
        items: s.items,
      }))
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Add invite">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Add invite</h2>
            <p className={cn("mt-2 font-sans text-sm font-normal leading-[1.7]", state.type === "error" ? "text-destructive" : "text-on-surface-variant")}>
              {helperText}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              inputMode="email"
              className="h-11 w-full rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/25 sm:w-72"
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional)"
              className="h-11 w-full rounded-xl bg-surface px-4 font-sans text-sm text-on-surface shadow-editorial ring-1 ring-outline-variant/15 placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/25 sm:w-72"
            />
            <button
              type="button"
              onClick={addInvite}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial hover:brightness-[1.02]"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Current invites">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Current invites</h2>
            <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">Up to 200 most recent invites.</p>
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
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-outline-variant/15">
          <div className="bg-surface-container-low px-6 py-4">
            <div className="grid grid-cols-[1fr_1fr_10rem] gap-4 font-sans text-xs font-semibold text-on-surface">
              <div>Email</div>
              <div>Note</div>
              <div className="text-right">Actions</div>
            </div>
          </div>
          {state.items.length === 0 ? (
            <div className="bg-surface px-6 py-5 font-sans text-sm text-on-surface-variant">No invites yet.</div>
          ) : (
            <div className="flex flex-col">
              {state.items.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    "grid grid-cols-[1fr_1fr_10rem] gap-4 px-6 py-5 font-sans text-sm",
                    idx % 2 === 0 ? "bg-surface" : "bg-surface-container-lowest/60"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-on-surface">{item.invited_email}</p>
                    <p className="mt-1 font-mono text-xs text-on-surface-variant">added {formatDate(item.created_at)}</p>
                  </div>
                  <div className="min-w-0 text-on-surface-variant">{item.note ?? "—"}</div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => removeInvite(item.id)}
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-surface px-3 font-sans text-xs font-semibold text-on-surface shadow-editorial ring-1 ring-outline-variant/15 hover:bg-surface-container-low"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

