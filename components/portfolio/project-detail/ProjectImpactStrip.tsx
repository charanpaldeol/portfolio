"use client"

import { motion } from "framer-motion"

import type { ProjectData } from "@/lib/projects-data"

type Props = {
  impactMetrics: ProjectData["impactMetrics"]
}

export function ProjectImpactStrip({ impactMetrics }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="-mx-4 rounded-2xl bg-surface-container-low px-4 py-6 shadow-editorial md:-mx-0 md:px-8 md:py-8"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {impactMetrics.map((m) => (
          <div
            key={`${m.value}-${m.label}`}
            className="rounded-xl bg-surface-container-lowest px-4 py-5 text-center shadow-editorial md:px-5 md:py-6"
          >
            <p className="font-display text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
              {m.value}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant md:text-sm md:normal-case md:font-medium md:tracking-normal">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
