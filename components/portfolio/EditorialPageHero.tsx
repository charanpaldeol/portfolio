"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

export type EditorialPageHeroProps = {
  eyebrow: string
  title: ReactNode
  /** Plain string or rich text (e.g. inline links). */
  description: ReactNode
}

/**
 * Canonical editorial page hero — rule, eyebrow, H1 scale, gradient span, light body.
 *
 * **Governance:** `docs/GOVERNANCE.md` § "Editorial page hero (canonical UI)".
 * **Proof page:** `app/what-i-bring/page.tsx` must compose only this component.
 * Do not reimplement this pattern on other routes; extend props here if needed.
 */
export function EditorialPageHero({ eyebrow, title, description }: EditorialPageHeroProps) {
  const reduceMotion = useReducedMotion() ?? false
  const t = (duration: number, delay = 0) => ({
    duration: reduceMotion ? 0 : duration,
    delay: reduceMotion ? 0 : delay,
  })
  const instant = reduceMotion ? { opacity: 1, x: 0, y: 0 } : undefined

  return (
    <header className="mb-20 max-w-4xl">
      <motion.div
        initial={instant ?? { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t(0.6)}
        className="mb-6 flex items-center gap-4"
      >
        <div className="h-[1px] w-12 shrink-0 bg-primary" aria-hidden />
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h1
        initial={instant ?? { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.8, 0.2)}
        className="mb-8 text-5xl font-extrabold tracking-tighter text-on-surface leading-[1.05] md:text-7xl"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={instant ?? { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.8, 0.4)}
        className="max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant md:text-2xl"
      >
        {description}
      </motion.p>
    </header>
  )
}

/** Puts the editorial gradient on the last word (matches “How I work”, “Selected work”, etc.). */
export function editorialGradientLastWord(title: string): ReactNode {
  const words = title.trim().split(/\s+/u)
  if (words.length === 0) return title
  if (words.length === 1) {
    return <span className="text-editorial-gradient">{words[0]}</span>
  }
  const last = words[words.length - 1]!
  const rest = words.slice(0, -1).join(" ")
  return (
    <>
      {rest}{" "}
      <span className="text-editorial-gradient">{last}</span>
    </>
  )
}
