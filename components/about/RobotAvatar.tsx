"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * EVE-inspired floating robot avatar built with inline SVG + Framer Motion.
 * No external files or network requests — always works.
 *
 * Animations (all disabled when prefers-reduced-motion is set):
 *  - Whole body: gentle vertical bob (infinite)
 *  - Right arm:  waves once on mount
 *  - Eyes:       cyan glow + periodic blink
 *  - Ground shadow: scales / fades in sync with the bob
 */
export function RobotAvatar({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion() ?? false

  const floatProps = reduceMotion
    ? {}
    : {
        animate: { y: [0, -14, 0] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
      }

  const shadowProps = reduceMotion
    ? {}
    : {
        animate: { scaleX: [1, 0.65, 1], opacity: [0.1, 0.04, 0.1] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
      }

  const waveProps = reduceMotion
    ? {}
    : {
        animate: { rotate: [0, -58, 22, -48, 12, 0] },
        transition: { duration: 2.2, delay: 0.55, ease: "easeInOut" as const },
      }

  const blinkProps = reduceMotion
    ? {}
    : {
        animate: { scaleY: [1, 1, 1, 0.06, 1] },
        transition: {
          duration: 0.28,
          delay: 2.6,
          repeat: Infinity,
          repeatDelay: 5.2,
          times: [0, 0.35, 0.6, 0.8, 1],
          ease: "easeInOut" as const,
        },
      }

  return (
    <svg
      viewBox="0 0 200 285"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Animated robot avatar"
      role="img"
    >
      <defs>
        <radialGradient id="rbt-body" cx="35%" cy="24%" r="70%">
          <stop offset="0%" stopColor="#edf5fb" />
          <stop offset="100%" stopColor="#aec8da" />
        </radialGradient>
        <radialGradient id="rbt-eye" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#b2f5ff" />
          <stop offset="55%" stopColor="#00c8e8" />
          <stop offset="100%" stopColor="#00809e" />
        </radialGradient>
        <filter id="rbt-eye-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <motion.ellipse
        cx="100"
        cy="272"
        rx="42"
        ry="8"
        fill="#000"
        opacity="0.1"
        style={{ transformOrigin: "100px 272px" }}
        {...shadowProps}
      />

      {/* Floating robot body */}
      <motion.g {...floatProps}>
        {/* Torso */}
        <ellipse cx="100" cy="162" rx="57" ry="78" fill="url(#rbt-body)" />
        {/* Head */}
        <ellipse cx="100" cy="89" rx="49" ry="49" fill="url(#rbt-body)" />
        {/* Head specular */}
        <ellipse cx="82" cy="71" rx="15" ry="10" fill="white" opacity="0.48" transform="rotate(-25 82 71)" />
        {/* Torso specular */}
        <ellipse cx="78" cy="142" rx="9" ry="20" fill="white" opacity="0.22" transform="rotate(-8 78 142)" />

        {/* Left arm */}
        <ellipse cx="36" cy="167" rx="11" ry="24" fill="url(#rbt-body)" transform="rotate(10 36 167)" />

        {/* Right arm — waves on load, pivot at shoulder */}
        <motion.g style={{ transformOrigin: "164px 147px" }} {...waveProps}>
          <ellipse cx="164" cy="171" rx="11" ry="24" fill="url(#rbt-body)" transform="rotate(-10 164 171)" />
        </motion.g>

        {/* Eyes with glow + blink */}
        <motion.g style={{ transformOrigin: "100px 91px" }} filter="url(#rbt-eye-glow)" {...blinkProps}>
          <ellipse cx="81" cy="91" rx="13" ry="9" fill="url(#rbt-eye)" />
          <ellipse cx="119" cy="91" rx="13" ry="9" fill="url(#rbt-eye)" />
          {/* Lens glints */}
          <ellipse cx="77" cy="88" rx="4" ry="2.5" fill="white" opacity="0.72" />
          <ellipse cx="115" cy="88" rx="4" ry="2.5" fill="white" opacity="0.72" />
        </motion.g>
      </motion.g>
    </svg>
  )
}
