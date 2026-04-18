import Link from "next/link"

import {
  homeDomainNarratives,
  homeHeroAvailability,
  homeHeroBody,
  homeHeroIndustries,
  homeHeroName,
  homeHeroSubhead,
} from "@/lib/home-hero-data"
import { withAttribution } from "@/lib/ux-measurement"
import { IconCloud } from "@/registry/magicui/icon-cloud"
import { TypingAnimation } from "@/registry/magicui/typing-animation"

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
]

const heroIconImages = slugs.map(
  (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
)

export default function Hero() {
  return (
    <section
      id="page-top"
      className="relative flex w-full flex-col gap-8 overflow-hidden pt-6 scroll-mt-28 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:pt-10"
    >
      {/* Background orb — no border, depth through gradient blur */}
      <div
        className="pointer-events-none absolute -right-32 -top-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/15 to-secondary/8 blur-[100px] lg:h-[640px] lg:w-[640px]"
        aria-hidden
      />

      <div className="relative z-10 max-w-2xl">

        {/* Availability badge — surface tonal, no border */}
        <div className="inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
          {homeHeroAvailability}
        </div>

        {/* H1 — Display scale: Manrope ExtraBold via base styles */}
        <TypingAnimation
          as="h1"
          className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
          duration={70}
        >
          {homeHeroName}
        </TypingAnimation>

        {/* Sub-headline — Manrope Bold, italic primary accent */}
        <p className="mt-4 text-xl font-bold leading-snug tracking-tight text-foreground md:text-2xl">
          {homeHeroSubhead.prefix}{" "}
          <span className="italic text-primary">{homeHeroSubhead.accent.replace("-", "\u2011")}</span>
        </p>

        {/* Body — Inter Light per DESIGN.md "Body" scale */}
        <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">
          {homeHeroBody.before}{" "}
          <span className="font-medium text-foreground">{homeHeroBody.accent}</span>{" "}
          {homeHeroBody.after}
        </p>

        {/* Industry pills — Label scale: Inter SemiBold, all-caps */}
        <div className="mt-5 flex flex-wrap gap-2">
          {homeHeroIndustries.map((label) => (
            <span
              key={label}
              className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {homeDomainNarratives.map((domain) => (
            <article
              key={domain.domain}
              className="rounded-xl bg-surface-container-low p-3 text-xs leading-relaxed text-muted-foreground"
            >
              <h2 className="font-semibold tracking-tight text-foreground">{domain.domain}</h2>
              <p className="mt-1">
                <span className="font-medium text-foreground">Recurring problem:</span> {domain.recurringProblems}
              </p>
              <p className="mt-1">
                <span className="font-medium text-foreground">Value:</span> {domain.visitorValue}
              </p>
            </article>
          ))}
        </div>

        {/* CTAs — Primary: gradient fill. Secondary: surface tonal, ghost border at max 20% */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={withAttribution("/portfolio/projects", { from: "home-hero", intent: "explore" })}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-container px-8 py-4 text-sm font-bold text-primary-foreground shadow-editorial-float transition-all hover:brightness-[1.04] hover:shadow-editorial"
          >
            See my work →
          </Link>
          <Link
            href={withAttribution("/contact", { from: "home-hero", intent: "scope" })}
            className="inline-flex items-center justify-center rounded-xl bg-surface-container-lowest px-8 py-4 text-sm font-bold text-foreground shadow-editorial-float ring-1 ring-outline-variant/15 transition-all hover:bg-surface-container"
          >
            Get in touch →
          </Link>
        </div>
      </div>

      {/* Icon cloud */}
      <div className="relative z-10 flex min-h-[300px] w-full max-w-[420px] shrink-0 items-center justify-center overflow-hidden self-center lg:self-auto lg:mx-0">
        <IconCloud images={heroIconImages} />
      </div>
    </section>
  )
}
