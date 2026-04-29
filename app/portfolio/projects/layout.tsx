import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected case studies by Charan Deol — AI/ML, real-time systems, compliance, cloud architecture, and measurable engineering outcomes.",
  alternates: { canonical: "https://cpdeol.com/portfolio/projects" },
  openGraph: {
    title: "Projects — Charan Deol",
    description:
      "Selected case studies — AI/ML, real-time systems, compliance, and cloud-native architecture with quantified results.",
    url: "https://cpdeol.com/portfolio/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Charan Deol",
    description:
      "Selected case studies — AI/ML, real-time systems, compliance, and cloud-native architecture with quantified results.",
  },
}

export default function PortfolioProjectsLayout({ children }: { children: ReactNode }) {
  return children
}
