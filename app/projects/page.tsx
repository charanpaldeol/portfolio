import { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/PageShell"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects by Charan Deol — product strategy, design systems, and full-stack engineering work. Coming soon.",
  alternates: { canonical: "https://cpdeol.com/projects" },
  openGraph: {
    title: "Projects — Charan Deol",
    description:
      "Selected projects by Charan Deol — product strategy, design systems, and full-stack engineering work. Coming soon.",
    url: "https://cpdeol.com/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Charan Deol",
    description:
      "Selected projects by Charan Deol — product strategy, design systems, and full-stack engineering work. Coming soon.",
  },
}

export default function ProjectsPage() {
  return (
    <PageShell>
      <div className="space-y-10 md:space-y-12">
        <header className="max-w-4xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Projects</span>
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl">
            Selected <span className="text-editorial-gradient">work.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl">
            A fuller case-study index is on the way. For now, explore curated highlights on the portfolio projects page.
          </p>
        </header>

        <div className="rounded-xl bg-surface-container-low p-8 md:p-10">
          <p className="text-base leading-relaxed text-on-surface-variant">
            Detailed write-ups and visuals are coming soon. If you&apos;re evaluating fit for an engagement, the
            portfolio section has representative work.
          </p>
          <Link
            href="/portfolio/projects"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-semibold text-primary-foreground shadow-editorial transition hover:brightness-[1.03]"
          >
            View portfolio projects
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
