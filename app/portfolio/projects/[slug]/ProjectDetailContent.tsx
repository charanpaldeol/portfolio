"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

import { editorialGradientLastWord, EditorialPageHero } from "@/components/portfolio/EditorialPageHero"
import { ProjectImpactStrip } from "@/components/portfolio/project-detail/ProjectImpactStrip"
import type { ProjectData } from "@/lib/projects-data"
import { cn } from "@/lib/utils"

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl">{children}</h2>
  )
}

export default function ProjectDetailContent({ project }: { project: ProjectData }) {
  return (
    <article className="max-w-4xl space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <Link
          href="/portfolio/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-container"
        >
          <span>← Back to Projects</span>
        </Link>

        <EditorialPageHero
          eyebrow={project.category}
          title={editorialGradientLastWord(project.title)}
          description={project.tagline}
        />

        <ProjectImpactStrip impactMetrics={project.impactMetrics} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="flex flex-col gap-4 rounded-2xl bg-surface-container-low px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8 md:py-6"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Role</p>
            <p className="mt-1 text-base font-semibold text-on-surface">{project.role}</p>
          </div>
          <div className="md:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Timeline</p>
            <p className="mt-1 text-base font-semibold text-on-surface">{project.timeline}</p>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl md:h-20 md:w-20 md:text-5xl",
              project.accent,
            )}
            aria-hidden
          >
            {project.icon}
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-container-lowest px-3 py-1.5 text-xs font-medium text-on-surface-variant md:px-4 md:py-2 md:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-12 rounded-2xl bg-surface-container-low px-5 py-10 md:px-10 md:py-12"
      >
        <section className="space-y-4">
          <SectionTitle>The Problem</SectionTitle>
          <p className="text-base leading-relaxed text-on-surface-variant">{project.problem}</p>
        </section>

        <section className="space-y-4">
          <SectionTitle>My Contribution</SectionTitle>
          <p className="text-base leading-relaxed text-on-surface-variant">{project.myRole}</p>
        </section>

        {project.processSteps && project.processSteps.length > 0 ? (
          <section className="space-y-6">
            <SectionTitle>Process</SectionTitle>
            <ol className="space-y-4">
              {project.processSteps.map((step, idx) => (
                <li
                  key={step.phase}
                  className="flex gap-4 rounded-xl bg-surface-container-lowest p-5 md:gap-5 md:p-6"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-sm font-bold text-on-primary-fixed"
                    aria-hidden
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-on-surface">{step.phase}</h3>
                    <p className="mt-2 text-base leading-relaxed text-on-surface-variant">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="space-y-4">
          <SectionTitle>The Solution</SectionTitle>
          <p className="text-base leading-relaxed text-on-surface-variant">{project.solution}</p>
        </section>

        <section className="space-y-4">
          <SectionTitle>Results</SectionTitle>
          <ul className="space-y-3">
            {project.metrics.map((line) => (
              <li key={line} className="flex gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 md:px-5 md:py-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span className="text-base leading-relaxed text-on-surface-variant">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {project.keyLearning ? (
          <figure className="relative overflow-hidden rounded-r-2xl bg-surface-container-lowest pl-5 pr-6 py-8 md:pl-7 md:pr-10 md:py-10">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary" aria-hidden />
            <figcaption className="sr-only">Key learning</figcaption>
            <blockquote className="font-display text-2xl font-bold leading-snug tracking-tight text-on-surface md:text-4xl">
              {project.keyLearning}
            </blockquote>
          </figure>
        ) : null}

        <section className="space-y-4">
          <SectionTitle>Tech Stack</SectionTitle>
          <div className="grid gap-6 md:grid-cols-2">
            {project.techStack.map((category, idx) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="rounded-xl bg-surface-container-lowest p-5 md:p-6"
              >
                <h3 className="font-semibold text-on-surface">{category.category}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {category.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest px-5 py-6 sm:flex-row md:px-8"
        >
          <Link
            href="/portfolio/projects"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-surface-container-high px-6 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low"
          >
            ← Back to Projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-semibold text-primary-foreground shadow-editorial transition hover:brightness-[1.03]"
          >
            Let&apos;s Talk →
          </Link>
        </motion.div>
      </motion.div>
    </article>
  )
}
