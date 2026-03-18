import Link from "next/link"

export default function CTABand() {
  return (
    <section className="bg-muted border border-border rounded-xl p-8 flex items-center justify-between gap-6 flex-wrap">
      <div>
        <h2 className="text-lg font-medium text-foreground mb-1">Working on a hard problem?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          I work best with teams building real solutions — where the problem is messy, the stakes are real, and
          they need someone who can think, decide, and deliver. Not a fit for every engagement — but if the
          challenge is genuine, let's talk.
        </p>
      </div>

      <Link
        href="/contact"
        className="bg-foreground text-background rounded-md px-5 py-2.5 text-sm font-medium flex-shrink-0 inline-flex items-center gap-2"
      >
        Get in touch →
      </Link>
    </section>
  )
}

