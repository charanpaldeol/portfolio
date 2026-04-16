import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageShell } from "@/components/layout/PageShell"
import { projects } from "@/lib/projects-data"
import { SITE_URL } from "@/lib/site"

import ProjectDetailContent from "./ProjectDetailContent"

interface Props {
  params: Promise<{ slug: string }>
}

function getProjectOrNotFound(slug: string) {
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()
  return project
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectOrNotFound(slug)
  const canonical = `${SITE_URL}/portfolio/projects/${slug}`
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical },
    openGraph: {
      title: project.title,
      description: project.tagline,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.tagline,
    },
  }
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectOrNotFound(slug)
  const url = `${SITE_URL}/portfolio/projects/${slug}`
  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline,
    url,
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <PageShell>
        <ProjectDetailContent project={project} />
      </PageShell>
    </>
  )
}
