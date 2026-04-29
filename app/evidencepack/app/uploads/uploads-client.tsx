"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type UploadState =
  | { type: "idle" }
  | { type: "uploading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string }

type CsvPreview = {
  headers: string[]
  rows: string[][]
}

function getStringField(payload: unknown, key: string): string | null {
  if (typeof payload !== "object" || payload === null) return null
  const record = payload as Record<string, unknown>
  const value = record[key]
  return typeof value === "string" ? value : null
}

function parseCsvLine(line: string) {
  const out: string[] = []
  let cur = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === "\"") {
      const next = line[i + 1]
      if (inQuotes && next === "\"") {
        cur += "\""
        i += 1
        continue
      }
      inQuotes = !inQuotes
      continue
    }

    if (ch === "," && !inQuotes) {
      out.push(cur)
      cur = ""
      continue
    }

    cur += ch
  }

  out.push(cur)
  return out.map((v) => v.trim())
}

async function previewCsv(file: File): Promise<CsvPreview> {
  const text = await file.text()
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "")
  const headerLine = lines[0] ?? ""
  const headers = parseCsvLine(headerLine)
  const rows = lines.slice(1, 51).map((line) => parseCsvLine(line))
  return { headers, rows }
}

async function upload(kind: "doc" | "questionnaire", file: File) {
  const form = new FormData()
  form.set("file", file)

  const res = await fetch(`/api/evidencepack/files/upload?kind=${kind}`, {
    method: "POST",
    body: form,
  })

  const json: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(getStringField(json, "error") ?? "Upload failed")
  }
  return json
}

