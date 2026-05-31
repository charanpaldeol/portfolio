import type { Metadata } from "next"

import { pageMetadata } from "@/lib/site-metadata"

import { WorkWithMeContent } from "./WorkWithMeContent"

export const metadata: Metadata = pageMetadata({
  title: "Work With Me",
  description:
    "Consulting and fractional design leadership engagements. Product strategy, AI-native UX, and design systems for teams that ship.",
  path: "/work-with-me",
})

export default function WorkWithMePage() {
  return <WorkWithMeContent />
}
