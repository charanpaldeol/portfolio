import Link from "next/link"

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
            I work best with teams where the problem is messy, the stakes are
            real, and they need someone who can think, decide, and deliver. Not
            a fit for every engagement — but if the challenge is genuine, let&apos;s
            talk.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-10 py-5 text-base font-bold text-on-primary shadow-editorial-float transition-all hover:bg-primary-container sm:w-auto"
            >
              Book a consultation
            </Link>
            <Link
              href="/portfolio/projects"
              className="inline-flex w-full items-center justify-center rounded-xl border border-background/20 px-10 py-5 text-base font-bold text-background transition-all hover:bg-background/10 sm:w-auto"
            >
              View case studies
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
