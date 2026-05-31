import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@/styles/tailwind.css"

import { Footer } from "@/components/layout/Footer"
import GlobalChrome from "@/components/layout/GlobalChrome"
import PortfolioShell from "@/components/layout/PortfolioShell"
import { SITE_URL } from "@/lib/site"
import {
  absoluteUrl,
  OG_IMAGE_PATH,
  ogImageMetadata,
  SITE_DEFAULT_DESCRIPTION,
} from "@/lib/site-metadata"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "cpdeol.com",
    template: "%s · cpdeol.com",
  },
  description: SITE_DEFAULT_DESCRIPTION,
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    siteName: "cpdeol.com",
    type: "website",
    locale: "en_CA",
    images: ogImageMetadata(),
  },
  twitter: {
    card: "summary_large_image",
    images: [absoluteUrl(OG_IMAGE_PATH)],
  },
  themeColor: "#1a1c1e",
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

