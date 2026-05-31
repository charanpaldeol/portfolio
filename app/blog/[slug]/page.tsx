import { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogTopicArticle } from "@/components/blog/BlogTopicArticle"
import { RelatedLinks } from "@/components/content/RelatedLinks"
import { PageShell } from "@/components/layout/PageShell"
import { allBlogArticles } from "@/lib/all-blog-articles"
import {
  resolvePhases,
  resolvePrinciples,
  resolveProjects,
  resolveServices,
} from "@/lib/content-lookups"
import { blogPublishedDate } from "@/lib/seo-content-dates"
import { absoluteUrl, pageMetadata } from "@/lib/site-metadata"
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
  const description = articleDescription(card.body)
  return pageMetadata({
    title: card.title,
    description,
    path: `/blog/${slug}`,
    ogType: "article",
  })
}

export function generateStaticParams() {
  return allBlogArticles.map((a) => ({ slug: a.slug }))
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params
  const card = getArticleOrNotFound(slug)
  const canonical = `${SITE_URL}/blog/${slug}`
  const published = blogPublishedDate(slug)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: card.title,
    description: articleDescription(card.body),
    url: canonical,
    mainEntityOfPage: canonical,
    datePublished: published.toISOString(),
    dateModified: published.toISOString(),
    image: absoluteUrl("/og-default.jpg"),
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
        <RelatedLinks
          className="mt-12"
          heading="Related"
          description="Where this essay connects to my principles, services, and work."
          groups={[
            { title: "Principles", items: resolvePrinciples(card.relatedPrincipleIds), showSublabel: true },
            { title: "Services", items: resolveServices(card.relatedServiceIds) },
            { title: "Work phases", items: resolvePhases(card.relatedPhaseSteps), showSublabel: true },
            { title: "Projects", items: resolveProjects(card.relatedProjectSlugs), showSublabel: true },
          ]}
        />
      </PageShell>
    </>
  )
}
