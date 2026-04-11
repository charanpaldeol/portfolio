import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

import ServicesContent from "./ServicesContent"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites and landing pages, custom software, AI automation, and enterprise-grade systems — from first launch to scale. Consulting by Charan Deol.",
  alternates: { canonical: "https://cpdeol.com/portfolio/services" },
  openGraph: {
    title: "Services — Charan Deol",
    description:
      "Websites, custom products, AI workflows, and secure enterprise systems — clear collaboration from discovery to handoff.",
    url: "https://cpdeol.com/portfolio/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Charan Deol",
    description:
      "Websites, custom products, AI workflows, and secure enterprise systems — clear collaboration from discovery to handoff.",
  },
}

export default function ServicesPage() {
  return (
    <PageShell>
      <ServicesContent />
    </PageShell>
  )
}
