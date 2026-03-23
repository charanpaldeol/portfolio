import type { ReactNode } from "react"
import { FlickeringGrid } from "../../registry/magicui/flickering-grid"

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex w-full flex-1 flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={800}
      />
      <section className="relative z-10 mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {children}
      </section>
    </main>
  )
}
