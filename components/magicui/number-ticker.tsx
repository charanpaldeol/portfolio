"use client"
import { useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type NumberTickerProps = {
  value: number
  delay?: number
  suffix?: string
  className?: string
}

export function NumberTicker({ value, delay = 0, suffix = "", className }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    if (isInView) setTimeout(() => motionValue.set(value), delay * 1000)
  }, [motionValue, isInView, delay, value])

  useEffect(() =>
    springValue.on("change", (latest) => {
      if (ref.current)
        ref.current.textContent = Intl.NumberFormat("en-US").format(Math.round(latest)) + suffix
    }), [springValue, suffix])

  return <span ref={ref} className={cn("inline-block tabular-nums", className)}>0{suffix}</span>
}
