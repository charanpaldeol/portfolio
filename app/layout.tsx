import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@/styles/tailwind.css"

import { Footer } from "@/components/layout/Footer"
import GlobalChrome from "@/components/layout/GlobalChrome"
import PortfolioShell from "@/components/layout/PortfolioShell"

export const metadata: Metadata = {
  title: {
    default: "cpdeol.com",
    template: "%s · cpdeol.com",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-foreground">
        <GlobalChrome />
        <PortfolioShell>{children}</PortfolioShell>
        <Footer />
      </body>
    </html>
  )
}

