import { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"
import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { projects } from "@/lib/projects-data"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected case studies by Charan Deol — AI/ML, real-time systems, compliance, cloud architecture, and measurable engineering outcomes.",
  alternates: { canonical: "https://cpdeol.com/projects" },
  openGraph: {
    title: "Projects — Charan Deol",
    description:
      "Selected case studies — AI/ML, real-time systems, compliance, and cloud-native architecture with quantified results.",
    url: "https://cpdeol.com/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Charan Deol",
    description:
      "Selected case studies — AI/ML, real-time systems, compliance, and cloud-native architecture with quantified results.",
  },
}

export default function ProjectsPage() {
  return (
    <PageShell>
      <div className="space-y-10 md:space-y-12">
        <EditorialPageHero
          eyebrow="Projects"
          title={
            <>
              Selected <span className="text-editorial-gradient">work.</span>
            </>
          }
          description="Product decisions, technical depth, and measurable outcomes across AI/ML, real-time systems, compliance, and cloud-native architecture."
        />

        <div className="space-y-6 rounded-xl bg-surface-container-low p-8 md:p-10">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">
              {projects.length} detailed case studies
            </h2>
            <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
              Each project includes a problem statement, solution approach, quantified results, and the tech stack used. Click any project to dive deep into the decisions and outcomes.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/portfolio/projects"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-semibold text-primary-foreground shadow-editorial transition hover:brightness-[1.03]"
            >
              Explore All Projects →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-surface-container-high bg-transparent px-6 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest"
            >
              Let&apos;s discuss
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
