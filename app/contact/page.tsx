import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"
import { pageMetadata } from "@/lib/site-metadata"

import ContactContent from "./ContactContent"

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Charan Deol. Available for product strategy, design systems, full-stack engineering, and technical leadership engagements.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <PageShell>
      <ContactContent />
    </PageShell>
  )
}
