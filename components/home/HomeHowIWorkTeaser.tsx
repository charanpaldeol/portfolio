import Link from "next/link"

import {
  homeDeliveryPhaseTitles,
  homeHowIWorkIntro,
  homeHowIWorkNavDescription,
  homeHowIWorkPullQuote,
} from "@/lib/home-page-sections"

export default function HomeHowIWorkTeaser() {
  return (
    <section
      id="how-i-work"
      aria-labelledby="home-hiw-heading"
      className="scroll-mt-28"
    >
      <div className="grid gap-4 lg:grid-cols-3">

        {/* ── Featured gradient card ─ spans 2 of 3 columns ── */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-8 shadow-editorial md:p-10 lg:col-span-2">
          {/* Decorative orb */}
          <div
            className="pointer-events-none absolute top-0 right-0 h-56 w-56 translate-x-10 -translate-y-10 rounded-full bg-primary-fixed/15 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10">
            <div className="text-[10px] font-bold tracking-[0.2em] text-primary-foreground/70 uppercase">
              Operating model
            </div>
            <h2
              id="home-hiw-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl"
            >
              How I{" "}
              <span className="italic text-primary-fixed">work</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-primary-foreground/85">
              {homeHowIWorkIntro}
            </p>

            {/* Phase pills */}
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Delivery phases">
              {homeDeliveryPhaseTitles.map((title) => (
                <span
                  key={title}
                  className="rounded-full bg-primary-foreground/15 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-primary-foreground uppercase ring-1 ring-primary-foreground/10"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <Link
              href="/how-i-work"
              className="inline-flex items-center justify-center rounded-xl bg-primary-fixed px-6 py-3 text-sm font-bold tracking-wide text-on-primary-fixed shadow-editorial-float hover:brightness-[1.03]"
            >
              How I work →
            </Link>
          </div>
        </div>

        {/* ── Pull quote aside ── */}
        <aside className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 md:p-8">
          <div className="flex gap-4">
            <div className="w-0.5 shrink-0 self-stretch rounded-full bg-tertiary" aria-hidden />
            <blockquote className="min-w-0 py-0.5">
              <p className="text-lg font-extrabold leading-snug tracking-tight text-foreground md:text-xl">
                {homeHowIWorkPullQuote}
              </p>
            </blockquote>
          </div>
          <p className="mt-6 text-sm font-normal leading-relaxed text-muted-foreground">
            Most PMs stop at the roadmap. Most BAs stop at the requirements doc. I stay until the outcome is real.
          </p>
          <Link
            href="/how-i-work"
            className="mt-6 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {homeHowIWorkNavDescription} →
          </Link>
        </aside>

      </div>
    </section>
  )
}
