import type { Metadata } from "next"
import type { ReactNode } from "react"

import { pageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = pageMetadata({
  title: "How I Work",
  description:
    "Delivery methodology from discovery through value — stakeholder interviews, requirements, architecture, iterative execution, adoption, and KPI tracking.",
  path: "/how-i-work",
})

export default function HowIWorkLayout({ children }: { children: ReactNode }) {
  return children
}
