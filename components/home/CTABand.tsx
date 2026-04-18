import Link from "next/link"
import { withAttribution } from "@/lib/ux-measurement"

export default function CTABand() {
  return (
    <section id="contact-cta" className="scroll-mt-28">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-10 py-16 text-center md:px-20 md:py-24">
        {/* Glow orbs */}
        <div
          className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-primary/25 blur-[80px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-[80px]"
          aria-hidden
        />

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-background md:text-5xl lg:text-6xl">
            Ready to solve a <br className="hidden md:block" />
            <span className="italic text-primary-fixed">hard problem?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-background/70 md:text-lg">
            If the challenge is high-stakes, I can help shape the approach, lead execution, and stay through adoption.
            Explore case studies first, or book a scope call when you are ready to move.
          </p>

          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-background/12 px-3 py-1 text-xs font-semibold tracking-wide text-background">
              2-3x faster alignment
            </span>
            <span className="rounded-full bg-background/12 px-3 py-1 text-xs font-semibold tracking-wide text-background">
              30-50% fewer late scope changes
            </span>
            <span className="rounded-full bg-background/12 px-3 py-1 text-xs font-semibold tracking-wide text-background">
              80%+ adoption patterns
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={withAttribution("/contact", { from: "home-cta", intent: "scope" })}
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-10 py-5 text-base font-bold text-on-primary shadow-editorial-float transition-all hover:bg-primary-container sm:w-auto"
            >
              Scope your milestone
            </Link>
            <Link
              href={withAttribution("/portfolio/projects", { from: "home-cta", intent: "explore" })}
              className="inline-flex w-full items-center justify-center rounded-xl bg-background/10 px-10 py-5 text-base font-bold text-background shadow-editorial-float transition-all hover:bg-background/14 sm:w-auto"
            >
              Explore case studies
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
