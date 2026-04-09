"use client"

import { motion } from "framer-motion"
import {
  ArrowRight,
  Check,
  CreditCard,
  Database,
  Info,
  MessageSquare,
  Network,
  PlusCircle,
  Router,
  Shield,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { type ReactNode, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

import { IO_EDITORIAL_HERO_IMAGE } from "./editorial-assets"

const SECTION_IDS = ["io-hero", "io-how-it-works", "io-impact", "io-incentives", "io-privacy", "io-adoption", "io-join"] as const

type SectionId = (typeof SECTION_IDS)[number]

type Props = {
  meshDiagram: ReactNode
  payoffDiagram: ReactNode
  earningsDiagram: ReactNode
}

function SidebarLink({
  icon,
  label,
  href,
  active = false,
}: {
  icon: ReactNode
  label: string
  href: string
  active?: boolean
}) {
  return (
    <a
      href={href}
      className={twMerge(
        "group flex items-center gap-3 rounded-xl p-3 text-sm transition-all",
        active ? "bg-primary/10 font-semibold text-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
      )}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span>{label}</span>
    </a>
  )
}

function FeatureItem({ color, title, description }: { color: string; title: string; description: string }) {
  return (
    <div className="relative pl-8">
      <div className={twMerge("absolute top-0 bottom-0 left-0 w-1 rounded-full", color)} />
      <h3 className="mb-3 text-xl font-medium text-on-surface">{title}</h3>
      <p className="leading-relaxed text-on-surface-variant">{description}</p>
    </div>
  )
}

function ComparisonItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="shrink-0">{icon}</span>
      <span>{text}</span>
    </li>
  )
}

function IncentiveCard({ icon, title, description, bgColor }: { icon: ReactNode; title: string; description: string; bgColor: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-8 shadow-editorial"
    >
      <div className={twMerge("mb-6 flex h-12 w-12 items-center justify-center rounded-xl", bgColor)}>{icon}</div>
      <h3 className="mb-2 text-lg font-medium text-on-surface">{title}</h3>
      <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>
    </motion.div>
  )
}

