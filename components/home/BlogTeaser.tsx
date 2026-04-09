import Link from "next/link"

export default function BlogTeaser() {
  return (
    <section>
      <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">How I think — in writing</div>

      <Link
        href="/blog"
        className="mt-6 flex cursor-pointer items-start justify-between gap-4 rounded-xl bg-card p-5 shadow-editorial-float transition-shadow hover:shadow-editorial"
      >
        <div>
          <div className="mb-2 inline-block rounded-full bg-secondary-fixed px-2 py-0.5 text-[10px] font-semibold tracking-wide text-on-secondary-fixed uppercase">
            Critical thinking
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Why the problem on the brief is never the real problem</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Most projects fail not because of bad execution — but because everyone agreed on solving the wrong thing.
            Here's the framework I use to find the real problem before any solution is designed.
          </p>
        </div>
        <div className="text-lg text-muted-foreground flex-shrink-0 pt-1" aria-hidden="true">
          →
        </div>
      </Link>
    </section>
  )
}

