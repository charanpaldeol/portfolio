import type { Metadata } from "next"

import ContactContent from "./ContactContent"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Charan Deol. Available for product strategy, design systems, full-stack engineering, and technical leadership engagements.",
  alternates: { canonical: "https://cpdeol.com/contact" },
  openGraph: {
    title: "Contact — Charan Deol",
    description:
      "Get in touch with Charan Deol. Available for product strategy, design systems, full-stack engineering, and technical leadership engagements.",
    url: "https://cpdeol.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Charan Deol",
    description:
      "Get in touch with Charan Deol. Available for product strategy, design systems, full-stack engineering, and technical leadership engagements.",
  },
}

export default function ContactPage() {
  return <ContactContent />
}
