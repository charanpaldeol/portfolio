"use client"

// Purpose: Compact metric chip inside the weather hero card.
import { cn } from "@/lib/utils"

type HeroMetricChipProps = {
  label: string
  value: string
  detail?: string
  icon?: string
  accent?: boolean
  className?: string
}

export function HeroMetricChip({
  label,
  value,
  detail,
  icon,
  accent = false,
  className,
}: HeroMetricChipProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3.5 py-3 ring-1 backdrop-blur-sm transition-colors",
        accent
          ? "bg-primary/10 ring-primary/20 hover:bg-primary/15"
          : "bg-surface-container-highest/70 ring-outline-variant/10 hover:bg-surface-container-highest/90",
        className
      )}
    >
      {icon ? (
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl text-xl leading-none ring-1",
            accent
              ? "bg-primary/10 ring-primary/15"
              : "bg-surface-container-lowest/70 ring-outline-variant/10"
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">{label}</p>
        <p className={cn("text-sm font-semibold", accent ? "text-primary" : "text-on-surface")}>{value}</p>
        {detail ? <p className="truncate text-[11px] text-on-surface-variant">{detail}</p> : null}
      </div>
    </div>
  )
}
