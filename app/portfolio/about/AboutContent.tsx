"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Building2,
  Eye,
  Landmark,
  Rocket,
  Shield,
  Store,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { RobotAvatar } from "@/components/about/RobotAvatar"
import { cn } from "@/lib/utils"

const INTEREST_IMAGES = {
  cycling:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB5J6lxHSqT9yHRfxf5r2Vi7F1LHHmgR5gc41UmMk2BQNDZmH7-xFeT7LZt5Rsv6gNkxn8o0x79MfiDSzTHDbYK_ok9dK11cpuC8zPdOyeKdFhhMaOdjdYqi7F4HmiBbcdt4DvlBDCUHfYQC8B4Fk99yJLd3Km-PQc6OIWjLMG6SqTbil2F9sdW9qA8lvRBRrRiMWKj3iXuZG8aqPvSoYR1fRoz3j-NXeuiwhEIKIP_NXaNdkBC4xNW-MQOlcIq9UyoV99E5wpVx1I",
  vinyl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuASJLA2h2rzMhGd0Oryee2VGRaKZicOmXT8GuXUdu0xJKPPn0KX6PTXl93tlpzimmecXZghVW6ea-3XnhZeUUBpxyZdx1e0X71WPpqRn3nMATgjQ4HPTRUPKPhisQ1hjQGYIZD-1hUi6U5wP-GTxBhG0wbwnqBRQ5Ln3I56SA4ZO_RVDM3ZVVoo5QC9XJwXpAOiawajNzMu6pV0ILFJBV9Ak2aSXHwbfk0hgY9fJe2Gl1yIF6nxmLlY8-iz8FezXevmjqEvtSLrLB0",
  brutalist:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA4o7BvLzz4iR_YNvLcDOjloDk5IkEmiTURj7d5f2U2JSuqzrXGHyxVdbBWuDRC-99TTqfmE1BZfe_O3IFGQV44202P5MZctGij4woDQvoR0fK-PCQZM4E6gCfIL0vrbj3NgP-SfybaW4EzxDmnBtA0l_kgc_mnEIkEgyv38M4HV5Bn2SUdW66Ag8s74FwD8fwiQBGeoWkhZDgeIkrcx1GV6P_dzJ-5JIWQPq_qkMiBquwqeU0apV59acTfscpM1jSy5FSTBfQqW98",
} as const

const journey = [
  {
    years: "2016—2019",
    title: "Full-stack product work",
    phase: "Foundations",
    body: "Agency and in-house roles across healthcare, retail, and fintech — shipping interfaces, APIs, and the glue between them with an eye for durable patterns.",
  },
  {
    years: "2020—2022",
    title: "Platform & design systems",
    phase: "The bridge",
    body: "Led frontend architecture and design systems at a B2B data platform — scaling component libraries, performance budgets, and how product and engineering agreed on quality.",
  },
  {
    years: "2023—Present",
    title: "Independent consultant",
    phase: "Visionary execution",
    body: "Partnering with teams on strategy, UX, and the code that ships it — from discovery workshops to production handoff, with editorial clarity at every step.",
  },
] as const

const values = [
  {
    icon: Building2,
    iconClass: "text-primary",
    title: "Architectural precision",
    body: "I don't just build features; I build systems. Scalability is baked in early so growth doesn't trade away integrity.",
  },
  {
    icon: Zap,
    iconClass: "text-secondary",
    title: "AI-augmented workflows",
    body: "Using modern tooling to compress cycles and sharpen decisions — without letting speed replace judgment or craft.",
  },
  {
    icon: Shield,
    iconClass: "text-tertiary",
    title: "Inherent resilience",
    body: "Most failures are design problems before they're technical ones. I prioritize patterns and processes that absorb change.",
  },
  {
    icon: Eye,
    iconClass: "text-primary",
    title: "Radical transparency",
    body: "Clients are partners. Strategic clarity is a deliverable — especially when tradeoffs are hard or timelines are tight.",
  },
] as const

