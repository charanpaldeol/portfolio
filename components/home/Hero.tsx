import Link from "next/link"
import { Highlighter } from "@/registry/magicui/highlighter"
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
          Open to the right opportunity
        </div>

        {/* Role line */}
        <div className="mt-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          End-to-end delivery lead · Understands engineering
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
          I bridge {" "}
          <Highlighter action="underline" color="orange">
            business
          </Highlighter>{" "}
          and{" "}
          <Highlighter action="highlight" color="lightskyblue">
            engineering
          </Highlighter>
          .
        </div>

        {/* Subtext */}
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
          Most people do one or the other. Business side stops at requirements. Engineering side stops at deployment. Nobody owns the full arc.
        </p>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
          That's the job. Sit with the business, find the real problem — not the one on the brief. Build the case. Get into system design with engineers — architecture, where logic lives, what belongs in the backend vs the database. Ship it. Measure whether it actually worked.
        </p>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
          Building with AI now. Agents, model integration, AI-powered tech stack. The tooling is new. The problem is the same — business needs something, engineering builds something, and someone needs to make sure those are the same thing.
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
      </div>

      <div className="relative flex min-h-[280px] w-full max-w-[400px] shrink-0 items-center justify-center overflow-hidden self-center lg:self-auto lg:mx-0">
        <IconCloud images={heroIconImages} />
      </div>
    </section>
  )
}

