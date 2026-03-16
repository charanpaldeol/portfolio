import "styles/tailwind.css"

import { Navbar } from "../components/layout/Navbar"
import { Footer } from "../components/layout/Footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Navbar />
        <main className="min-h-[calc(100vh-5rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
