// Purpose: Place vs coordinates mode toggle — matches WeatherUnitsToggle styling.
"use client"

import { cn } from "@/lib/utils"

export type WeatherSearchMode = "place" | "coords"

const MODES: { value: WeatherSearchMode; label: string }[] = [
  { value: "place", label: "Place" },
  { value: "coords", label: "Coords" },
]

type WeatherSearchModeToggleProps = {
  mode: WeatherSearchMode
  onModeChange: (mode: WeatherSearchMode) => void
  className?: string
  /** Fused to the left edge of the search field (shared border). */
  variant?: "standalone" | "attached"
}

export function WeatherSearchModeToggle({
  mode,
  onModeChange,
  className,
  variant = "standalone",
}: WeatherSearchModeToggleProps) {
  const attached = variant === "attached"

  return (
    <div
      className={cn(
        "inline-flex shrink-0 p-0.5",
        attached
          ? "items-center self-stretch border-r border-outline-variant/10 bg-surface-container-low/80 px-1.5"
          : "rounded-xl bg-surface-container-low ring-1 ring-outline-variant/15",
        className
      )}
      role="group"
      aria-label="Location search mode"
    >
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={mode === value}
          onClick={() => onModeChange(value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-150",
            attached ? "min-h-9" : "uppercase",
            mode === value
              ? "bg-primary/12 text-primary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
