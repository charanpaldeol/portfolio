import { NextResponse } from "next/server"

import { standaloneArticles } from "@/lib/blog-articles-data"
import { projects } from "@/lib/projects-data"
import { services } from "@/lib/services-data"
import { whatIBringCards } from "@/lib/what-i-bring-cards"

export async function GET() {
  const base = "https://cpdeol.com"

  const lines: string[] = [
    "# Charan Deol",
    "",
    "> Independent consultant based in Toronto, Canada. I help product and engineering teams turn complex problems into clear decisions and delivered solutions. Specialties: AI-native product design, systems architecture, design systems, and fractional design leadership.",
    "",
    "## Key Pages",
    "",
    `- [Home](${base}/): Portfolio overview, value proposition, and engagement options`,
    `- [About](${base}/portfolio/about): Professional background and work history`,
    `- [Experience](${base}/portfolio/experience): Career timeline and key roles`,
    `- [Services](${base}/portfolio/services): Consulting service offerings and engagement models`,
    `- [Projects](${base}/portfolio/projects): Portfolio of delivered work with case studies`,
    `- [Blog](${base}/blog): Articles on product strategy, AI, systems, and leadership`,
    `- [How I Work](${base}/how-i-work): Delivery methodology (Discover → Define → Design → Deliver → Adopt → Value)`,
    `- [How I Think](${base}/how-i-think): Leadership and decision-making principles`,
    `- [How I Use AI](${base}/how-i-use-ai): AI workflow and methodology`,
    `- [Tools & Methods](${base}/tools-and-methods): Toolkit and approaches`,
    `- [Work With Me](${base}/work-with-me): Engagement options and booking`,
    `- [Contact](${base}/contact): Get in touch`,
    "",
    "## Services",
    "",
  ]

  for (const service of services) {
    lines.push(`### ${service.name}`)
    lines.push("")
    lines.push(service.tagline)
    lines.push("")
    lines.push(service.description.replace(/\n/g, " "))
    lines.push("")
    lines.push(`**For:** ${service.whoItsFor}`)
    lines.push(`**Engagement:** ${service.engagement}`)
    lines.push(
      `**Outcomes:** ${service.outcomes.map((o) => `${o.metric} ${o.description}`).join("; ")}`,
    )
    lines.push(`[Learn more](${base}/portfolio/services#${service.id})`)
    lines.push("")
  }

  lines.push("## Portfolio Projects")
  lines.push("")

  for (const project of projects) {
    lines.push(`### ${project.title}`)
    lines.push("")
    lines.push(project.tagline)
    lines.push("")
    lines.push(
      `**Role:** ${project.role} · **Category:** ${project.category} · **Timeline:** ${project.timeline}`,
    )
    lines.push(
      `**Impact:** ${project.impactMetrics.map((m) => `${m.value} ${m.label}`).join(", ")}`,
    )
    lines.push(`[Case study](${base}/portfolio/projects/${project.slug})`)
    lines.push("")
  }

  lines.push("## Articles")
  lines.push("")

  const allArticles = [...whatIBringCards, ...standaloneArticles]

  for (const article of allArticles) {
    lines.push(`### ${article.title}`)
    lines.push("")
    lines.push(article.body)
    lines.push("")
    lines.push(`[Read article](${base}/blog/${article.slug})`)
    lines.push("")
  }

  lines.push("## Contact")
  lines.push("")
  lines.push(`- Contact form: [${base}/contact](${base}/contact)`)
  lines.push(`- Book a call: [${base}/work-with-me](${base}/work-with-me)`)
  lines.push("")
  lines.push("## Full Content")
  lines.push("")
  lines.push(
    `For complete article text and detailed project write-ups: [${base}/llms-full.txt](${base}/llms-full.txt)`,
  )

  const content = lines.join("\n")

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
