import type { Metadata } from "next"
import type { ReactNode } from "react"

import { pageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = pageMetadata({
  title: "Tools & Methods",
  description:
    "Toolkit and approaches for LLM integration, solution architecture, stakeholder workshops, and board-ready reporting across every delivery phase.",
  path: "/tools-and-methods",
})

export default function ToolsAndMethodsLayout({ children }: { children: ReactNode }) {
  return children
}
