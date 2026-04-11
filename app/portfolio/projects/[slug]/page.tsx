import { notFound } from "next/navigation"

import { PageShell } from "@/components/layout/PageShell"
import { projects } from "@/lib/projects-data"

import ProjectDetailContent from "./ProjectDetailContent"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <PageShell>
      <ProjectDetailContent project={project} />
    </PageShell>
  )
}
