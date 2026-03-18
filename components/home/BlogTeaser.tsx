import Link from "next/link"

export default function BlogTeaser() {
  return (
    <section>
      <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">How I think — in writing</div>

      <Link
        href="/blog"
        className="mt-6 border border-border rounded-xl p-5 flex items-start justify-between gap-4 hover:bg-muted transition-colors cursor-pointer"
      >
        <div>
          <div className="text-[10px] font-medium bg-[#EEEDFE] text-[#534AB7] px-2 py-0.5 rounded-full inline-block mb-2">
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

