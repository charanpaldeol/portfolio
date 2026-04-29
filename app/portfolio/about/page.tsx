import type { Metadata } from "next"

import { PageShell } from "@/components/layout/PageShell"

import AboutContent from "./AboutContent"

export const metadata: Metadata = {
  title: "About",
  description:
    "Designer, engineer, and product thinker with 8+ years building digital products across B2B SaaS, fintech, and consumer apps. Based in Toronto.",
  alternates: { canonical: "https://cpdeol.com/portfolio/about" },
  openGraph: {
    title: "About — Charan Deol",
    description:
      "Designer, engineer, and product thinker with 8+ years building digital products across B2B SaaS, fintech, and consumer apps. Based in Toronto.",
    url: "https://cpdeol.com/portfolio/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Charan Deol",
    description:
      "Designer, engineer, and product thinker with 8+ years building digital products across B2B SaaS, fintech, and consumer apps. Based in Toronto.",
  },
}

const ROBOT_ANIMATION_URL = "https://assets2.lottiefiles.com/packages/lf20_GbabwrUY2k.json"

export default async function AboutPage() {
  const robotAnimationData: object | null = await fetch(ROBOT_ANIMATION_URL, {
    next: { revalidate: 86400 }, // cache for 24 h
  })
    .then((r) => r.json() as Promise<object>)
    .catch(() => null)

  return (
    <PageShell containerClassName="max-w-screen-2xl">
      <AboutContent robotAnimationData={robotAnimationData} />
    </PageShell>
  )
}
