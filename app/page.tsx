import BlogTeaser from "@/components/home/BlogTeaser"
import CTABand from "@/components/home/CTABand"
import Hero from "@/components/home/Hero"
import HowIThink from "@/components/home/HowIThink"
import HowIWork from "@/components/home/HowIWork"
import ProofMetrics from "@/components/home/ProofMetrics"
import ToolsAndMethods from "@/components/home/ToolsAndMethods"
import WhatIBring from "@/components/home/WhatIBring"

export default function Home() {
  return (
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
      <CTABand />
    </div>
  )
}
