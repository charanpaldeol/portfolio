import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { RelatedLinks } from "@/components/content/RelatedLinks"
import HowIWork from "@/components/home/HowIWork"
import SystemsThinkingSection from "@/components/home/SystemsThinkingSection"
import { PageShell } from "@/components/layout/PageShell"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { resolveBlogArticles, resolveExpertiseAreas, resolveProcessSteps, resolveServices } from "@/lib/content-lookups"
import { expertiseAreas } from "@/lib/how-i-work-data"
import { services } from "@/lib/services-data"
import { processSteps } from "@/lib/work-with-me-data"

function CTA() {
  return (
    <section className="relative mt-14 flex flex-col items-start justify-between gap-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-10 shadow-editorial md:mt-20 md:flex-row md:items-center md:p-12">
      <div className="relative z-10">
        <h2 className="font-display text-2xl font-bold tracking-tight text-primary-foreground md:text-3xl">
          Talk through your delivery arc
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm font-normal leading-relaxed text-primary-foreground/88 md:text-base md:leading-relaxed">
          If you have a messy cross-functional program, I can help frame the decision,
          build the plan, and drive adoption through to outcomes.
        </p>
      </div>
      <div className="relative z-10">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-fixed px-7 py-4 font-sans text-sm font-semibold text-on-primary-fixed shadow-editorial-float transition hover:brightness-[1.03]"
        >
          Contact me <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-foreground/15 via-transparent to-transparent"
        aria-hidden
      />
    </section>
  )
}

export default function HowIWorkPage() {
  return (
    <PageShell>
      <EditorialPageHero
        eyebrow="Operating model"
        title={
          <>
            How I <span className="text-editorial-gradient">work</span>
          </>
        }
        description="End-to-end ownership, measured outcomes, and clean handoffs only when the value is real."
      />
      <section className="rounded-2xl bg-surface-container-low p-8 shadow-editorial md:p-12 lg:p-14">
        <HowIWork afterPipeline={<SystemsThinkingSection />} />
      </section>
      <RelatedLinks
        className="mt-10"
        heading="Connected content"
        description="Move from operating model detail into concrete services and engagement next steps."
        groups={[
          { title: "Expertise areas", items: resolveExpertiseAreas(expertiseAreas.map((area) => area.id ?? "")), showSublabel: true },
          { title: "Services", items: resolveServices(services.map((service) => service.id)) },
          { title: "Engagement flow", items: resolveProcessSteps(processSteps.map((step) => step.id ?? "")), showSublabel: true },
          {
            title: "Related essays",
            items: resolveBlogArticles(["problem-framing", "ai-native-delivery", "designing-for-decisions"]),
            showSublabel: true,
          },
        ]}
      />
      <CTA />
    </PageShell>
  )
}

