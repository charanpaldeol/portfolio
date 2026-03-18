import "styles/tailwind.css"

import { Inter } from "next/font/google"

import GlobalChrome from "components/layout/GlobalChrome"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Charan Deol",
  description:
    "I turn complex problems into clear decisions and delivered solutions.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        {/*
         * GlobalChrome renders null on "/" — the homepage manages
         * its own Navbar + Footer via components/home/*.
         * All other routes get layout/Navbar + layout/Footer here.
         */}
        <GlobalChrome />
        <div className="min-h-[calc(100vh-5rem)]">{children}</div>
      </body>
    </html>
  )
}
