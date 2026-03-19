import Link from "next/link"
import { TypingAnimation } from "@/registry/magicui/typing-animation"

export default function Hero() {
  return (
    <section className="max-w-2xl pt-8">
      {/* Availability badge */}
      <div className="bg-[#E1F5EE] text-[#085041] text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#1D9E75]" aria-hidden="true" />
        Open to the right opportunity
      </div>

      {/* Role line */}
      <div className="mt-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Problem solver · Critical thinker · Delivery lead · Change leader
      </div>

      {/* Name */}
      <TypingAnimation
        as="h1"
        className="mt-3 text-4xl font-medium text-foreground"
        duration={80}
      >
        Hi, I&apos;m Charan Deol
      </TypingAnimation>

      {/* Headline */}
      <div className="mt-4 text-xl font-medium text-foreground max-w-xl leading-snug">
        I turn complex problems into clear decisions and delivered solutions.
      </div>

      {/* Subtext */}
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
        I work with business teams to understand what's actually broken, build the case for change, and lead
        delivery — whether that's an in-house build or a SaaS implementation. Then I make sure it sticks through
        structured change management.
      </p>

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
        I've done this across finance, healthcare, retail, and tech — working alongside architects, leading dev
        teams, and sitting across the table from C-suite stakeholders.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/portfolio/projects"
          className="bg-foreground text-background rounded-md px-5 py-2.5 text-sm font-medium"
        >
          See my work →
        </Link>
      </div>

      {/* Industry pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
          Finance & banking
        </span>
        <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
          Healthcare
        </span>
        <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
          Retail & e-commerce
        </span>
        <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
          Tech & SaaS
        </span>
      </div>
    </section>
  )
}

