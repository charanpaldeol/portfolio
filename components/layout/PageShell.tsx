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
        "flex min-h-0 min-h-screen w-full min-w-0 flex-1 flex-col bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed",
        className
      )}
    >
      <div className={cn("mx-auto w-full max-w-7xl flex-1 pl-6 pr-10 pt-10 pb-20 md:pl-8 md:pr-16", containerClassName)}>
        {children}
      </div>
    </div>
  )
}