const ecosystems = [
  {
    icon: Store,
    iconWrap: "bg-primary/20 text-primary-fixed",
    tag: "High growth",
    title: "SMBs & scale-ups",
    body: "Technical standards that support rapid hiring and iteration without baking in legacy bottlenecks.",
    bullets: ["Tech debt audits", "Infrastructure scaling"],
    bulletColor: "bg-primary",
    offset: false,
  },
  {
    icon: Landmark,
    iconWrap: "bg-secondary/20 text-secondary-fixed",
    tag: "Global reach",
    title: "Enterprises",
    body: "Complex stakeholder maps, legacy modernization, and instilling product culture where execution has been fragmented.",
    bullets: ["Legacy modernization", "Operating rhythm"],
    bulletColor: "bg-secondary",
    offset: true,
  },
  {
    icon: Rocket,
    iconWrap: "bg-tertiary/20 text-tertiary-fixed",
    tag: "Zero to one",
    title: "Stealth & startups",
    body: "Fractional depth on MVP scope, stack choices, and the first hires — so v1 is coherent, not just fast.",
    bullets: ["MVP strategy", "Team incubation"],
    bulletColor: "bg-tertiary",
    offset: false,
  },
] as const

const stats = [
  { value: "8+", label: "Years in delivery" },
  { value: "50+", label: "Projects shipped" },
  { value: "6", label: "Phases, end-to-end" },
  { value: "3", label: "Core verticals" },
] as const

const interests = [
  {
    src: INTEREST_IMAGES.cycling,
    alt: "Road bike against a concrete wall in morning fog",
    title: "Endurance cycling",
    caption: "Finding clarity in long-distance climbs.",
  },
  {
    src: INTEREST_IMAGES.vinyl,
    alt: "Record player needle on vinyl, warm light",
    title: "Analog sound",
    caption: "Physical media in a digital workflow.",
  },
  {
    src: INTEREST_IMAGES.brutalist,
    alt: "Brutalist concrete architecture with strong shadows",
    title: "Brutalist travel",
    caption: "Geometric honesty — mostly through a camera lens.",
  },
] as const

function useMotionPrefs() {
  const reduceMotion = useReducedMotion() ?? false
  const t = (duration: number, delay = 0) => ({
    duration: reduceMotion ? 0 : duration,
    delay: reduceMotion ? 0 : delay,
  })
  const instant = reduceMotion ? { opacity: 1, y: 0 } : undefined
  return { t, instant }
}

