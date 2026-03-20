"use client"
import { twMerge } from "tailwind-merge"

type AnimatedCircularProgressBarProps = {
  max?: number
  min?: number
  value: number
  gaugePrimaryColor: string
  gaugeSecondaryColor: string
  className?: string
}

export function AnimatedCircularProgressBar({
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  className,
}: AnimatedCircularProgressBarProps) {
  const clampedMax = max === min ? min + 1 : max
  const percentage =
    (Math.min(Math.max(value, min), clampedMax) - min) / (clampedMax - min)

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - percentage)

  return (
    <div className={twMerge("relative h-40 w-40", className)}>
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={gaugeSecondaryColor}
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={gaugePrimaryColor}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 60 60)"
          className="transition-[stroke-dashoffset] duration-[1000ms] ease-linear"
        />
      </svg>
    </div>
  )
}

