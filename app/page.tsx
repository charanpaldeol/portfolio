import BlogTeaser from "@/components/home/BlogTeaser"
import CTABand from "@/components/home/CTABand"
import Footer from "@/components/home/Footer"
import Hero from "@/components/home/Hero"
import HowIThink from "@/components/home/HowIThink"
import HowIWork from "@/components/home/HowIWork"
import Navbar from "@/components/home/Navbar"
import ProofMetrics from "@/components/home/ProofMetrics"
import ToolsAndMethods from "@/components/home/ToolsAndMethods"
import WhatIBring from "@/components/home/WhatIBring"

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <Navbar />
      <Hero />
      <div className="border-t border-border my-12" />
      <ProofMetrics />
      <div className="border-t border-border my-12" />
      <HowIWork />
      <div className="border-t border-border my-12" />
      <WhatIBring />
      <div className="border-t border-border my-12" />
      <HowIThink />
      <div className="border-t border-border my-12" />
      <ToolsAndMethods />
      <div className="border-t border-border my-12" />
      <BlogTeaser />
      <div className="border-t border-border my-12" />
      <CTABand />
      <Footer />
    </main>
  )
}
