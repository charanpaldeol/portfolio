import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

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

/** Same outer shell as other marketing pages (`max-w-7xl`, horizontal padding). */
export default function InternetOwnedPage() {
  return (
    <PageShell>
      <InternetOwnedEditorial
        meshDiagram={<MeshStagesDiagram />}
        payoffDiagram={<PayoffChart />}
        earningsDiagram={<EarningsDiagram />}
      />
    </PageShell>
  )
}
