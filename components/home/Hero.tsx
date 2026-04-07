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
        <div className="bg-[#E1F5EE] text-[#085041] text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1D9E75]" aria-hidden="true" />
          Toronto, Ontario · Remote Worldwide
        </div>

        {/* Name */}
        <TypingAnimation
          as="h1"
          className="mt-4 text-5xl font-bold text-foreground leading-tight"
          duration={80}
        >
          Charan Deol
        </TypingAnimation>

        {/* Headline */}
        <div className="mt-4 text-2xl font-semibold text-foreground max-w-xl leading-snug">
          Product Management · Business Systems · Solution Architecture ·
          AI-Native Delivery
        </div>

        {/* Subtext */}
        <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl">
          Most product leaders think in features. Most analysts think in
          requirements. I think in systems, outcomes, and what it actually takes
          to ship — from discovery through to value realized, including building
          the AI agents that make it stick.
        </p>

        {/* Industry pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
            Finance & Banking
          </span>
          <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
            Insurance
          </span>
          <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
            Tech & SaaS
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/portfolio/projects"
            className="bg-foreground text-background rounded-md px-5 py-2.5 text-sm font-medium"
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

