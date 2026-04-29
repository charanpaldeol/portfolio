import Link from "next/link"

export function UpgradeRequiredCard() {
  return (
    <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-10" aria-label="Upgrade required">
      <h2 className="font-sans text-lg font-semibold tracking-normal text-on-surface">Upgrade required</h2>
      <p className="mt-2 font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">
        This workspace requires an active subscription or a pilot invite.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/evidencepack/app/billing"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-sans text-sm font-semibold text-primary-foreground shadow-editorial hover:brightness-[1.02]"
        >
          Go to billing
        </Link>
        <Link
          href="/evidencepack/pricing"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-surface px-5 font-sans text-sm font-semibold text-on-surface shadow-editorial ring-1 ring-outline-variant/15 hover:bg-surface-container-low"
        >
          View pricing
        </Link>
      </div>
    </section>
  )
}

