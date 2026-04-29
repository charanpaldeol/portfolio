import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

import { EvidencePackWaitlistForm } from "./EvidencePackWaitlistForm"

export const metadata: Metadata = {
  title: "EvidencePack",
  description: "Generate cited security questionnaire answers and export an evidence pack.",
  alternates: { canonical: "https://cpdeol.com/evidencepack" },
  openGraph: {
    title: "EvidencePack — cpdeol.com",
    description: "Generate cited security questionnaire answers and export an evidence pack.",
    url: "https://cpdeol.com/evidencepack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EvidencePack — cpdeol.com",
    description: "Generate cited security questionnaire answers and export an evidence pack.",
  },
}

export default function EvidencePackPage() {
  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">New product</p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-on-surface md:text-5xl">EvidencePack</h1>
          <p className="mt-5 max-w-2xl font-sans text-base font-normal leading-[1.7] text-on-surface-variant md:text-lg md:leading-[1.75]">
            Upload your security docs, import a SIG / CAIQ / RFP spreadsheet, and generate draft answers with citations — then export a clean
            spreadsheet and a zipped evidence pack.
          </p>
        </header>

        <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Waitlist">
          <h2 className="font-sans text-xl font-semibold tracking-normal text-on-surface">Get pilot access</h2>
          <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">
            I’m onboarding a small set of design partners. Leave your email and I’ll follow up with next steps.
          </p>
          <div className="mt-6">
            <EvidencePackWaitlistForm />
          </div>
        </section>
      </div>
    </PageShell>
  )
}