export function EvidencePackUploadsClient() {
  const [docFile, setDocFile] = useState<File | null>(null)
  const [qFile, setQFile] = useState<File | null>(null)
  const [qPreview, setQPreview] = useState<CsvPreview | null>(null)
  const [qTitle, setQTitle] = useState("")
  const [state, setState] = useState<UploadState>({ type: "idle" })

  const helperText = useMemo(() => {
    if (state.type === "success") return state.message
    if (state.type === "error") return state.message
    return "PDFs for docs; CSV for questionnaires (pilot)."
  }, [state])

  const disabled = state.type === "uploading"

  async function onUploadDocs() {
    if (!docFile || disabled) return
    setState({ type: "uploading" })
    try {
      await upload("doc", docFile)
      setState({ type: "success", message: "Doc uploaded." })
      setDocFile(null)
    } catch (e) {
      setState({ type: "error", message: e instanceof Error ? e.message : "Upload failed" })
    }
  }

  async function onUploadQuestionnaire() {
    if (!qFile || disabled) return
    setState({ type: "uploading" })
    try {
      await upload("questionnaire", qFile)
      const preview = await previewCsv(qFile)
      setQPreview(preview)
      setQTitle((prev) => (prev.trim() ? prev : qFile.name.replace(/\.csv$/i, "").slice(0, 120)))
      setState({ type: "success", message: "Questionnaire uploaded. Preview below." })
      setQFile(null)
    } catch (e) {
      setState({ type: "error", message: e instanceof Error ? e.message : "Upload failed" })
    }
  }

  async function onSaveQuestionnaire() {
    if (!qPreview || disabled) return
    const title = qTitle.trim()
    if (!title) {
      setState({ type: "error", message: "Add a title to save this questionnaire." })
      return
    }

    setState({ type: "uploading" })
    try {
      const res = await fetch("/api/evidencepack/questionnaires/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, headers: qPreview.headers, rows: qPreview.rows }),
      })
      const json: unknown = await res.json().catch(() => null)
      if (!res.ok) throw new Error(getStringField(json, "error") ?? "Could not save")
      setState({ type: "success", message: "Saved. View it in Questionnaires." })
    } catch (e) {
      setState({ type: "error", message: e instanceof Error ? e.message : "Could not save" })
    }
  }

  return (
    <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Uploads">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-surface p-6 shadow-editorial ring-1 ring-outline-variant/15">
          <h2 className="font-sans text-base font-semibold text-on-surface">Security docs</h2>
          <p className="mt-2 font-sans text-sm leading-[1.7] text-on-surface-variant">SOC 2, policies, pen test letter, IR plan, etc.</p>
          <div className="mt-5 flex flex-col gap-3">
            <input
              type="file"
              accept="application/pdf"
              disabled={disabled}
              onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
              className={cn("font-sans text-sm", disabled && "opacity-60")}
            />
            <button
              type="button"
              onClick={onUploadDocs}
              disabled={disabled || !docFile}
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial",
                "hover:brightness-[1.02] disabled:opacity-60"
              )}
            >
              {state.type === "uploading" ? "Uploading…" : "Upload doc"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-6 shadow-editorial ring-1 ring-outline-variant/15">
          <h2 className="font-sans text-base font-semibold text-on-surface">Questionnaire</h2>
          <p className="mt-2 font-sans text-sm leading-[1.7] text-on-surface-variant">SIG Lite / CAIQ / RFP as CSV (pilot format).</p>
          <div className="mt-5 flex flex-col gap-3">
            <input
              type="file"
              accept=".csv,text/csv"
              disabled={disabled}
              onChange={(e) => {
                setQFile(e.target.files?.[0] ?? null)
                setQPreview(null)
                setQTitle("")
              }}
              className={cn("font-sans text-sm", disabled && "opacity-60")}
            />
            <button
              type="button"
              onClick={onUploadQuestionnaire}
              disabled={disabled || !qFile}
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial",
                "hover:brightness-[1.02] disabled:opacity-60"
              )}
            >
              {state.type === "uploading" ? "Uploading…" : "Upload questionnaire"}
            </button>
          </div>
        </div>
      </div>

      <p
        className={cn(
          "mt-5 font-sans text-xs font-normal leading-relaxed",
          state.type === "error" ? "text-destructive" : "text-on-surface-variant"
        )}
        aria-live="polite"
      >
        {helperText}
      </p>

      {qPreview ? (
        <div className="mt-8 overflow-hidden rounded-2xl bg-surface shadow-editorial ring-1 ring-outline-variant/15">
          <div className="bg-surface-container-low px-6 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="font-sans text-sm font-semibold text-on-surface">Questionnaire preview (first 50 rows)</h3>
              <button
                type="button"
                onClick={onSaveQuestionnaire}
                disabled={disabled || !qTitle.trim()}
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 font-sans text-xs font-semibold text-primary-foreground shadow-editorial",
                  "hover:brightness-[1.02] disabled:opacity-60"
                )}
              >
                {state.type === "uploading" ? "Saving…" : "Save questionnaire"}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-[1fr_14rem] md:items-end">
              <label className="flex min-w-0 flex-col gap-2">
                <span className="font-sans text-[0.7rem] font-semibold tracking-[0.15em] text-on-surface-variant uppercase">Title</span>
                <input
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  disabled={disabled}
                  className={cn(
                    "h-10 w-full rounded-xl bg-surface px-4 font-sans text-xs text-on-surface shadow-editorial outline-none",
                    "ring-1 ring-outline-variant/15 focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                  )}
                />
              </label>
              <div className="font-sans text-xs text-on-surface-variant md:text-right">Saved items appear in “View questionnaires”.</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left font-sans text-xs">
              <thead className="bg-surface-container-low">
                <tr>
                  {qPreview.headers.map((h, idx) => (
                    <th key={`${h}-${idx}`} className="whitespace-nowrap px-4 py-3 font-semibold text-on-surface">
                      {h || `Column ${idx + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {qPreview.rows.map((row, rIdx) => (
                  <tr key={rIdx} className={cn("text-on-surface-variant", rIdx % 2 === 0 ? "bg-surface" : "bg-surface-container-lowest/60")}>
                    {qPreview.headers.map((_, cIdx) => (
                      <td key={cIdx} className="max-w-[20rem] truncate px-4 py-3">
                        {row[cIdx] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  )
}

