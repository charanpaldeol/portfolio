import { PageShell } from "@/components/layout/PageShell"

import { EyeBreakTimer } from "./components/EyeBreakTimer"

export const metadata = {
  title: "Eye Break Timer",
  description:
    "A browser-based eye break timer. Work in focused intervals and get reminded to rest your eyes every 20–30 minutes.",
  alternates: { canonical: "https://cpdeol.com/eye-break" },
  openGraph: {
    title: "Eye Break Timer — Charan Deol",
    description:
      "A browser-based eye break timer. Work in focused intervals and get reminded to rest your eyes every 20–30 minutes.",
    url: "https://cpdeol.com/eye-break",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eye Break Timer — Charan Deol",
    description:
      "A browser-based eye break timer. Work in focused intervals and get reminded to rest your eyes every 20–30 minutes.",
  },
}

export default function EyeBreakPage() {
  return (
    <PageShell containerClassName="max-w-4xl">
      <EyeBreakTimer />
    </PageShell>
  )
}

