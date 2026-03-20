"use client"
import { useEffect, useLayoutEffect } from "react"

import { AnimatedCircularProgressBar } from "components/magicui/animated-circular-progress-bar"
import { NumberTicker } from "components/magicui/number-ticker"
import { Button } from "components/ui/button"

type BreakOverlayProps = {
  isOpen: boolean
  breakRemaining: number // ms
  breakTotal: number // ms
  tip: string
  onSkip: () => void
  onStop: () => void
}

function msToSecondsCeil(ms: number) {
  return Math.max(0, Math.ceil(ms / 1000))
}

export function BreakOverlay({
  isOpen,
  breakRemaining,
  breakTotal,
  tip,
  onSkip,
  onStop,
}: BreakOverlayProps) {
  useLayoutEffect(() => {
    if (!isOpen) return
    const t = window.setTimeout(() => {
      document.querySelector<HTMLButtonElement>("[data-eye-break-skip]")?.focus()
    }, 0)
    return () => window.clearTimeout(t)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onSkip()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onSkip])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  const breakRemainingSeconds = msToSecondsCeil(breakRemaining)
  const breakTotalSeconds = Math.max(1, msToSecondsCeil(breakTotal))

  return (
    <div
      className="fixed inset-0 z-[9999] bg-foreground text-background"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eye-break-overlay-title"
    >
      <div className="flex h-full flex-col items-center justify-center px-4 py-10">
        <h2 id="eye-break-overlay-title" className="sr-only">
          Break time
        </h2>
        <div className="relative">
          <AnimatedCircularProgressBar
            value={breakRemainingSeconds}
            max={breakTotalSeconds}
            min={0}
            gaugePrimaryColor="rgb(255 255 255)"
            gaugeSecondaryColor="rgba(255, 255, 255, 0.14)"
            className="h-56 w-56"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-background">
                <NumberTicker value={breakRemainingSeconds} className="text-4xl font-semibold" />
              </div>
              <div className="mt-1 text-sm font-medium text-background/75">seconds</div>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-xl text-center text-base leading-relaxed text-background/90">{tip}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            data-eye-break-skip
            variant="secondary"
            onClick={onSkip}
            aria-label="Skip break"
          >
            Skip break
          </Button>
          <Button variant="outline" onClick={onStop} aria-label="Stop timer" className="border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background">
            Stop timer
          </Button>
        </div>
      </div>
    </div>
  )
}
