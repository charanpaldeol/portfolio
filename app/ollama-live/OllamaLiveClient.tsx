"use client"

import { useCallback, useEffect, useState } from "react"

import { formatBytes } from "@/lib/ollama-monitor-data"

type RowTag = { name: string; size?: number; modified_at?: string }
type RowPs = {
  name: string
  model: string
  size?: number
  size_vram?: number
  context_length?: number
  expires_at?: string
}

type OkBody = {
  ok: true
  data: {
    fetchedAt: string
    origin: string
    version: string | null
    rootBody: string | null
    tags: RowTag[]
    ps: RowPs[]
  }
}

type ErrBody = { ok: false; error?: string }

export function OllamaLiveClient() {
  const [body, setBody] = useState<OkBody | ErrBody | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const tick = useCallback(async () => {
    try {
      const r = await fetch("/api/ollama-monitor", { cache: "no-store" })
      const j = (await r.json()) as OkBody | ErrBody
      if (!r.ok) {
        setErr(j && typeof j === "object" && "error" in j ? String(j.error) : `HTTP ${r.status}`)
        setBody(null)
        return
      }
      setErr(null)
      setBody(j as OkBody)
    } catch (e) {
      setErr(e instanceof Error ? e.message : "fetch failed")
      setBody(null)
    }
  }, [])

  useEffect(() => {
    void tick()
    const id = setInterval(() => void tick(), 2000)
    return () => clearInterval(id)
  }, [tick])

  if (err) {
    return (
      <p className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface">
        Could not load snapshot: {err}
      </p>
    )
  }

  if (!body?.ok) {
    return <p className="text-sm text-on-surface-variant">Loading…</p>
  }

  const { data } = body
  const diskTotal = data.tags.reduce((s, m) => s + (m.size ?? 0), 0)
  const vramTotal = data.ps.reduce((s, m) => s + (m.size_vram ?? m.size ?? 0), 0)

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-on-surface">Endpoint</h2>
        <p className="mt-2 font-mono text-sm text-primary">{data.origin}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-on-surface-variant">Ollama version</dt>
            <dd className="font-medium text-on-surface">{data.version ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Last refresh (UTC)</dt>
            <dd className="font-mono text-on-surface">{data.fetchedAt}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">GET / (health)</dt>
            <dd className="text-on-surface">{data.rootBody ?? "—"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-on-surface">Weights on disk (pull / install size)</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          From <span className="font-mono">/api/tags</span> — total stored model bytes, not live network throughput.
        </p>
        <p className="mt-3 text-sm font-medium text-on-surface">Sum: {formatBytes(diskTotal)}</p>
        <ul className="mt-4 space-y-2">
          {data.tags.length === 0 ? (
            <li className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
              No models in tags.
            </li>
          ) : (
            data.tags.map((m) => (
              <li
                key={m.name}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-surface-container-low px-4 py-3"
              >
                <span className="font-mono text-sm text-on-surface">{m.name}</span>
                <span className="text-sm tabular-nums text-on-surface-variant">
                  {formatBytes(m.size)}
                  {m.modified_at ? ` · modified ${m.modified_at}` : ""}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-on-surface">Loaded in VRAM (inference)</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          From <span className="font-mono">/api/ps</span> — memory resident for loaded models; refreshes while Ollama keeps them warm.
        </p>
        <p className="mt-3 text-sm font-medium text-on-surface">Sum (VRAM): {formatBytes(vramTotal)}</p>
        <ul className="mt-4 space-y-2">
          {data.ps.length === 0 ? (
            <li className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
              Nothing loaded right now.
            </li>
          ) : (
            data.ps.map((m) => (
              <li
                key={`${m.name}-${m.expires_at ?? ""}`}
                className="space-y-1 rounded-xl bg-surface-container-low px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-mono text-on-surface">{m.name}</span>
                  <span className="tabular-nums text-on-surface-variant">
                    VRAM {formatBytes(m.size_vram ?? m.size)} · ctx {m.context_length ?? "—"}
                  </span>
                </div>
                {m.expires_at ? (
                  <p className="text-xs text-on-surface-variant">expires_at {m.expires_at}</p>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>

      <p className="text-xs text-on-surface-variant">
        Ollama does not expose per-request HTTP upload/download counters on this version. For Prometheus-style metrics,
        upgrade Ollama and check for a <span className="font-mono">/metrics</span> endpoint, or use OS-level tools
        (nettop, Activity Monitor) on the host running <span className="font-mono">127.0.0.1:11434</span>.
      </p>
    </div>
  )
}
