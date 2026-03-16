import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "../../components/Button/Button"
import { AnimatedGradientText } from "../../components/magicui/animated-gradient-text"
import { BlurFade } from "../../components/magicui/blur-fade"

const cards = [
  {
    href: "/portfolio/about",
    title: "About",
    description: "Who I am, how I work, and what I care about.",
    icon: "👤",
  },
  {
    href: "/portfolio/services",
    title: "Services",
    description: "How I help teams ship products with momentum.",
    icon: "🛠️",
  },
  {
    href: "/portfolio/projects",
    title: "Projects",
    description: "Selected projects with context, constraints, and outcomes.",
    icon: "📁",
  },
  {
    href: "/portfolio/experience",
    title: "Experience",
    description: "Roles, teams, and responsibilities across my career.",
    icon: "📈",
  },
  {
    href: "/portfolio/contact",
    title: "Contact",
    description: "Reach out to discuss projects, collaborations, or advisory work.",
    icon: "✉️",
  },
] as const

export default function PortfolioOverviewPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <AnimatedGradientText className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Portfolio
        </AnimatedGradientText>
        <BlurFade>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Work, experience &amp; expertise
          </h1>
        </BlurFade>
        <BlurFade delay={0.05}>
          <p className="max-w-2xl text-sm text-slate-600 md:text-base">
            A focused overview of how I&apos;ve helped teams design, build, and launch products—from early concepts to
            mature systems.
          </p>
        </BlurFade>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index, duration: 0.25, ease: "easeOut" }}
          >
            <Card className="flex h-full flex-col border-slate-200 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/5 text-lg">
                  <span aria-hidden="true">{card.icon}</span>
                </div>
                <CardTitle className="text-base font-semibold text-slate-900">{card.title}</CardTitle>
                <CardDescription className="text-sm text-slate-600">{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Button asChild size="sm" className="mt-2">
                  <Link href={card.href}>View {card.title.toLowerCase()}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  )
}

