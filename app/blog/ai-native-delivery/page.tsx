import { Metadata } from "next"

import { BlogTopicArticle } from "@/components/blog/BlogTopicArticle"
import { requireWhatIBringCard } from "@/lib/what-i-bring-cards"

const SLUG = "ai-native-delivery"

const card = requireWhatIBringCard(SLUG)

export const metadata: Metadata = {
  title: card.title,
  description: card.body,
  alternates: { canonical: `https://cpdeol.com/blog/${SLUG}` },
  openGraph: {
    title: card.title,
    description: card.body,
    url: `https://cpdeol.com/blog/${SLUG}`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: card.title,
    description: card.body,
  },
}

export default function AiNativeDeliveryPage() {
  return <BlogTopicArticle card={card} />
}
