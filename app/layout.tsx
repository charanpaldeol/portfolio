import "styles/tailwind.css"

import { Inter } from "next/font/google"

import GlobalChrome from "components/layout/GlobalChrome"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <GlobalChrome />
        <div className="min-h-[calc(100vh-5rem)]">{children}</div>
      </body>
    </html>
  )
}
