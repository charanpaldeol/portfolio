import { NextResponse } from "next/server"

import { standaloneArticles } from "@/lib/blog-articles-data"
import { projects } from "@/lib/projects-data"
import { services } from "@/lib/services-data"
import { whatIBringCards } from "@/lib/what-i-bring-cards"

export async function GET() {
  const base = "https://cpdeol.com"

  const lines: string[] = [
    "# Charan Deol — Full Content",
    "",
    "> Independent consultant based in Toronto, Canada. I help product and engineering teams turn complex problems into clear decisions and delivered solutions. Specialties: AI-native product design, systems architecture, design systems, and fractional design leadership.",
    "",
    "> This file contains the full text of all articles and detailed project write-ups for AI agent consumption.",
    "> For a concise index, see: https://cpdeol.com/llms.txt",
    "",
    "---",
    "",
    "## Services",
    "",
  ]

  for (const service of services) {
    lines.push(`### ${service.name}`)
    lines.push("")
    lines.push(`**Tagline:** ${service.tagline}`)
    lines.push("")
    lines.push(service.description.replace(/\n/g, "\n\n"))
    lines.push("")
    lines.push(`**Who it's for:** ${service.whoItsFor}`)
    if (service.notFor) {
      lines.push(`**Not for:** ${service.notFor}`)
    }
    lines.push(`**Engagement:** ${service.engagement}`)
    lines.push("")
    lines.push("**Deliverables:**")
    for (const d of service.deliverables) {
      lines.push(`- ${d}`)
    }
    lines.push("")
    lines.push("**Outcomes:**")
    for (const o of service.outcomes) {
      lines.push(`- ${o.metric}: ${o.description}`)
    }
    lines.push("")
    lines.push(`[Learn more](${base}/portfolio/services#${service.id})`)
    lines.push("")
    lines.push("---")
    lines.push("")
  }

  lines.push("## Portfolio Projects")
  lines.push("")

  for (const project of projects) {
    lines.push(`### ${project.title}`)
    lines.push("")
    lines.push(`**Tagline:** ${project.tagline}`)
    lines.push("")
    lines.push(
      `**Role:** ${project.role} · **Category:** ${project.category} · **Timeline:** ${project.timeline}`,
    )
    lines.push(`**Tags:** ${project.tags.join(", ")}`)
    lines.push("")
    lines.push(`**Problem:** ${project.problem}`)
    lines.push("")
    lines.push(`**Solution:** ${project.solution}`)
    lines.push("")

    if (project.processSteps && project.processSteps.length > 0) {
      lines.push("**Process:**")
      for (const step of project.processSteps) {
        lines.push(`- ${step.phase}: ${step.description}`)
      }
      lines.push("")
    }

    lines.push("**Results:**")
    for (const metric of project.metrics) {
      lines.push(`- ${metric}`)
    }
    lines.push("")

    if (project.keyLearning) {
      lines.push(`**Key Learning:** ${project.keyLearning}`)
      lines.push("")
    }

    lines.push("**Tech Stack:**")
    for (const stack of project.techStack) {
      lines.push(`- ${stack.category}: ${stack.technologies.join(", ")}`)
    }
    lines.push("")
    lines.push(`[Case study](${base}/portfolio/projects/${project.slug})`)
    lines.push("")
    lines.push("---")
    lines.push("")
  }

  lines.push("## Articles")
  lines.push("")

  const allArticles = [...whatIBringCards, ...standaloneArticles]

  for (const article of allArticles) {
    lines.push(`### ${article.title}`)
    lines.push("")
    lines.push(`**Category:** ${article.badge}`)
    lines.push("")
    lines.push(article.body)
    lines.push("")

    for (const section of article.sections) {
      lines.push(`#### ${section.heading}`)
      lines.push("")
      for (const paragraph of section.paragraphs) {
        lines.push(paragraph)
        lines.push("")
      }
    }

    lines.push(`[Read article](${base}/blog/${article.slug})`)
    lines.push("")
    lines.push("---")
    lines.push("")
  }

  lines.push("## Contact")
  lines.push("")
  lines.push(`- Contact form: [${base}/contact](${base}/contact)`)
  lines.push(`- Book a call: [${base}/work-with-me](${base}/work-with-me)`)

  const content = lines.join("\n")

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
