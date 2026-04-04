import type { Metadata } from "next"

import ServicesContent from "./ServicesContent"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product strategy, full-stack engineering, design systems, and technical leadership engagements. Independent consulting by Charan Deol.",
  alternates: { canonical: "https://cpdeol.com/portfolio/services" },
  openGraph: {
    title: "Services — Charan Deol",
    description:
      "Product strategy, full-stack engineering, design systems, and technical leadership engagements. Independent consulting by Charan Deol.",
    url: "https://cpdeol.com/portfolio/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Charan Deol",
    description:
      "Product strategy, full-stack engineering, design systems, and technical leadership engagements. Independent consulting by Charan Deol.",
  },
}

export default function ServicesPage() {
  return <ServicesContent />
}
