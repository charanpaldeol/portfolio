"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"

type UploadState =
  | { type: "idle" }
  | { type: "uploading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string }

function getStringField(payload: unknown, key: string): string | null {
  if (typeof payload !== "object" || payload === null) return null
  const record = payload as Record<string, unknown>
  const value = record[key]
  return typeof value === "string" ? value : null
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
      setState({ type: "success", message: "Questionnaire uploaded." })
      setQFile(null)
    } catch (e) {
      setState({ type: "error", message: e instanceof Error ? e.message : "Upload failed" })
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
              onChange={(e) => setQFile(e.target.files?.[0] ?? null)}
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
    </section>
  )
}

