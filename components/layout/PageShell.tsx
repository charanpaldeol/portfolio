import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  /** Extra classes for the outer full-bleed wrapper. */
  className?: string
  /** Extra classes for the centered container (defaults match `what-i-bring`). */
  containerClassName?: string
}

export function PageShell({ children, className, containerClassName }: Props) {
  return (
    <div
      className={cn(
        "min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed",
        className
      )}
    >
      <div className={cn("mx-auto max-w-7xl px-6 pt-10 pb-20 md:px-8", containerClassName)}>
        {children}
      </div>
    </div>
  )
}

