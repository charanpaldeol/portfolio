import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"
import { pageMetadata } from "@/lib/site-metadata"

import HowIUseAIContent from "./HowIUseAIContent"

export const metadata: Metadata = pageMetadata({
  title: "How I Use AI",
  description:
    "A behind-the-scenes look at how AI tools integrate into product design workflows — from research synthesis to prototype code.",
  path: "/how-i-use-ai",
})

export default function HowIUseAIPage() {
  return (
    <PageShell>
      <HowIUseAIContent />
    </PageShell>
  )
}
