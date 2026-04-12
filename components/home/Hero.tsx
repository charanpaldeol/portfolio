import Link from "next/link"
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
    <section className="flex w-full flex-col gap-8 pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
      <div className="max-w-2xl">
        {/* Availability badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold tracking-wide text-on-primary-fixed uppercase">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          Toronto, Ontario · Remote Worldwide
        </div>

        {/* Name */}
        <TypingAnimation
          as="h1"
          className="font-display mt-4 text-5xl font-extrabold leading-tight tracking-tighter text-foreground"
          duration={80}
        >
          Charan Deol
        </TypingAnimation>

        {/* Headline */}
        <div className="mt-4 max-w-xl font-display text-2xl font-bold leading-snug tracking-tight text-foreground">
          Product Management · Business Systems · Solution Architecture ·
          AI-Native Delivery
        </div>

        {/* Subtext */}
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Most product leaders think in features. Most analysts think in
          requirements. I think in systems, outcomes, and what it actually takes
          to ship — from discovery through to value realized, including building
          the AI agents that make it stick.
        </p>

        {/* Industry pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Finance & Banking
          </span>
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Insurance
          </span>
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Tech & SaaS
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/portfolio/projects"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-editorial-float transition-[filter] hover:brightness-[1.03]"
          >
            See my work →
          </Link>
        </div>
      </div>

      <div className="relative flex min-h-[280px] w-full max-w-[400px] shrink-0 items-center justify-center overflow-hidden self-center lg:self-auto lg:mx-0">
        <IconCloud images={heroIconImages} />
      </div>
    </section>
  )
}

