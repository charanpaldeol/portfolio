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
          I turn complex problems into{" "}
          <Highlighter action="underline" color="#FF9800">
            clear decisions
          </Highlighter>{" "}
          and{" "}
          <Highlighter action="highlight" color="#87CEFA">
            delivered solutions
          </Highlighter>
          .
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
      </div>

      <div className="relative flex min-h-[280px] w-full max-w-[400px] shrink-0 items-center justify-center overflow-hidden self-center lg:self-auto lg:mx-0">
        <IconCloud images={heroIconImages} />
      </div>
    </section>
  )
}

