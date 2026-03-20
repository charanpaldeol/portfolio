import Link from "next/link"

export default function EyeBreakTeaser() {
  return (
    <section>
      <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Small tool</div>

      <Link
        href="/eye-break"
        className="mt-6 flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border p-5 transition-colors hover:bg-muted"
      >
        <div>
          <h3 className="mb-1 text-sm font-medium text-foreground">Eye Break Timer</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Work in focused intervals and get a full-screen reminder to rest your eyes on a schedule you set.
          </p>
        </div>
        <div className="flex-shrink-0 pt-1 text-lg text-muted-foreground" aria-hidden="true">
          →
        </div>
      </Link>
    </section>
  )
}
