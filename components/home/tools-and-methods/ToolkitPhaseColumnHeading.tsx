import { Search, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

export function ToolkitPhaseColumnHeading({
  variant,
  className,
}: {
  variant: "strategic" | "execution"
  className?: string
}) {
  const isStrategic = variant === "strategic"
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full shadow-editorial",
          isStrategic
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isStrategic ? (
          <Search className="size-5" strokeWidth={2} aria-hidden />
        ) : (
          <Zap className="size-5" strokeWidth={2} aria-hidden />
        )}
      </div>
      <h2 className="font-display text-xl font-bold tracking-tight text-on-surface">
        {isStrategic ? "Strategic phases" : "Execution phases"}
      </h2>
    </div>
  )
}
