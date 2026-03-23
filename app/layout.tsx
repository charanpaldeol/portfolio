import "styles/tailwind.css"

import { Inter } from "next/font/google"

import { Footer } from "components/layout/Footer"
import GlobalChrome from "components/layout/GlobalChrome"
import PortfolioShell from "components/layout/PortfolioShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Charan Deol",
  description:
    "I turn complex problems into clear decisions and delivered solutions.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
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
