import type { Metadata } from "next"

import ExperienceContent from "./ExperienceContent"
import { PageShell } from "@/components/layout/PageShell"

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career timeline of Charan Deol — independent consultant, senior product engineer, and designer with 8+ years across B2B SaaS, fintech, and consumer apps.",
  alternates: { canonical: "https://cpdeol.com/portfolio/experience" },
  openGraph: {
    title: "Experience — Charan Deol",
    description:
      "Career timeline of Charan Deol — independent consultant, senior product engineer, and designer with 8+ years across B2B SaaS, fintech, and consumer apps.",
    url: "https://cpdeol.com/portfolio/experience",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience — Charan Deol",
    description:
      "Career timeline of Charan Deol — independent consultant, senior product engineer, and designer with 8+ years across B2B SaaS, fintech, and consumer apps.",
  },
}

export default function ExperiencePage() {
  return (
    <PageShell>
      <ExperienceContent />
    </PageShell>
  )
}
