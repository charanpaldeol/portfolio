"use client"

import { motion } from "framer-motion"
import Link from "next/link"

import type { ProjectData } from "@/lib/projects-data"
import { cn } from "@/lib/utils"

export default function ProjectDetailContent({ project }: { project: ProjectData }) {
  return (
    <article className="max-w-4xl space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Link
          href="/portfolio/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-container"
        >
          <span>← Back to Projects</span>
        </Link>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-5xl",
                project.accent,
              )}
            >
              {project.icon}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-2 text-lg text-on-surface-variant">{project.category}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="rounded-lg bg-surface-container-low p-4 md:p-6">
            <p className="text-base leading-relaxed text-on-surface-variant">{project.shortDescription}</p>
            <p className="mt-4 text-lg font-semibold text-secondary">
              <span className="text-on-surface">Key Result: </span>
              {project.outcome}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-12 border-t border-surface-container-high pt-8"
      >
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface">Problem Statement</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">{project.problemStatement}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface">Solution Approach</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">{project.solutionApproach}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface">Results & Metrics</h2>
          <div className="rounded-lg bg-surface-container-lowest p-6">
            <p className="text-base leading-relaxed text-on-surface-variant">{project.resultsMetrics}</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface">Tech Stack & Implementation</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {project.techStack.map((category, idx) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="rounded-lg bg-surface-container-low p-5"
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
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4 border-t border-surface-container-high pt-8"
        >
          <Link
            href="/portfolio/projects"
            className="inline-flex items-center justify-center rounded-xl bg-surface-container-high px-6 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-low"
          >
            ← Back to Projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-semibold text-primary-foreground shadow-editorial transition hover:brightness-[1.03]"
          >
            Let's Talk →
          </Link>
        </motion.div>
      </motion.div>
    </article>
  )
}
