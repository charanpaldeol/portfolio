import type { Metadata } from "next"
import BlogTeaser from "@/components/home/BlogTeaser"
import CTABand from "@/components/home/CTABand"
import Hero from "@/components/home/Hero"
import HomeHowIWorkTeaser from "@/components/home/HomeHowIWorkTeaser"
import HomeJumpNav from "@/components/home/HomeJumpNav"
import HowIThink from "@/components/home/HowIThink"
import { NewsletterSignup } from "@/components/home/NewsletterSignup"
import ProofMetrics from "@/components/home/ProofMetrics"
import { Testimonials } from "@/components/home/Testimonials"
import WhatIBring from "@/components/home/WhatIBring"
import { PageShell } from "@/components/layout/PageShell"
import { GITHUB_URL, LINKEDIN_URL } from "@/config/navigation"
import { SITE_URL } from "@/lib/site"
import { testimonials } from "@/lib/testimonials-data"

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
  url: SITE_URL,
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
  sameAs: [SITE_URL, GITHUB_URL, LINKEDIN_URL],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <PageShell>
        <div className="space-y-16 md:space-y-24">
          <div className="space-y-5 md:space-y-6">
            <Hero />
            <HomeJumpNav />
          </div>
          <WhatIBring />
          <ProofMetrics />
          <Testimonials testimonials={testimonials} />
          <HomeHowIWorkTeaser />
          <HowIThink />
          <BlogTeaser />
          <NewsletterSignup variant="inline" />
          <CTABand />
        </div>
      </PageShell>
    </>
  )
}
