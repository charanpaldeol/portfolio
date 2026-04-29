import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

import HowIUseAIContent from "./HowIUseAIContent"

export const metadata: Metadata = {
  title: "How I Use AI | Charan Pal Deol",
  description:
    "A behind-the-scenes look at how AI tools integrate into product design workflows — from research synthesis to prototype code.",
}

export default function HowIUseAIPage() {
  return (
    <PageShell>
      <HowIUseAIContent />
    </PageShell>
  )
}
