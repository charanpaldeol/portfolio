import type { ReactNode } from "react"

export function ShellContentSurface({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 w-full">{children}</div>
  )
}
