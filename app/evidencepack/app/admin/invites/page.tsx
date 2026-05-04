import type { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"
import { requireEvidencePackFactorySession } from "@/lib/evidencepack-factory-auth"

import { EvidencePackInvitesAdminClient } from "./invites-admin-client"

export const metadata: Metadata = {
  title: "EvidencePack Invites",
  alternates: { canonical: "https://cpdeol.com/evidencepack/app/admin/invites" },
}

export default async function EvidencePackInvitesAdminPage() {
  const auth = await requireEvidencePackFactorySession()

  if (!auth.ok) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10">
            <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Sign in required</h1>
            <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
              This area is available to pilot users only.
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
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Admin</p>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Invites</h1>
          <p className="mt-4 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant md:text-base md:leading-[1.75]">
            Manage pilot access by adding or removing invited emails.
          </p>
        </header>

        <EvidencePackInvitesAdminClient />
      </div>
    </PageShell>
  )
}

