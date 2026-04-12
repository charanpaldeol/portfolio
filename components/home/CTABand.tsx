import Link from "next/link"

export default function CTABand() {
  return (
    <section className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-gradient-to-br from-primary/12 via-surface-container-low to-secondary/10 p-8 shadow-editorial">
      <div>
        <h2 className="mb-1 font-display text-lg font-bold text-foreground">Working on a hard problem?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          I work best with teams building real solutions — where the problem is messy, the stakes are real, and
          they need someone who can think, decide, and deliver. Not a fit for every engagement — but if the
          challenge is genuine, let&apos;s talk.
        </p>
      </div>

      <Link
        href="/contact"
        className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-editorial-float transition-[filter] hover:brightness-[1.03]"
      >
        Get in touch →
      </Link>
    </section>
  )
}