export function InternetOwnedEditorial({ meshDiagram, payoffDiagram, earningsDiagram }: Props) {
  const [activeId, setActiveId] = useState<SectionId>("io-hero")

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id as SectionId)
      },
      { rootMargin: "-20% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const isActive = (id: SectionId) => activeId === id

  return (
    <div className="internet-owned-editorial relative min-h-screen min-w-0 overflow-x-clip bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Page-local sub bar — desktop only; `top` must match global navbar height */}
      <div className="sticky top-[var(--site-header-offset)] z-50 hidden border-b border-outline-variant/10 bg-surface/95 shadow-editorial-float backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-surface/85 lg:block">
        <div className="mx-auto flex h-[var(--io-lens-bar-height)] max-w-6xl flex-nowrap items-center justify-center gap-2 overflow-x-auto px-4 md:justify-start md:gap-10 md:px-6 lg:pl-64">
          <span className="hidden shrink-0 text-xs font-semibold tracking-widest text-on-surface-variant uppercase md:inline">Lens</span>
          <a
            href="#io-how-it-works"
            className="shrink-0 whitespace-nowrap font-display text-sm font-semibold tracking-tight text-primary underline decoration-primary/40 decoration-2 underline-offset-4"
          >
            Network
          </a>
          <a
            href="#io-impact"
            className="shrink-0 whitespace-nowrap font-display text-sm tracking-tight text-on-surface-variant transition-colors hover:text-primary"
          >
            Economics
          </a>
          <a
            href="#io-adoption"
            className="shrink-0 whitespace-nowrap font-display text-sm tracking-tight text-on-surface-variant transition-colors hover:text-primary"
          >
            Governance
          </a>
        </div>
      </div>

      {/* Editorial sidebar — starts below navbar + lens bar so it never sits under the site header */}
      <aside className="fixed top-[calc(var(--site-header-offset)+var(--io-lens-bar-height))] left-0 z-40 hidden h-[calc(100dvh-var(--site-header-offset)-var(--io-lens-bar-height))] w-64 flex-col border-r border-outline-variant/10 bg-surface/95 pb-8 pl-6 pr-4 shadow-editorial-float backdrop-blur-xl supports-[backdrop-filter]:bg-surface/90 lg:flex">
        <div className="mb-8 px-2">
          <h2 className="font-display text-lg font-bold">Editorial portal</h2>
          <p className="mt-1 text-[10px] font-semibold tracking-widest text-on-surface-variant/80 uppercase">Decentralized insights</p>
        </div>
        <nav className="flex flex-col gap-1 pb-8">
          <SidebarLink icon={<Info size={18} />} label="Overview" href="#io-hero" active={isActive("io-hero")} />
          <SidebarLink icon={<Network size={18} />} label="How it works" href="#io-how-it-works" active={isActive("io-how-it-works")} />
          <SidebarLink icon={<CreditCard size={18} />} label="Cost comparison" href="#io-impact" active={isActive("io-impact")} />
          <SidebarLink icon={<TrendingUp size={18} />} label="Earning potential" href="#io-incentives" active={isActive("io-incentives")} />
        </nav>
      </aside>

      {/* Mobile section chips — no lens bar on small screens */}
      <div className="sticky top-[var(--site-header-offset)] z-50 flex gap-2 overflow-x-auto border-b border-outline-variant/10 bg-surface/95 px-4 py-3 shadow-editorial-float backdrop-blur-xl supports-[backdrop-filter]:bg-surface/90 lg:hidden">
        {[
          { href: "#io-hero", label: "Overview" },
          { href: "#io-how-it-works", label: "How it works" },
          { href: "#io-impact", label: "Costs" },
          { href: "#io-incentives", label: "Earn" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-on-surface-variant shadow-editorial outline outline-1 outline-outline-variant/10"
          >
            {item.label}
          </a>
        ))}
      </div>

      <main className="lg:ml-64">
        <header
          id="io-hero"
          className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden px-6 py-16 scroll-mt-32 md:px-12 md:py-24 lg:scroll-mt-36"
        >
          {/* Design photography: full-bleed hero atmosphere (same asset as architecture section) */}
          <Image
            src={IO_EDITORIAL_HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-cover object-center grayscale select-none"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-surface via-surface/92 to-surface/75"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-primary/[0.07] mix-blend-multiply" aria-hidden />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-4xl"
          >
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Community internet</p>
            <h1 className="font-display mb-8 text-5xl leading-[0.95] font-extrabold tracking-tighter text-on-surface md:text-7xl lg:text-8xl">
              Internet-Owned, <br />
              <span className="text-primary italic">Not Rented.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-2xl">
              An architectural shift in digital infrastructure. Build long-term resilience through decentralized local hardware nodes and
              community-driven connectivity — so access is not something you lose when a bill is missed.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#io-how-it-works"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container px-8 py-4 font-display text-lg font-bold text-primary-foreground shadow-editorial transition hover:brightness-[1.03] active:scale-[0.98]"
              >
                Explore the network
              </a>
              <a
                href="#io-impact"
                className="inline-flex items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container-low px-8 py-4 font-display text-lg font-bold text-on-surface transition hover:bg-surface-container"
              >
                See cost comparison
              </a>
            </div>
          </motion.div>
          <div className="pointer-events-none absolute top-1/2 -right-20 z-[2] h-[min(500px,80vw)] w-[min(500px,80vw)] -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" aria-hidden />
        </header>

        <section
          id="io-how-it-works"
          className="scroll-mt-32 bg-surface-container-low px-6 py-20 md:px-12 md:py-28 lg:scroll-mt-36"
        >
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Architecture</span>
            <h2 className="font-display mt-4 mb-6 text-4xl font-bold tracking-tight md:text-5xl">How it works</h2>
            <p className="max-w-2xl text-on-surface-variant md:text-lg">
              Mesh networks connect homes hop by hop. Early on, gateway nodes keep traditional internet as backup while the neighborhood
              mesh grows.
            </p>
          </div>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative aspect-video overflow-hidden rounded-2xl bg-surface-container-highest shadow-editorial-lg lg:col-span-7"
            >
              <Image
                src={IO_EDITORIAL_HERO_IMAGE}
                alt="Server and edge hardware representing decentralized infrastructure"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </motion.div>
            <div className="space-y-10 lg:col-span-5">
              <FeatureItem
                color="bg-tertiary"
                title="Mesh networking"
                description="Nodes communicate peer-to-peer; if one path fails, traffic reroutes across the neighborhood instead of a single hub."
              />
              <FeatureItem
                color="bg-primary"
                title="Local hardware nodes"
                description="Small, efficient units at home or work anchor the edge of the network and keep control physically close to the community."
              />
              <FeatureItem
                color="bg-secondary"
                title="Proof of connectivity"
                description="Incentives can align with uptime and bandwidth quality so people who keep the mesh healthy are recognized fairly."
              />
            </div>
          </div>
          <div className="mt-16">{meshDiagram}</div>
        </section>

        <section id="io-impact" className="scroll-mt-32 px-6 py-24 md:px-12 md:py-32 lg:scroll-mt-36">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="font-display text-4xl font-bold tracking-tight text-on-surface md:text-6xl">Own your hardware, own your freedom.</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-on-surface-variant">
                Traditional ISPs rent temporary access. Ownership turns the question into a durable asset — with a payoff window that
                shortens as monthly bills stop stacking.
              </p>
            </div>
            <div className="grid grid-cols-1 overflow-hidden rounded-3xl shadow-editorial-lg md:grid-cols-2">
              <div className="bg-surface-container-low p-10 md:p-12">
                <div className="mb-8 flex items-start justify-between">
                  <span className="text-xs font-semibold tracking-widest text-destructive uppercase">Traditional ISP</span>
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
                <h4 className="font-display mb-4 text-2xl font-bold">The rent trap</h4>
                <ul className="space-y-4 text-on-surface-variant">
                  <ComparisonItem icon={<X size={16} className="text-destructive" />} text="Monthly recurring liability" />
                  <ComparisonItem icon={<X size={16} className="text-destructive" />} text="Zero equity in infrastructure" />
                  <ComparisonItem icon={<X size={16} className="text-destructive" />} text="Traffic patterns monetized upstream" />
                </ul>
                <div className="mt-12 border-t border-outline-variant/10 pt-8">
                  <div className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Illustrative 10yr spend</div>
                  <div className="font-display mt-2 text-4xl font-extrabold text-on-surface">$12,000+</div>
                  <p className="mt-2 text-xs text-on-surface-variant">At ~$50/mo; varies by market.</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary to-primary-container p-10 text-primary-foreground md:p-12">
                <div className="mb-8 flex items-start justify-between">
                  <span className="text-xs font-semibold tracking-widest text-primary-foreground/80 uppercase">Internet-owned</span>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h4 className="font-display mb-4 text-2xl font-bold">Infrastructure asset</h4>
                <ul className="space-y-4 text-primary-foreground/90">
                  <ComparisonItem icon={<Check size={16} />} text="One-time hardware investment (typ. $1.5k–$3k)" />
                  <ComparisonItem icon={<Check size={16} />} text="Potential to offset costs via shared routing" />
                  <ComparisonItem icon={<Check size={16} />} text="Encrypted, local-first routing choices" />
                </ul>
                <div className="mt-12 border-t border-primary-foreground/20 pt-8">
                  <div className="text-xs font-semibold tracking-wider text-primary-foreground/70 uppercase">Illustrative upside*</div>
                  <div className="font-display mt-2 text-4xl font-extrabold">+$4,200*</div>
                  <p className="mt-2 text-xs text-primary-foreground/75">*Hypothetical editorial figure; not financial advice.</p>
                </div>
              </div>
            </div>
            <div className="mt-14">{payoffDiagram}</div>
          </div>
        </section>

        <section
          id="io-incentives"
          className="scroll-mt-32 bg-surface-container-highest px-6 py-20 md:px-12 md:py-28 lg:scroll-mt-36"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
            <div className="self-center lg:col-span-4">
              <h2 className="font-display mb-6 text-4xl font-bold tracking-tighter">Earn by sharing your network</h2>
              <p className="leading-relaxed text-on-surface-variant">
                When neighbors route data through your node, micropayments (on the order of cents per GB) can offset power and maintenance.
                Typical scenarios land around <strong className="text-on-surface">$15–$20/month</strong> with a handful of nearby households.
              </p>
              <a href="#io-impact" className="mt-8 inline-flex items-center font-display font-bold text-primary group">
                See payoff timeline
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8">
              <IncentiveCard
                icon={<Router className="text-secondary" />}
                title="Relay node"
                description="Provide local mesh relay to neighboring devices; compensation scales with useful throughput."
                bgColor="bg-secondary/15"
              />
              <IncentiveCard
                icon={<Database className="text-primary" />}
                title="Storage provider"
                description="Host encrypted shards where the model allows; can stack with relay earnings."
                bgColor="bg-primary/15"
              />
              <IncentiveCard
                icon={<ShieldCheck className="text-tertiary" />}
                title="Network validator"
                description="Participate in consensus or attestation where applicable to help secure routing and settlement."
                bgColor="bg-tertiary/15"
              />
              <IncentiveCard
                icon={<PlusCircle className="text-on-surface" />}
                title="Density bonus"
                description="Early nodes in underserved areas often carry more leverage for incentives as the mesh fills in."
                bgColor="bg-on-surface/5"
              />
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-7xl">{earningsDiagram}</div>
        </section>

        <section id="io-privacy" className="scroll-mt-32 px-6 py-24 md:px-12 md:py-32 lg:scroll-mt-36">
          <div className="mx-auto max-w-4xl text-center">
            <Shield className="mx-auto mb-8 h-16 w-16 text-primary" aria-hidden fill="currentColor" />
            <h2 className="font-display mb-6 text-4xl font-bold tracking-tight md:text-5xl">Privacy is a physical property, not a promise.</h2>
            <p className="font-sans text-xl leading-relaxed text-on-surface-variant">
              End-to-end encryption means intermediate routers move packets without reading them. Access and policy can stay close to the
              people using the network instead of a distant control plane.
            </p>
            <div className="mt-14 flex flex-wrap justify-center gap-8 text-on-surface-variant/70 transition-all md:gap-14">
              <span className="font-display text-xl font-bold tracking-tighter md:text-2xl">AES-256</span>
              <span className="font-display text-xl font-bold tracking-tighter md:text-2xl">ZK-PROOFS</span>
              <span className="font-display text-xl font-bold tracking-tighter md:text-2xl">P2P-CORE</span>
            </div>
          </div>
        </section>

        <section id="io-adoption" className="scroll-mt-32 bg-surface-container-low px-6 py-20 md:px-12 md:py-28 lg:scroll-mt-36">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 max-w-3xl">
              <span className="text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Roadmap</span>
              <h2 className="font-display mt-4 mb-6 text-3xl font-bold tracking-tight md:text-4xl">How we get there</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant">
                Adoption is gradual. A small number of homes act as gateways with traditional lines while the mesh grows. As participation
                increases, more local traffic stays local and dependence on centralized paths naturally shrinks.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  num: "01",
                  accent: "bg-tertiary",
                  title: "Seed nodes",
                  desc: "A handful of early adopters install mesh hardware. The first peer-to-peer links form within a block or two.",
                },
                {
                  num: "02",
                  accent: "bg-secondary",
                  title: "Gateway bridging",
                  desc: "Gateway homes retain traditional ISP lines as a fallback while the mesh gains density and redundancy.",
                },
                {
                  num: "03",
                  accent: "bg-primary",
                  title: "Local independence",
                  desc: "Local traffic routes entirely within the mesh. Dependency on centralized ISP paths steadily diminishes.",
                },
              ].map(({ num, accent, title, desc }) => (
                <div key={num} className="rounded-2xl bg-surface-container-lowest p-8 shadow-editorial">
                  <div className={twMerge("mb-5 h-1 w-10 rounded-full", accent)} />
                  <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-on-surface-variant/70 uppercase">{num}</p>
                  <h3 className="mb-3 text-xl font-medium text-on-surface">{title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="io-join" className="scroll-mt-32 px-6 py-20 md:px-12 md:py-24 lg:scroll-mt-36">
          <div className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-3xl bg-[#30302e] p-10 text-[#f3f0ed] shadow-editorial-lg md:flex-row md:p-16 lg:p-24">
            {/* Same editorial photo as abstract depth layer (design mock: blurred orb + imagery) */}
            <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden>
              <Image
                src={IO_EDITORIAL_HERO_IMAGE}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover object-right grayscale"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[#30302e]/85" aria-hidden />
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="font-display mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">Join the architectural revolution.</h2>
              <p className="mb-10 text-lg text-[#f3f0ed]/70">
                We&apos;re exploring this together — technical challenges, incentives, and real-world deployment. Bring questions and ideas.
              </p>
              <Link
                href="https://discord.gg/wRJTpGfApZ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-[#5865F2] px-10 py-5 font-display text-xl font-bold text-white shadow-editorial transition hover:bg-[#4752C4] active:scale-[0.98]"
              >
                <span>Join Discord community</span>
                <MessageSquare className="h-6 w-6" />
              </Link>
            </div>
            <div className="relative z-[5] hidden h-72 w-72 shrink-0 rounded-full border border-primary/30 bg-primary/25 blur-[100px] lg:block" aria-hidden />
          </div>
        </section>
      </main>
    </div>
  )
}
