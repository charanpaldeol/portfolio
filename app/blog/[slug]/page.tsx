import { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogTopicArticle } from "@/components/blog/BlogTopicArticle"
import { PageShell } from "@/components/layout/PageShell"
import { standaloneArticles } from "@/lib/blog-articles-data"
import { whatIBringCards } from "@/lib/what-i-bring-cards"

const allArticles = [...whatIBringCards, ...standaloneArticles]

interface Props {
  params: Promise<{ slug: string }>
}

function getArticleOrNotFound(slug: string) {
  const card = allArticles.find((a) => a.slug === slug)
  if (!card) notFound()
  return card
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const card = getArticleOrNotFound(slug)
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
  return allArticles.map((a) => ({ slug: a.slug }))
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params
  const card = getArticleOrNotFound(slug)
  return (
    <PageShell>
      <BlogTopicArticle card={card} />
    </PageShell>
  )
}
