import type { Metadata } from "next"

import { WorkWithMeContent } from "./WorkWithMeContent"

export const metadata: Metadata = {
  title: "Work With Me | Charan Pal Deol",
  description:
    "Consulting and fractional design leadership engagements. Product strategy, AI-native UX, and design systems for teams that ship.",
}

export default function WorkWithMePage() {
  return <WorkWithMeContent />
}
