import type { ReactNode } from "react"

export function ShellContentSurface({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 flex-col">{children}</div>
  )
}
