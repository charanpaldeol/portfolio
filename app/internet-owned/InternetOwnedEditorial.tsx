"use client"

import { LayoutGroup, motion } from "framer-motion"
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
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

import { IO_EDITORIAL_HERO_IMAGE } from "./editorial-assets"

const SECTION_IDS = ["io-hero", "io-how-it-works", "io-impact", "io-incentives", "io-privacy", "io-adoption", "io-join"] as const

type SectionId = (typeof SECTION_IDS)[number]

/** Sections that appear in the sticky sidebar (subset of SECTION_IDS, document order). */
const SIDEBAR_NAV_IDS = ["io-hero", "io-how-it-works", "io-impact", "io-incentives"] as const

type SidebarNavId = (typeof SIDEBAR_NAV_IDS)[number]

function parseHeaderOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--site-header-offset").trim()
  const rootFs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  if (raw.endsWith("rem")) return parseFloat(raw) * rootFs
  if (raw.endsWith("px")) return parseFloat(raw)
  return 3.75 * 16
}

/** Reading line (viewport px from top): last section whose top is ≤ this line is active — stable for short sections like “How it works”. */
function getActivationViewportY(): number {
  if (typeof window === "undefined") return 96
  const band = Math.min(56, Math.max(28, Math.round(window.innerHeight * 0.12)))
  return parseHeaderOffsetPx() + band
}

function computeActiveSectionFromScroll(): SectionId {
  const y = getActivationViewportY()
  let active: SectionId = SECTION_IDS[0]
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = el.getBoundingClientRect().top
    if (top <= y) active = id
  }

  const doc = document.documentElement
  const scrollBottom = window.scrollY + window.innerHeight
  const maxScroll = doc.scrollHeight - window.innerHeight
  const lastId = SECTION_IDS[SECTION_IDS.length - 1]
  if (lastId && maxScroll > 0 && scrollBottom >= maxScroll - 48) {
    active = lastId
  }

  return active
}

function toSidebarHighlight(scrollActive: SectionId): SidebarNavId {
  const nav = new Set<string>(SIDEBAR_NAV_IDS)
  if (nav.has(scrollActive)) return scrollActive as SidebarNavId
  const idx = SECTION_IDS.indexOf(scrollActive)
  for (let i = idx; i >= 0; i--) {
    const id = SECTION_IDS[i]!
    if (nav.has(id)) return id as SidebarNavId
  }
  return "io-hero"
}

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
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 font-sans text-sm transition-colors duration-200",
        active ? "z-[1] font-semibold text-primary" : "font-normal text-on-surface-variant hover:bg-surface-container-low/80 hover:text-on-surface"
      )}
    >
      {active ? (
        <motion.span
          layoutId="io-editorial-nav-pill"
          className="absolute inset-0 rounded-2xl bg-primary/10 ring-1 ring-primary/15"
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.72 }}
        />
      ) : null}
      <span className="relative shrink-0 transition-transform group-hover:scale-110">{icon}</span>
      <span className="relative min-w-0 break-words">{label}</span>
    </a>
  )
}

function FeatureItem({ color, title, description }: { color: string; title: string; description: string }) {
  return (
    <div className="relative pl-9">
      <div className={cn("absolute top-0.5 bottom-0.5 left-0 w-1 rounded-full", color)} aria-hidden />
      <h3 className="mb-3 font-sans text-xl font-medium tracking-normal text-on-surface">{title}</h3>
      <p className="font-sans font-normal leading-[1.7] text-on-surface-variant">{description}</p>
    </div>
  )
}

function ComparisonItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <li className="flex min-w-0 items-center gap-3 font-sans font-normal leading-[1.65]">
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 break-words">{text}</span>
    </li>
  )
}

function IncentiveCard({ icon, title, description, bgColor }: { icon: ReactNode; title: string; description: string; bgColor: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-surface-container-low p-9 shadow-editorial md:p-10"
    >
      <div className={cn("mb-6 flex h-12 w-12 items-center justify-center rounded-xl", bgColor)}>{icon}</div>
      <h3 className="mb-2 font-sans text-lg font-medium tracking-normal text-on-surface">{title}</h3>
      <p className="font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">{description}</p>
    </motion.div>
  )
}

