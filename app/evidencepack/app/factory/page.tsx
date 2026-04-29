import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"
import { readFactoryQueueFile, readFactoryRunsFile } from "@/lib/agent-factory/mutate"
import { getEvidencePackAccess } from "@/lib/evidencepack-access"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

import { EvidencePackFactoryClient } from "./factory-client"
import { UpgradeRequiredCard } from "../UpgradeRequiredCard"

export const metadata: Metadata = {
  title: "EvidencePack Factory",
  alternates: { canonical: "https://cpdeol.com/evidencepack/app/factory" },
}

export default async function EvidencePackFactoryPage() {
  const cookieJar = await cookies()
  const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
  const session = token ? verifyEvidencePackToken(token) : null

  if (!session) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
            <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Sign in required</h1>
            <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
              Factory access is available to pilot users only.
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

  const access = await getEvidencePackAccess(session.email)
  const allowed = access.invited || access.subscribed

  if (!allowed) {
    return (
      <PageShell>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
          <header className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Pilot workspace</p>
            <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Factory</h1>
            <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
              Signed in as <span className="font-semibold text-on-surface">{session.email}</span>.
            </p>
          </header>

          <UpgradeRequiredCard />
        </div>
      </PageShell>
    )
  }

  const [queue, runs] = await Promise.all([readFactoryQueueFile(), readFactoryRunsFile()])

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Pilot workspace</p>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Factory</h1>
          <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
            Signed in as <span className="font-semibold text-on-surface">{session.email}</span>.
          </p>
        </header>

        <EvidencePackFactoryClient initialQueue={queue} initialRuns={runs} initialWorkers={[]} />
      </div>
    </PageShell>
  )
}

