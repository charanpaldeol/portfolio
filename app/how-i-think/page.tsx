import { ArrowRight } from "lucide-react"
import Link from "next/link"

import HowIThink from "@/components/home/HowIThink"
import { PageShell } from "@/components/layout/PageShell"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"

function PageHero() {
  return (
    <EditorialPageHero
      eyebrow="Principles"
      title={
        <>
          How I <span className="text-editorial-gradient">think</span>
        </>
      }
      description="A small set of principles to navigate ambiguity, reduce rework, and keep delivery tethered to outcomes."
    />
  )
}

function CTA() {
  return (
    <section className="mt-14 md:mt-20 rounded-2xl bg-primary text-on-primary p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold">Pressure-test your brief</h2>
        <p className="mt-2 opacity-85 max-w-xl text-sm md:text-base leading-relaxed">
          If you want an outside lens before committing to scope, architecture, or a vendor,
          I can help you get to a defensible decision fast.
        </p>
      </div>
      <div className="relative z-10">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-fixed text-on-primary-fixed px-7 py-4 font-semibold shadow-editorial-float transition hover:brightness-[1.03]"
        >
          Contact me <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
    </section>
  )
}

export default function HowIThinkPage() {
  return (
    <PageShell>
      <PageHero />
      <section className="rounded-2xl bg-surface-container-low p-6 shadow-editorial md:p-10">
        <header className="mb-8 md:mb-10">
          <div className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Interactive
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Arrange the principles
          </h2>
          <p className="mt-3 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            Drag the cards until the sequence feels right. The point isn’t a “correct” order — it’s noticing what you prioritise.
          </p>
        </header>

        <HowIThink showHeader={false} showHelperText={false} />
      </section>
      <CTA />
    </PageShell>
  )
}

