import type { Metadata } from "next"
import type { ReactNode } from "react"

import { NOINDEX_ROBOTS, pageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = pageMetadata({
  title: "Calculator",
  description: "Quick arithmetic in the browser — add, subtract, multiply, and divide with a minimal keypad.",
  path: "/calculator",
  robots: NOINDEX_ROBOTS,
})

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children
}
