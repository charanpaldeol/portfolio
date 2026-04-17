import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

import ExperienceContent from "./ExperienceContent"

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career timeline of Charan Deol — lead business systems analyst and technical BA with 8+ years across enterprise software, banking compliance, capital-markets CRM, and logistics technology.",
  alternates: { canonical: "https://cpdeol.com/portfolio/experience" },
  openGraph: {
    title: "Experience — Charan Deol",
    description:
      "Career timeline of Charan Deol — lead business systems analyst and technical BA with 8+ years across enterprise software, banking compliance, capital-markets CRM, and logistics technology.",
    url: "https://cpdeol.com/portfolio/experience",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience — Charan Deol",
    description:
      "Career timeline of Charan Deol — lead business systems analyst and technical BA with 8+ years across enterprise software, banking compliance, capital-markets CRM, and logistics technology.",
  },
}

export default function ExperiencePage() {
  return (
    <PageShell>
      <ExperienceContent />
    </PageShell>
  )
}
