import "styles/tailwind.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Footer } from "components/layout/Footer"
import GlobalChrome from "components/layout/GlobalChrome"
import PortfolioShell from "components/layout/PortfolioShell"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-background text-foreground`}
      >
        <GlobalChrome />
        <PortfolioShell>{children}</PortfolioShell>
        <Footer />
      </body>
    </html>
  )
}
