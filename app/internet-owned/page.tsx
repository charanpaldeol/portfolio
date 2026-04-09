import type { Metadata } from "next"

import { EarningsDiagram, MeshStagesDiagram, PayoffChart } from "./diagrams"
import { InternetOwnedEditorial } from "./InternetOwnedEditorial"

export const metadata: Metadata = {
  title: "Internet Owned, Not Rented",
  description:
    "A practical look at community mesh networking where people own their internet hardware, share bandwidth, and keep control local.",
  alternates: { canonical: "https://cpdeol.com/internet-owned" },
  openGraph: {
    title: "Internet Owned, Not Rented — Charan Deol",
    description:
      "A practical look at community mesh networking where people own their internet hardware, share bandwidth, and keep control local.",
    url: "https://cpdeol.com/internet-owned",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Internet Owned, Not Rented — Charan Deol",
    description:
      "A practical look at community mesh networking where people own their internet hardware, share bandwidth, and keep control local.",
  },
}

/** Full-bleed under `PortfolioShell` horizontal padding so editorial sidebar can reach the viewport edge. */
export default function InternetOwnedPage() {
  return (
    <div className="-mx-4 max-w-none min-w-0 w-[calc(100%+2rem)] overflow-x-clip md:-mx-6 md:w-[calc(100%+3rem)]">
      <InternetOwnedEditorial
        meshDiagram={<MeshStagesDiagram />}
        payoffDiagram={<PayoffChart />}
        earningsDiagram={<EarningsDiagram />}
      />
    </div>
  )
}
