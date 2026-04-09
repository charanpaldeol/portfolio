import type { Metadata } from "next"
import BlogTeaser from "@/components/home/BlogTeaser"
import CTABand from "@/components/home/CTABand"
import EyeBreakTeaser from "@/components/home/EyeBreakTeaser"
import Hero from "@/components/home/Hero"
import ProofMetrics from "@/components/home/ProofMetrics"
import { PageShell } from "@/components/layout/PageShell"

export const metadata: Metadata = {
  title: "Charan Deol — Product Engineer & Consultant",
  description:
    "Independent consultant bridging business and engineering. Product strategy, full-stack development, design systems, and technical leadership.",
  alternates: { canonical: "https://cpdeol.com" },
  openGraph: {
    title: "Charan Deol — Product Engineer & Consultant",
    description:
      "Independent consultant bridging business and engineering. Product strategy, full-stack development, design systems, and technical leadership.",
    url: "https://cpdeol.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charan Deol — Product Engineer & Consultant",
    description:
      "Independent consultant bridging business and engineering. Product strategy, full-stack development, design systems, and technical leadership.",
  },
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Charan Deol",
  url: "https://cpdeol.com",
  jobTitle: "Independent Consultant",
  description:
    "Product engineer and independent consultant bridging business and engineering across B2B SaaS, fintech, and consumer apps.",
  knowsAbout: [
    "Product Strategy",
    "Full-Stack Engineering",
    "Design Systems",
    "Technical Leadership",
    "React",
    "Next.js",
    "TypeScript",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressCountry: "CA",
  },
  sameAs: ["https://cpdeol.com"],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <PageShell>
        <div className="space-y-14 md:space-y-20">
          <Hero />
          <ProofMetrics />
          <BlogTeaser />
          <EyeBreakTeaser />
          <CTABand />
        </div>
      </PageShell>
    </>
  )
}
