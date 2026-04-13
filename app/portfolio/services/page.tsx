import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

import ServicesContent from "./ServicesContent"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product design consulting: strategy, AI-native UX, design systems, and fractional design leadership — from clarity to shipped product. Charan Deol.",
  alternates: { canonical: "https://cpdeol.com/portfolio/services" },
  openGraph: {
    title: "Services — Charan Deol",
    description:
      "Concrete consulting services for teams building AI-powered products, scaling design systems, and shipping with better cross-functional alignment.",
    url: "https://cpdeol.com/portfolio/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Charan Deol",
    description:
      "Product design consulting for AI-native products, design systems, and fractional design leadership — outcomes, deliverables, and clear engagement shapes.",
  },
}

export default function ServicesPage() {
  return (
    <PageShell>
      <ServicesContent />
    </PageShell>
  )
}