export default function AboutContent({ robotAnimationData }: { robotAnimationData?: object | null }) {
  const { t, instant } = useMotionPrefs()

  return (
    <div className="space-y-0 pb-8">
      {/* Hero */}
      <section className="mb-20 md:mb-32">
        <div className="grid grid-cols-12 gap-8 md:gap-10">
          <motion.div
            initial={instant ?? { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.55)}
            className="col-span-12 lg:col-span-7"
          >
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-on-surface-variant uppercase md:mb-5">
              Charan Deol
            </p>
            <h1 className="mb-10 font-display text-5xl font-extrabold leading-[0.95] tracking-tighter text-on-surface md:mb-12 md:text-7xl lg:text-8xl">
              Where <span className="text-primary">engineering</span> logic meets{" "}
              <span className="text-secondary">strategic</span> design.
            </h1>
            <div className="max-w-xl">
              <p className="mb-8 text-lg leading-relaxed text-on-surface-variant md:text-xl">
                Independent consultant with 8+ years across B2B SaaS, fintech, and consumer products. Work sits at the
                intersection of architectural discipline and product intuition — helping teams ship coherent software, not
                just more tickets.
              </p>
              <div className="flex items-center gap-4">
                <span className="h-px w-12 shrink-0 bg-outline-variant" aria-hidden />
                <span className="text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Bridging the gap</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={instant ?? { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.6, 0.08)}
            className="relative col-span-12 mt-10 pb-0 md:pb-16 lg:col-span-5 lg:mt-0"
          >
            <div className="relative flex aspect-[5/6] max-w-md items-center justify-center rounded-2xl bg-surface-container-high shadow-editorial-lg lg:max-w-none">
              <RobotAvatar animationData={robotAnimationData ?? null} className="h-full w-full p-4 md:p-6" />
            </div>
            <div className="absolute -bottom-6 -left-2 z-10 hidden max-w-[min(240px,calc(100vw-3rem))] rounded-xl bg-secondary p-6 text-on-secondary shadow-editorial md:-left-6 md:block md:p-8">
              <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-on-secondary/80 uppercase">Philosophy</p>
              <p className="font-display text-lg font-bold leading-tight italic">
                &quot;Good architecture is invisible; great product strategy is undeniable.&quot;
              </p>
            </div>
            <figure className="mt-6 rounded-xl bg-secondary p-6 text-on-secondary shadow-editorial md:hidden">
              <figcaption className="mb-2 text-xs font-semibold tracking-[0.18em] text-on-secondary/80 uppercase">
                Philosophy
              </figcaption>
              <blockquote className="font-display text-lg font-bold leading-tight italic">
                &quot;Good architecture is invisible; great product strategy is undeniable.&quot;
              </blockquote>
            </figure>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mb-20 md:mb-32" aria-label="At a glance">
        <div className="grid grid-cols-2 gap-3 rounded-2xl md:grid-cols-4 md:gap-4">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1 rounded-xl bg-surface-container-low px-4 py-8 text-center shadow-editorial md:px-6 md:py-10"
            >
              <span className="font-display text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
                {value}
              </span>
              <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="relative -mx-6 bg-surface-container-low px-6 py-20 md:-mx-8 md:px-8 md:py-32">
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-start">
          <h2 className="max-w-xl font-display text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            The evolution of <br />
            technical strategy
          </h2>
          <p className="max-w-md text-lg text-on-surface-variant">
            From shaping interfaces and APIs to defining how teams agree on quality — a through-line of clarity and
            craft.
          </p>
        </div>
        <div>
          {journey.map((m, i) => (
            <motion.div
              key={m.years}
              initial={instant ?? { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={t(0.4, i * 0.05)}
              className="group grid grid-cols-1 items-start gap-6 py-10 transition-colors duration-500 md:grid-cols-12 md:items-center md:gap-0 md:py-12 md:-mx-6 md:px-6 hover:bg-surface-container-lowest/80"
            >
              <div className="font-display text-2xl font-extrabold text-primary md:col-span-2">{m.years}</div>
              <div className="md:col-span-4">
                <h3 className="mb-2 font-display text-2xl font-bold text-on-surface">{m.title}</h3>
                <p className="text-xs font-semibold tracking-wider text-secondary uppercase">{m.phase}</p>
              </div>
              <p className="text-on-surface-variant leading-relaxed md:col-span-6">{m.body}</p>
              {i < journey.length - 1 ? (
                <div className="col-span-full mt-10 h-px bg-outline-variant/30 md:mt-12" aria-hidden />
              ) : null}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32">
        <div className="grid grid-cols-12 gap-10 md:gap-12">
          <div className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-[calc(var(--site-header-offset)+1rem)]">
              <h2 className="mb-6 text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Core beliefs</h2>
              <p className="font-display text-3xl font-extrabold leading-tight tracking-tight text-on-surface md:text-4xl">
                The principles that govern my output.
              </p>
            </div>
          </div>
          <div className="col-span-12 grid gap-10 md:col-span-8 md:grid-cols-2 md:gap-12">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={instant ?? { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={t(0.4, i * 0.06)}
                className="rounded-xl bg-surface-container-lowest p-8 shadow-sm transition-colors hover:bg-surface-container-low"
              >
                <v.icon className={cn("mb-6 size-10 stroke-[1.25]", v.iconClass)} aria-hidden />
                <h4 className="mb-4 font-display text-xl font-bold text-on-surface">{v.title}</h4>
                <p className="leading-relaxed text-on-surface-variant">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystems */}
      <section className="relative -mx-6 bg-inverse-surface px-6 py-20 text-inverse-on-surface md:-mx-8 md:px-8 md:py-32">
        <div className="mb-12 md:mb-16">
          <h2 className="mb-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">Operating across ecosystems</h2>
          <p className="max-w-2xl text-lg text-inverse-on-surface/70">
            Depth without tunnel vision — patterns that travel across org sizes and maturity levels.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ecosystems.map((b) => (
            <div
              key={b.title}
              className={cn(
                "rounded-2xl bg-white/[0.06] p-10 transition-all hover:bg-white/[0.11]",
                b.offset && "md:translate-y-4 lg:translate-y-6",
              )}
            >
              <div className="mb-12 flex items-start justify-between">
                <div className={cn("rounded-lg p-3", b.iconWrap)}>
                  <b.icon className="size-6" aria-hidden />
                </div>
                <span className="text-xs tracking-[0.2em] text-inverse-on-surface/50 uppercase">{b.tag}</span>
              </div>
              <h4 className="mb-4 font-display text-2xl font-bold">{b.title}</h4>
              <p className="mb-6 leading-relaxed opacity-70">{b.body}</p>
              <ul className="space-y-2 text-sm">
                {b.bullets.map((li) => (
                  <li key={li} className="flex items-center gap-2">
                    <span className={cn("size-1.5 shrink-0 rounded-full", b.bulletColor)} aria-hidden />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section className="overflow-hidden py-20 md:py-32">
        <div className="mb-10 flex items-center gap-4 md:mb-12">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-on-surface-variant uppercase">Beyond the console</h2>
          <div className="h-px min-w-0 flex-1 bg-outline-variant/30" />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <p className="font-display text-2xl font-bold leading-snug text-on-surface lg:col-span-4">
            When I&apos;m not designing systems, I&apos;m exploring the physical architecture of the world.
          </p>
          <div
            className="-mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain scroll-pl-4 scroll-pr-8 pb-4 pl-1 pr-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 lg:col-span-8 [&::-webkit-scrollbar]:hidden"
            aria-label="Personal interests"
          >
            {interests.map((it) => (
              <div key={it.title} className="group w-[min(100%,280px)] shrink-0 snap-start sm:w-[min(100%,300px)]">
                <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl">
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    sizes="300px"
                    className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                </div>
                <p className="font-display font-bold text-on-surface">{it.title}</p>
                <p className="text-sm text-on-surface-variant">{it.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration history */}
      <section className="py-12 text-center md:py-16" aria-label="Companies and teams">
        {/* TODO: replace placeholder company names with real teams Charan has worked with */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Companies &amp; teams I&apos;ve worked with
        </p>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed tracking-wide text-on-surface-variant">
          Northwind Analytics · Meridian Health Systems · Cascade Fintech · Harbor Operations Co · Lumen Collaboration
        </p>
      </section>

      {/* Availability */}
      <section className="py-20 md:py-24" aria-labelledby="availability-heading">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2
              id="availability-heading"
              className="mb-4 text-xs font-semibold tracking-[0.2em] text-primary uppercase"
            >
              Currently available
            </h2>
            <p className="font-display text-3xl font-extrabold leading-tight tracking-tight text-on-surface md:text-4xl">
              Taking on engagements from{" "}
              <span className="text-editorial-gradient">Q3 2026.</span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                title: "AI-native programme delivery",
                body: "End-to-end ownership from discovery through adoption — with LLM-assisted workflows built in from the start.",
              },
              {
                title: "Solution architecture & BA",
                body: "Requirements, system design, integration specs, and the stakeholder alignment that makes them stick.",
              },
              {
                title: "Fractional engagement",
                body: "Senior embedded capacity on a defined scope — from sprint zero through to handoff.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-editorial transition-colors hover:bg-surface-container-low"
              >
                <div className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                <div>
                  <p className="font-display text-sm font-bold text-on-surface">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-8 md:mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-on-primary md:p-20 lg:p-24">
          <div className="relative z-10 max-w-3xl">
            <h2 className="mb-6 font-display text-4xl font-extrabold tracking-tight md:mb-8 md:text-6xl lg:text-7xl">
              Ready to architect your next breakthrough?
            </h2>
            <p className="mb-10 text-lg opacity-90 md:mb-12 md:text-xl">
              Let&apos;s discuss how structural precision shows up in your product — from discovery to shipped software.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="mailto:hello@cpdeol.com"
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-on-primary px-8 py-4 font-display text-sm font-extrabold tracking-tight text-primary uppercase transition-all hover:bg-primary-fixed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-primary group sm:inline-flex"
              >
                Let&apos;s talk
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
              <Link
                href="/portfolio/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-on-primary/10 px-8 py-4 text-center text-sm font-semibold text-on-primary/95 transition-colors hover:bg-on-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Contact form
              </Link>
            </div>
          </div>
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-primary-container opacity-50 blur-[100px]"
            aria-hidden
          />
          <Building2
            className="pointer-events-none absolute right-4 top-24 size-[min(160px,36vw)] text-on-primary/[0.07] sm:right-8 sm:top-8 sm:size-[min(200px,40vw)] sm:text-on-primary/10 md:right-12 md:top-12"
            strokeWidth={1}
            aria-hidden
          />
        </div>
      </section>
    </div>
  )
}
