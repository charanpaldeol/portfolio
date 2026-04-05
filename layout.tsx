import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Inter } from "next/font/google"

import GlobalChrome from "components/layout/GlobalChrome"

import "styles/tailwind.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Charan Deol — Product Engineer & Consultant",
    template: "%s — Charan Deol",
  },
  description:
    "Independent consultant bridging business and engineering. Product strategy, full-stack development, and technical leadership.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <GlobalChrome />
        <div className="min-h-[calc(100vh-5rem)]">{children}</div>
      </body>
    </html>
  )
}
