import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageShell } from "@/components/layout/PageShell"
import { featureFlag } from "@/lib/feature-flags"

import { OllamaLiveClient } from "./OllamaLiveClient"

export const metadata: Metadata = {
  title: "Ollama live",
  description: "Live snapshot of local Ollama (models on disk and loaded in VRAM).",
  robots: { index: false, follow: false },
}

export default function OllamaLivePage() {
  if (!featureFlag("ollama-live-stats")) {
    notFound()
  }

  return (
    <PageShell>
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Local</p>
        <h1 className="mt-2 text-3xl font-semibold text-on-surface">Ollama live monitor</h1>
        <p className="mt-3 max-w-2xl text-base text-on-surface-variant">
          Polls your Ollama HTTP API (default <span className="font-mono text-on-surface">127.0.0.1:11434</span>) every
          few seconds. Enable with <span className="font-mono text-on-surface">FF_OLLAMA_LIVE_STATS=1</span>; optional{" "}
          <span className="font-mono text-on-surface">OLLAMA_MONITOR_ORIGIN</span> to point at another base URL.
        </p>
      </header>
      <OllamaLiveClient />
    </PageShell>
  )
}
