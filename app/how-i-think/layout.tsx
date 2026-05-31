import type { Metadata } from "next"
import type { ReactNode } from "react"

import { pageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = pageMetadata({
  title: "How I Think",
  description:
    "Principles for navigating ambiguity, reducing rework, and keeping delivery tethered to measurable outcomes.",
  path: "/how-i-think",
})

export default function HowIThinkLayout({ children }: { children: ReactNode }) {
  return children
}
