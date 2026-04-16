import "styles/tailwind.css"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"

import { Footer } from "components/layout/Footer"
import GlobalChrome from "components/layout/GlobalChrome"
import PortfolioShell from "components/layout/PortfolioShell"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://cpdeol.com"),
  title: {
    default: "Charan Deol",
    template: "%s — Charan Deol",
  },
  description:
    "I turn complex problems into clear decisions and delivered solutions.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Charan Deol",
    title: "Charan Deol",
    description:
      "I turn complex problems into clear decisions and delivered solutions.",
    url: "https://cpdeol.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charan Deol",
    description:
      "I turn complex problems into clear decisions and delivered solutions.",
  },
  alternates: {
    canonical: "https://cpdeol.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.simpleicons.org" />
      </head>
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-background text-foreground`}
      >
        <GlobalChrome />
        <PortfolioShell>{children}</PortfolioShell>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
