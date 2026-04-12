import type { ReactNode } from "react"
import { ShellContentSurface } from "./ShellContentSurface"
import { FlickeringGrid } from "../../registry/magicui/flickering-grid"

export default function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex w-full flex-1 flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
      <FlickeringGrid
        className="pointer-events-none fixed inset-0 -z-10 size-full min-h-screen"
        squareSize={4}
        gridGap={6}
        color="var(--color-muted-foreground)"
        maxOpacity={0.1}
        flickerChance={0.05}
      />
      <ShellContentSurface>{children}</ShellContentSurface>
    </main>
  )
}
