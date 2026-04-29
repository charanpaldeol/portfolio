import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

export const metadata: Metadata = {
  title: "EvidencePack App",
  description: "EvidencePack pilot workspace.",
  alternates: { canonical: "https://cpdeol.com/evidencepack/app" },
}

export default async function EvidencePackAppPage() {
  const cookieJar = await cookies()
  const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
  const session = token ? verifyEvidencePackToken(token) : null

  if (!session) {
    return (
      <PageShell>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <div className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
            <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface md:text-4xl">EvidencePack</h1>
            <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
              This area is for pilot users only.
            </p>
            <div className="mt-6">
              <Link
                href="/evidencepack/login"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial hover:brightness-[1.02]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Pilot workspace</p>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">EvidencePack</h1>
          <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
            Signed in as <span className="font-semibold text-on-surface">{session.email}</span>.
          </p>
        </header>

        <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
          <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Next</h2>
          <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">
            Upload docs and import a questionnaire. Drafting + exports will appear here as we roll out the pilot.
          </p>
        </section>
      </div>
    </PageShell>
  )
}

