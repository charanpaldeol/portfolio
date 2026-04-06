import { Metadata } from "next"

import { BlogTopicArticle } from "@/components/blog/BlogTopicArticle"
import { requireWhatIBringCard } from "@/lib/what-i-bring-cards"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const card = requireWhatIBringCard(slug)
  return {
    title: card.title,
    description: card.body,
    alternates: { canonical: `https://cpdeol.com/blog/${slug}` },
    openGraph: {
      title: card.title,
      description: card.body,
      url: `https://cpdeol.com/blog/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: card.title,
      description: card.body,
    },
  }
}

export function generateStaticParams() {
  return [
    { slug: "ai-native-delivery" },
    { slug: "engineering-depth" },
    { slug: "problem-framing" },
    { slug: "solution-design" },
    { slug: "value-realization" },
  ]
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params
  const card = requireWhatIBringCard(slug)
  return <BlogTopicArticle card={card} />
}
