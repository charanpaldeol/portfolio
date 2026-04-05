import type { ReactNode } from "react"

export function ShellContentSurface({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl">
      <section className="relative rounded-2xl border border-border bg-background p-6 shadow-xl md:p-8">
        {children}
      </section>
    </div>
  )
}
