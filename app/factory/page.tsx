import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

import { FactoryContent } from "./FactoryContent"

export const metadata: Metadata = {
  title: "Factory",
  description: "What the factory is, what it does, and how to use it.",
  alternates: { canonical: "https://cpdeol.com/factory" },
}

export default function FactoryPage() {
  return (
    <PageShell>
      <FactoryContent />
    </PageShell>
  )
}

