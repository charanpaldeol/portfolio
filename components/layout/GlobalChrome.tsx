"use client"

import { usePathname } from "next/navigation"

import { Footer } from "components/layout/Footer"
import { Navbar } from "components/layout/Navbar"

export default function GlobalChrome() {
  const pathname = usePathname()

  // Phase 1 homepage owns its own navbar/footer (see `components/home/*`).
  if (pathname === "/") return null

  return (
    <>
      <Navbar />
      <Footer />
    </>
  )
}

