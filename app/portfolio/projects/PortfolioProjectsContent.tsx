"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { portfolioHoverTints } from "@/lib/portfolio-hover-tints"
import { projects } from "@/lib/projects-data"
import { cn } from "@/lib/utils"

const outcomeStats = [
  {
    value: "99.9%+",
    valueClass: "text-primary",
    label: "Reliability mindset",
    body: "Architecture and delivery patterns aimed at enterprise-grade uptime across payments, streaming, and regulated workloads.",
    cardClass: "bg-surface-container-lowest",
  },
  {
    value: "100M+",
    valueClass: "text-tertiary",
    label: "Events per day",
    body: "Event-driven pipelines and audit-grade logs designed for massive throughput without sacrificing traceability.",
    cardClass: "bg-surface-container-lowest",
  },
  {
    value: "<100ms",
    valueClass: "text-secondary",
    label: "Real-time decisions",
    body: "Streaming ML, fraud scoring, and settlement paths where latency and precision directly impact revenue and risk.",
    cardClass: "bg-surface-container-lowest",
  },
  {
    value: String(projects.length),
    valueClass: "text-on-surface",
    label: "Published case studies",
    body: "Each write-up covers problem framing, solution approach, metrics, and the stack — end to end.",
    cardClass: "bg-surface-container shadow-editorial",
  },
] as const

type Filter = "All" | (typeof projects)[number]["category"]

function ProjectsHero({ caseStudyCount }: { caseStudyCount: number }) {
  return (
    <div className="mb-16 md:mb-20">
      <EditorialPageHero
        eyebrow={`Portfolio · ${caseStudyCount} case studies`}
        title={
          <>
            Selected <span className="text-editorial-gradient">projects.</span>
          </>
        }
        description="Product decisions, technical depth, and measurable outcomes across AI/ML, real-time systems, compliance, and cloud-native architecture — curated as full case studies you can read in depth."
      />
    </div>
  )
}

export default function PortfolioProjectsContent() {
  const [active, setActive] = useState<Filter>("All")
  const categories = Array.from(new Set(projects.map((p) => p.category))) as string[]
  const filterButtons = ["All", ...categories] as const
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active)

  return (
    <>
      <ProjectsHero caseStudyCount={projects.length} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="mb-14 flex flex-wrap gap-2 md:mb-20"
        role="toolbar"
        aria-label="Filter projects by category"
      >
        {filterButtons.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200",
              active === f
                ? "bg-primary-fixed text-on-primary-fixed"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
            )}
          >
            {f}
          </button>
        ))}
      </motion.div>

      <section aria-label="Project gallery" className="mb-24 md:mb-32">
        <div className="grid grid-cols-1 gap-y-20 gap-x-12 md:grid-cols-2 md:gap-y-24">
          {filtered.map((project, i) => (
            <motion.article
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + i * 0.05, duration: 0.4 }}
              className={cn("group", i % 2 === 1 && "md:mt-32")}
            >
              <Link href={`/portfolio/projects/${project.slug}`} className="block cursor-pointer">
                <div
                  className={cn(
                    "relative mb-8 aspect-[16/10] overflow-hidden rounded-xl bg-surface-container transition-transform duration-500",
                    "group-hover:-translate-y-2",
                  )}
                >
                  <Image
                    src={project.coverImage}
                    alt={project.coverImageAlt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                    priority={i < 2}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                      portfolioHoverTints[i % 3],
                    )}
                    aria-hidden
                  />
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {project.category}
                  </span>
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display mb-4 text-2xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary md:text-3xl">
                  {project.title}
                </h2>
                <p className="mb-6 max-w-lg leading-relaxed text-on-surface-variant">{project.shortDescription}</p>
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-primary underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-primary">
                  View case study
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-sm text-on-surface-variant">No projects in this category yet.</p>
        ) : null}
      </section>

      <section className="-mx-6 bg-surface-container-low py-24 md:-mx-14 md:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 md:px-14">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="font-display mb-6 text-3xl font-extrabold leading-tight tracking-tighter text-on-surface md:text-4xl">
                Engineering outcomes that matter.
              </h2>
              <div className="h-1.5 w-16 bg-primary" aria-hidden />
            </div>
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:col-span-2 md:gap-16">
              {outcomeStats.map((stat) => (
                <div
                  key={stat.label}
                  className={cn("rounded-xl p-8", stat.cardClass)}
                >
                  <div className={cn("mb-2 text-4xl font-black tracking-tight md:text-5xl", stat.valueClass)}>
                    {stat.value}
                  </div>
                  <div className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                    {stat.label}
                  </div>
                  <p className="leading-relaxed text-on-surface-variant">{stat.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 text-center md:mt-28">
        <div className="flex flex-col items-center rounded-xl bg-primary px-8 py-20 md:py-24">
          <h2 className="font-display mx-auto mb-8 max-w-2xl text-3xl font-extrabold leading-tight tracking-tighter text-on-primary md:text-4xl lg:text-5xl">
            Ready to stress-test the next architecture or delivery plan?
          </h2>
          <Link
            href="/contact"
            className="rounded-lg bg-surface px-10 py-4 text-lg font-bold tracking-tight text-primary transition-all hover:bg-surface-container active:scale-[0.98]"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  )
}