export function InternetOwnedEditorial({ meshDiagram, payoffDiagram, earningsDiagram }: Props) {
  const [scrollSectionId, setScrollSectionId] = useState<SectionId>("io-hero")
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = () => {
      rafRef.current = null
      const next = computeActiveSectionFromScroll()
      setScrollSectionId((prev) => (prev === next ? prev : next))
    }

    const schedule = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(tick)
    }

    tick()
    requestAnimationFrame(() => tick())
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const sidebarActiveId = useMemo(() => toSidebarHighlight(scrollSectionId), [scrollSectionId])

  const isNavActive = (id: SidebarNavId) => sidebarActiveId === id

  return (
    <div className="internet-owned-editorial relative min-w-0 text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="grid min-h-0 grid-cols-1 gap-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-stretch lg:gap-8">
        {/* Tall grid cell + inner sticky aside so the rail scrolls with the document, then pins under the site header */}
        <div className="relative z-10 hidden min-h-0 min-w-0 self-stretch border-r border-outline-variant/15 bg-surface shadow-editorial-float lg:block">
          <aside className="sticky top-[var(--site-header-offset)] z-30 flex w-full min-w-0 flex-col py-10 pl-1 pr-5 [backface-visibility:hidden]">
            <div className="mb-10 px-1">
              <h2 className="font-sans text-lg font-medium tracking-normal text-on-surface">Editorial portal</h2>
              <p className="mt-2 font-sans text-xs font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
                Decentralized insights
              </p>
            </div>
            <LayoutGroup id="io-editorial-sidebar-nav">
              <nav className="flex flex-col gap-1.5 pb-3">
                <SidebarLink icon={<Info size={18} />} label="Overview" href="#io-hero" active={isNavActive("io-hero")} />
                <SidebarLink icon={<Network size={18} />} label="How it works" href="#io-how-it-works" active={isNavActive("io-how-it-works")} />
                <SidebarLink icon={<CreditCard size={18} />} label="Cost comparison" href="#io-impact" active={isNavActive("io-impact")} />
                <SidebarLink icon={<TrendingUp size={18} />} label="Earning potential" href="#io-incentives" active={isNavActive("io-incentives")} />
              </nav>
            </LayoutGroup>
          </aside>
        </div>

        <article
          className="io-editorial-main relative z-0 isolate flex min-w-0 flex-col gap-6 md:gap-8 lg:gap-10"
          aria-label="Internet Owned article"
        >
        <header
          id="io-hero"
          className="relative flex min-h-[min(32rem,72dvh)] scroll-mt-32 flex-col justify-center overflow-hidden rounded-2xl bg-surface-container-low px-6 py-20 shadow-editorial md:min-h-[min(36rem,76dvh)] md:px-12 md:py-28 lg:scroll-mt-36"
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
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-surface via-surface/93 to-surface-container-low/40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tr from-transparent via-primary/[0.04] to-primary-container/[0.08]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-primary/[0.05] mix-blend-multiply" aria-hidden />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 w-full max-w-4xl"
          >
            <p className="mb-5 font-sans text-xs font-semibold tracking-[0.22em] text-tertiary uppercase">Community internet</p>
            <h1 className="text-display mb-10 text-5xl leading-[0.98] text-on-surface md:mb-12 md:text-7xl lg:text-8xl">
              Internet-Owned, <br />
              <span className="text-primary italic">Not Rented.</span>
            </h1>
            <p className="max-w-2xl font-sans text-lg font-normal leading-[1.7] text-on-surface-variant md:text-xl md:leading-[1.75]">
              An architectural shift in digital infrastructure. Build long-term resilience through decentralized local hardware nodes and
              community-driven connectivity — so access is not something you lose when a bill is missed.
            </p>
            <div className="mt-12 flex flex-wrap gap-4 md:mt-14 md:gap-5">
              <a
                href="#io-how-it-works"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-container px-8 py-4 font-sans text-lg font-semibold text-primary-foreground shadow-editorial transition hover:brightness-[1.03] active:scale-[0.98]"
              >
                Explore the network
              </a>
              <a
                href="#io-impact"
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant/15 bg-surface-container-low px-8 py-4 font-sans text-lg font-semibold text-on-surface transition hover:bg-surface-container"
              >
                See cost comparison
              </a>
            </div>
          </motion.div>
          <div className="pointer-events-none absolute top-1/2 -right-20 z-[2] h-[min(500px,80vw)] w-[min(500px,80vw)] -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" aria-hidden />
        </header>

        <section
          id="io-how-it-works"
          className="scroll-mt-32 rounded-2xl bg-surface-container-low px-6 py-20 shadow-editorial md:px-12 md:py-28 lg:scroll-mt-36"
        >
          <div className="mb-16 md:mb-20">
            <span className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Architecture</span>
            <h2 className="font-display mt-5 mb-8 text-4xl font-bold tracking-tight md:text-5xl">How it works</h2>
            <p className="max-w-2xl font-sans font-normal text-base leading-[1.7] text-on-surface-variant md:text-lg md:leading-[1.75]">
              Mesh networks connect homes hop by hop. Early on, gateway nodes keep traditional internet as backup while the neighborhood
              mesh grows.
            </p>
          </div>
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative aspect-video overflow-hidden rounded-2xl bg-surface-container-highest shadow-editorial lg:col-span-7"
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
            <div className="space-y-12 lg:col-span-5">
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
          <div className="mt-20 md:mt-24">{meshDiagram}</div>
        </section>

        <section
          id="io-impact"
          className="scroll-mt-32 rounded-2xl bg-surface-container-low px-6 py-20 shadow-editorial md:px-12 md:py-28 lg:scroll-mt-36"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-20 text-center md:mb-24">
              <h2 className="font-display text-4xl font-bold tracking-tight text-on-surface md:text-6xl">Own your hardware, own your freedom.</h2>
              <p className="mx-auto mt-8 max-w-2xl font-sans text-lg font-normal leading-[1.7] text-on-surface-variant md:text-xl md:leading-[1.75]">
                Traditional ISPs rent temporary access. Ownership turns the question into a durable asset — with a payoff window that
                shortens as monthly bills stop stacking.
              </p>
            </div>
            <div className="flex flex-col overflow-hidden rounded-2xl shadow-editorial md:flex-row">
              <div className="min-w-0 flex-1 basis-0 bg-surface-container-low p-10 md:p-14">
                <div className="mb-10 flex items-start justify-between">
                  <span className="font-sans text-xs font-semibold tracking-widest text-destructive uppercase">Traditional ISP</span>
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
                <h4 className="mb-5 font-sans text-2xl font-medium tracking-normal text-on-surface">The rent trap</h4>
                <ul className="space-y-5 text-on-surface-variant">
                  <ComparisonItem icon={<X size={16} className="text-destructive" />} text="Monthly recurring liability" />
                  <ComparisonItem icon={<X size={16} className="text-destructive" />} text="Zero equity in infrastructure" />
                  <ComparisonItem icon={<X size={16} className="text-destructive" />} text="Traffic patterns monetized upstream" />
                </ul>
                <div className="mt-16 rounded-2xl bg-surface-container-lowest/80 px-5 py-7 md:mt-20 md:px-6 md:py-8">
                  <div className="font-sans text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Illustrative 10yr spend</div>
                  <div className="text-display mt-3 text-4xl tracking-tight text-on-surface">$12,000+</div>
                  <p className="mt-3 font-sans text-xs font-normal leading-relaxed text-on-surface-variant">At ~$50/mo; varies by market.</p>
                </div>
              </div>
              <div className="min-w-0 flex-1 basis-0 bg-gradient-to-br from-primary to-primary-container p-10 text-primary-foreground md:p-14">
                <div className="mb-10 flex items-start justify-between">
                  <span className="font-sans text-xs font-semibold tracking-widest text-primary-foreground/80 uppercase">Internet-owned</span>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h4 className="mb-5 font-sans text-2xl font-medium tracking-normal text-primary-foreground">Infrastructure asset</h4>
                <ul className="space-y-5 text-primary-foreground/90">
                  <ComparisonItem icon={<Check size={16} />} text="One-time hardware investment (typ. $1.5k–$3k)" />
                  <ComparisonItem icon={<Check size={16} />} text="Potential to offset costs via shared routing" />
                  <ComparisonItem icon={<Check size={16} />} text="Encrypted, local-first routing choices" />
                </ul>
                <div className="mt-16 rounded-2xl bg-primary-foreground/[0.12] px-5 py-7 md:mt-20 md:px-6 md:py-8">
                  <div className="font-sans text-xs font-semibold tracking-wider text-primary-foreground/80 uppercase">Illustrative upside*</div>
                  <div className="text-display mt-3 text-4xl tracking-tight text-primary-foreground">+$4,200*</div>
                  <p className="mt-3 font-sans text-xs font-normal leading-relaxed text-primary-foreground/75">
                    *Hypothetical editorial figure; not financial advice.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-20 md:mt-24">{payoffDiagram}</div>
          </div>
        </section>

        <section
          id="io-incentives"
          className="scroll-mt-32 rounded-2xl bg-surface-container-highest px-6 py-20 shadow-editorial md:px-12 md:py-28 lg:scroll-mt-36"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="self-center lg:col-span-4">
              <h2 className="font-display mb-8 text-4xl font-bold tracking-tighter">Earn by sharing your network</h2>
              <p className="font-sans text-base font-normal leading-[1.7] text-on-surface-variant md:text-lg md:leading-[1.75]">
                When neighbors route data through your node, micropayments (on the order of cents per GB) can offset power and maintenance.
                Typical scenarios land around <strong className="font-semibold text-on-surface">$15–$20/month</strong> with a handful of nearby
                households.
              </p>
              <a
                href="#io-impact"
                className="group mt-10 inline-flex items-center font-sans font-semibold text-primary underline-offset-[0.2em] hover:underline"
              >
                See payoff timeline
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-8 lg:col-span-8">
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
          <div className="mx-auto mt-20 max-w-7xl md:mt-24">{earningsDiagram}</div>
        </section>

        <section
          id="io-privacy"
          className="scroll-mt-32 rounded-2xl bg-surface-container-highest px-6 py-20 shadow-editorial md:px-12 md:py-28 lg:scroll-mt-36"
        >
          <div className="mx-auto max-w-4xl text-center">
            <Shield className="mx-auto mb-10 h-16 w-16 text-primary md:mb-12" aria-hidden fill="currentColor" />
            <h2 className="font-display mb-8 text-4xl font-bold tracking-tight md:text-5xl">Privacy is a physical property, not a promise.</h2>
            <p className="font-sans text-lg font-normal leading-[1.7] text-on-surface-variant md:text-xl md:leading-[1.75]">
              End-to-end encryption means intermediate routers move packets without reading them. Access and policy can stay close to the
              people using the network instead of a distant control plane.
            </p>
            <div className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4 md:mt-20 md:gap-x-16">
              <span className="font-sans text-sm font-semibold tracking-[0.2em] text-tertiary uppercase md:text-base">AES-256</span>
              <span className="font-sans text-sm font-semibold tracking-[0.2em] text-tertiary uppercase md:text-base">ZK-PROOFS</span>
              <span className="font-sans text-sm font-semibold tracking-[0.2em] text-tertiary uppercase md:text-base">P2P-CORE</span>
            </div>
          </div>
        </section>

        <section id="io-adoption" className="scroll-mt-32 rounded-2xl bg-surface-container-low px-6 py-20 shadow-editorial md:px-12 md:py-28 lg:scroll-mt-36">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 max-w-3xl md:mb-20">
              <span className="font-sans text-xs font-semibold tracking-[0.2em] text-tertiary uppercase">Roadmap</span>
              <h2 className="font-display mt-5 mb-8 text-3xl font-bold tracking-tight md:text-4xl">How we get there</h2>
              <p className="font-sans text-lg font-normal leading-[1.7] text-on-surface-variant md:leading-[1.75]">
                Adoption is gradual. A small number of homes act as gateways with traditional lines while the mesh grows. As participation
                increases, more local traffic stays local and dependence on centralized paths naturally shrinks.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
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
                <div key={num} className="rounded-2xl bg-surface-container-lowest p-9 shadow-editorial md:p-10">
                  <div className={cn("mb-6 h-1 w-10 rounded-full", accent)} />
                  <p className="mb-4 font-sans text-xs font-semibold tracking-[0.15em] text-on-surface-variant uppercase">{num}</p>
                  <h3 className="mb-4 font-sans text-xl font-medium tracking-normal text-on-surface">{title}</h3>
                  <p className="font-sans text-sm font-normal leading-[1.7] text-on-surface-variant">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="io-join" className="scroll-mt-32 lg:scroll-mt-36">
          <div className="relative flex flex-col items-center justify-between gap-12 overflow-hidden rounded-2xl bg-on-surface px-6 py-14 text-primary-foreground shadow-editorial md:flex-row md:gap-14 md:px-12 md:py-20 lg:px-12 lg:py-24">
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
            <div className="pointer-events-none absolute inset-0 bg-on-surface/85" aria-hidden />
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="font-display mb-8 text-4xl font-bold tracking-tighter text-primary-foreground md:mb-10 md:text-5xl lg:text-6xl">
                Join the architectural revolution.
              </h2>
              <p className="mb-12 font-sans text-lg font-normal leading-[1.7] text-primary-foreground/75 md:text-xl md:leading-[1.75]">
                We&apos;re exploring this together — technical challenges, incentives, and real-world deployment. Bring questions and ideas.
              </p>
              <Link
                href="https://discord.gg/wRJTpGfApZ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-[#5865F2] px-10 py-5 font-sans text-xl font-semibold text-white shadow-editorial transition hover:bg-[#4752C4] active:scale-[0.98]"
              >
                <span>Join Discord community</span>
                <MessageSquare className="h-6 w-6" />
              </Link>
            </div>
            <div className="relative z-[5] hidden h-72 w-72 shrink-0 rounded-full border border-primary/30 bg-primary/25 blur-[100px] lg:block" aria-hidden />
          </div>
        </section>
        </article>
      </div>
    </div>
  )
}
