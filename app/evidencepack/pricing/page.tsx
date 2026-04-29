import type { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"

export const metadata: Metadata = {
  title: "EvidencePack Pricing",
  description: "Pricing for EvidencePack.",
  alternates: { canonical: "https://cpdeol.com/evidencepack/pricing" },
}

export default function EvidencePackPricingPage() {
  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">EvidencePack</p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-on-surface md:text-5xl">Pricing</h1>
          <p className="mt-5 max-w-2xl font-sans text-base font-normal leading-[1.7] text-on-surface-variant md:text-lg md:leading-[1.75]">
            Start with a subscription to generate cited questionnaire answers and export evidence packs.
          </p>
        </header>

        <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
          <div className="rounded-2xl bg-surface p-7 shadow-editorial ring-1 ring-outline-variant/15 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-sans text-lg font-semibold text-on-surface">Pilot plan</h2>
                <p className="mt-2 font-sans text-sm leading-[1.7] text-on-surface-variant">
                  Upload docs, import questionnaires, export deliverables. (Drafting + citations expanding next.)
                </p>
                <ul className="mt-5 space-y-2 font-sans text-sm text-on-surface-variant">
                  <li>- Docs + questionnaire uploads</li>
                  <li>- Questionnaire database + CSV export</li>
                  <li>- Hosted Stripe checkout</li>
                </ul>
              </div>
              <div className="shrink-0 text-left md:text-right">
                <div className="font-sans text-xs font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Starting at</div>
                <div className="text-display mt-2 text-4xl tracking-tight text-on-surface">$499</div>
                <div className="mt-1 font-sans text-xs text-on-surface-variant">per month</div>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/evidencepack/login"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial hover:brightness-[1.02]"
              >
                Start checkout
              </Link>
              <Link
                href="/evidencepack"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-surface px-5 font-sans text-sm font-semibold text-on-surface shadow-editorial ring-1 ring-outline-variant/15 hover:bg-surface-container-low"
              >
                Join waitlist
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}

