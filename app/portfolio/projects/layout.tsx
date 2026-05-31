import type { Metadata } from "next"
import type { ReactNode } from "react"

import { pageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = pageMetadata({
  title: "Portfolio Projects",
  description:
    "Detailed case studies across AI/ML, real-time systems, compliance, fintech, and cloud-native architecture with quantified outcomes.",
  path: "/portfolio/projects",
})

export default function PortfolioProjectsLayout({ children }: { children: ReactNode }) {
  return children
}
