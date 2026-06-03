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
import { WeatherTeaser } from "@/components/home/WeatherTeaser"
import WhatIBring from "@/components/home/WhatIBring"
import { PageShell } from "@/components/layout/PageShell"
import { GITHUB_URL, LINKEDIN_URL } from "@/config/navigation"
import { SITE_URL } from "@/lib/site"
import { absoluteUrl, pageMetadata } from "@/lib/site-metadata"
import { testimonials } from "@/lib/testimonials-data"

export const metadata: Metadata = pageMetadata({
  title: "Charan Deol — Product Engineer & Consultant",
  description:
    "Independent consultant bridging business and engineering. Product strategy, full-stack development, design systems, and technical leadership.",
  path: "/",
})

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
  image: absoluteUrl("/og-default.jpg"),
  sameAs: [GITHUB_URL, LINKEDIN_URL],
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
          <WeatherTeaser />
          <HowIThink />
          <HomeHowIWorkTeaser />
          <ProofMetrics />
          <Testimonials testimonials={testimonials} />
          <BlogTeaser />
          <NewsletterSignup variant="inline" />
          <CTABand />
        </div>
      </PageShell>
    </>
  )
}
