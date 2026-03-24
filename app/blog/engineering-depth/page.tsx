import { Metadata } from "next"

import { BlogTopicArticle } from "@/components/blog/BlogTopicArticle"
import { requireWhatIBringCard } from "@/lib/what-i-bring-cards"

const SLUG = "engineering-depth"

const card = requireWhatIBringCard(SLUG)

export const metadata: Metadata = {
  title: `${card.title} — Blog`,
  description: card.body,
}

export default function EngineeringDepthPage() {
  return <BlogTopicArticle card={card} />
}
