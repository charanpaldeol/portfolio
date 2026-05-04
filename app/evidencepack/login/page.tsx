import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

import { EvidencePackLoginForm } from "./EvidencePackLoginForm"

export const metadata: Metadata = {
  title: "EvidencePack Login",
  description: "Request a magic link to access EvidencePack pilots.",
  alternates: { canonical: "https://cpdeol.com/evidencepack/login" },
}

export default function EvidencePackLoginPage() {
  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <header className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Pilot access</p>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Sign in to EvidencePack</h1>
          <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
            Enter your email and I’ll send you a magic link.
          </p>
        </header>

        <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Login">
          <EvidencePackLoginForm />
        </section>
      </div>
    </PageShell>
  )
}

