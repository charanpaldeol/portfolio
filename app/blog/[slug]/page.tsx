import { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogTopicArticle } from "@/components/blog/BlogTopicArticle"
import { PageShell } from "@/components/layout/PageShell"
import { allBlogArticles } from "@/lib/all-blog-articles"
import { SITE_URL } from "@/lib/site"

function articleDescription(body: string): string {
  if (body.length <= 160) return body
  return `${body.slice(0, 157).trimEnd()}…`
}

interface Props {
  params: Promise<{ slug: string }>
}

function getArticleOrNotFound(slug: string) {
  const card = allBlogArticles.find((a) => a.slug === slug)
  if (!card) notFound()
  return card
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const card = getArticleOrNotFound(slug)
  const canonical = `${SITE_URL}/blog/${slug}`
  return {
    title: card.title,
    description: card.body,
    alternates: { canonical },
    openGraph: {
      title: card.title,
      description: card.body,
      url: canonical,
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
  return allBlogArticles.map((a) => ({ slug: a.slug }))
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params
  const card = getArticleOrNotFound(slug)
  const canonical = `${SITE_URL}/blog/${slug}`
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: card.title,
    description: articleDescription(card.body),
    url: canonical,
    author: {
      "@type": "Person",
      name: "Charan Deol",
      url: SITE_URL,
    },
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <PageShell>
        <BlogTopicArticle card={card} />
      </PageShell>
    </>
  )
}
