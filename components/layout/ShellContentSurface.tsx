"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import type { HTMLVanillaTiltElement, TiltOptions } from "vanilla-tilt"

/** [vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js) — subtle Y-rotation from horizontal pointer */
const tiltOptions: TiltOptions = {
  max: 0.2,
  perspective: 1000,
  scale: 1,
  speed: 400,
  transition: true,
  axis: "x",
  reset: true,
  glare: false,
  gyroscope: false,
}

export function ShellContentSurface({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let cancelled = false

    void import("vanilla-tilt").then((mod) => {
      if (cancelled || ref.current !== el) return
      mod.default.init(el, tiltOptions)
    })

    return () => {
      cancelled = true
      ;(el as HTMLVanillaTiltElement).vanillaTilt?.destroy()
    }
  }, [])

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl">
      <section
        ref={ref}
        className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl [transform-style:preserve-3d] md:p-8"
      >
        {children}
      </section>
    </div>
  )
}
