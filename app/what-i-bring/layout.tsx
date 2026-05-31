import type { Metadata } from "next"
import type { ReactNode } from "react"

import { pageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = pageMetadata({
  title: "What I Bring",
  description:
    "Service ecosystem from problem framing and solution design through AI-native delivery, engineering depth, and value realization.",
  path: "/what-i-bring",
})

export default function WhatIBringLayout({ children }: { children: ReactNode }) {
  return children
}
