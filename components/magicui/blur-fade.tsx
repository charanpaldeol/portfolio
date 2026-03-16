"use client"

import { motion, type MotionProps } from "framer-motion"
import type { ReactNode } from "react"

type BlurFadeProps = {
  /** Content to animate in */
  children: ReactNode
  /** Delay in seconds before the animation starts */
  delay?: number
  /** Optional className forwarded to the motion div */
  className?: string
} & MotionProps

export function BlurFade({ children, delay = 0, ...motionProps }: BlurFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

