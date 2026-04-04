import type { Metadata } from "next"
import BlogTeaser from "@/components/home/BlogTeaser"
import CTABand from "@/components/home/CTABand"
import EyeBreakTeaser from "@/components/home/EyeBreakTeaser"
import Hero from "@/components/home/Hero"
import HowIThink from "@/components/home/HowIThink"
import HowIWork from "@/components/home/HowIWork"
import ProofMetrics from "@/components/home/ProofMetrics"
import ToolsAndMethods from "@/components/home/ToolsAndMethods"
import WhatIBring from "@/components/home/WhatIBring"

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
    <div className="space-y-0">
      <Hero />
      <div className="my-12 border-t border-slate-200" />
      <ProofMetrics />
      <div className="my-12 border-t border-slate-200" />
      <HowIWork />
      <div className="my-12 border-t border-slate-200" />
      <WhatIBring />
      <div className="my-12 border-t border-slate-200" />
      <HowIThink />
      <div className="my-12 border-t border-slate-200" />
      <ToolsAndMethods />
      <div className="my-12 border-t border-slate-200" />
      <BlogTeaser />
      <div className="my-12 border-t border-slate-200" />
      <EyeBreakTeaser />
      <div className="my-12 border-t border-slate-200" />
      <CTABand />
    </div>
    </>
  )
}
