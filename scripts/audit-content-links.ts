import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { standaloneArticles } from "../lib/blog-articles-data"
import { expertiseAreas, workPhases } from "../lib/how-i-work-data"
import { projects } from "../lib/projects-data"
import { metrics } from "../lib/proof-metrics-data"
import { services, serviceFAQs } from "../lib/services-data"
import { testimonials } from "../lib/testimonials-data"
import { whatIBringCards } from "../lib/what-i-bring-cards"
import { engagementTypes, faqs, processSteps } from "../lib/work-with-me-data"
import {
  resolveBlogArticles,
  resolveEngagements,
  resolveExpertiseAreas,
  resolvePhases,
  resolvePrinciples,
  resolveProcessSteps,
  resolveProjects,
  resolveProofMetrics,
  resolveServices,
  resolveTestimonials,
  resolveWorkWithMeFaqs,
} from "../lib/content-lookups"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, "..")

type ResolverName =
  | "resolveServices"
  | "resolveProjects"
  | "resolveTestimonials"
  | "resolvePhases"
  | "resolvePrinciples"
  | "resolveEngagements"
  | "resolveProofMetrics"
  | "resolveExpertiseAreas"
  | "resolveBlogArticles"
  | "resolveProcessSteps"
  | "resolveWorkWithMeFaqs"

const resolverMap: Record<ResolverName, (values: readonly string[] | undefined) => { key: string; href?: string }[]> = {
  resolveServices,
  resolveProjects,
  resolveTestimonials,
  resolvePhases,
  resolvePrinciples,
  resolveEngagements,
  resolveProofMetrics,
  resolveExpertiseAreas,
  resolveBlogArticles,
  resolveProcessSteps,
  resolveWorkWithMeFaqs,
}

type RelationAudit = {
  label: string
  values: string[]
  resolver: ResolverName
}

const relationAudits: RelationAudit[] = [
  {
    label: "blog-articles.relatedServiceIds",
    values: standaloneArticles.flatMap((a) => [...(a.relatedServiceIds ?? [])]),
    resolver: "resolveServices",
  },
  {
    label: "blog-articles.relatedProjectSlugs",
    values: standaloneArticles.flatMap((a) => [...(a.relatedProjectSlugs ?? [])]),
    resolver: "resolveProjects",
  },
  {
    label: "blog-articles.relatedPhaseSteps",
    values: standaloneArticles.flatMap((a) => [...(a.relatedPhaseSteps ?? [])]),
    resolver: "resolvePhases",
  },
  {
    label: "blog-articles.relatedPrincipleIds",
    values: standaloneArticles.flatMap((a) => [...(a.relatedPrincipleIds ?? [])]),
    resolver: "resolvePrinciples",
  },
  {
    label: "blog-articles.relatedExpertiseIds",
    values: standaloneArticles.flatMap((a) => [...(a.relatedExpertiseIds ?? [])]),
    resolver: "resolveExpertiseAreas",
  },
  {
    label: "blog-articles.relatedBlogSlugs",
    values: standaloneArticles.flatMap((a) => [...(a.relatedBlogSlugs ?? [])]),
    resolver: "resolveBlogArticles",
  },
  {
    label: "what-i-bring.relatedServiceIds",
    values: whatIBringCards.flatMap((a) => [...(a.relatedServiceIds ?? [])]),
    resolver: "resolveServices",
  },
  {
    label: "what-i-bring.relatedProjectSlugs",
    values: whatIBringCards.flatMap((a) => [...(a.relatedProjectSlugs ?? [])]),
    resolver: "resolveProjects",
  },
  {
    label: "what-i-bring.relatedPhaseSteps",
    values: whatIBringCards.flatMap((a) => [...(a.relatedPhaseSteps ?? [])]),
    resolver: "resolvePhases",
  },
  {
    label: "what-i-bring.relatedPrincipleIds",
    values: whatIBringCards.flatMap((a) => [...(a.relatedPrincipleIds ?? [])]),
    resolver: "resolvePrinciples",
  },
  {
    label: "what-i-bring.relatedExpertiseIds",
    values: whatIBringCards.flatMap((a) => [...(a.relatedExpertiseIds ?? [])]),
    resolver: "resolveExpertiseAreas",
  },
  {
    label: "what-i-bring.relatedBlogSlugs",
    values: whatIBringCards.flatMap((a) => [...(a.relatedBlogSlugs ?? [])]),
    resolver: "resolveBlogArticles",
  },
  {
    label: "projects.relatedServiceIds",
    values: projects.flatMap((p) => [...(p.relatedServiceIds ?? [])]),
    resolver: "resolveServices",
  },
  {
    label: "projects.relatedProjectSlugs",
    values: projects.flatMap((p) => [...(p.relatedProjectSlugs ?? [])]),
    resolver: "resolveProjects",
  },
  {
    label: "projects.relatedTestimonialIds",
    values: projects.flatMap((p) => [...(p.relatedTestimonialIds ?? [])]),
    resolver: "resolveTestimonials",
  },
  {
    label: "projects.relatedPhaseSteps",
    values: projects.flatMap((p) => [...(p.relatedPhaseSteps ?? [])]),
    resolver: "resolvePhases",
  },
  {
    label: "projects.relatedProofMetricTags",
    values: projects.flatMap((p) => [...(p.relatedProofMetricTags ?? [])]),
    resolver: "resolveProofMetrics",
  },
  {
    label: "services-faq.relatedServiceIds",
    values: serviceFAQs.flatMap((f) => [...(f.relatedServiceIds ?? [])]),
    resolver: "resolveServices",
  },
  {
    label: "services-faq.relatedPhaseSteps",
    values: serviceFAQs.flatMap((f) => [...(f.relatedPhaseSteps ?? [])]),
    resolver: "resolvePhases",
  },
  {
    label: "work-with-me.faq.relatedEngagementIds",
    values: faqs.flatMap((f) => [...(f.relatedEngagementIds ?? [])]),
    resolver: "resolveEngagements",
  },
  {
    label: "work-with-me.faq.relatedPhaseSteps",
    values: faqs.flatMap((f) => [...(f.relatedPhaseSteps ?? [])]),
    resolver: "resolvePhases",
  },
]

const staticRouteFiles = [
  "app/page.tsx",
  "app/how-i-work/page.tsx",
  "app/how-i-think/page.tsx",
  "app/work-with-me/page.tsx",
  "app/portfolio/services/page.tsx",
  "app/contact/page.tsx",
]

const dynamicRouteChecks = {
  blog: (href: string) => href.startsWith("/blog/"),
  project: (href: string) => href.startsWith("/portfolio/projects/"),
}

const dynamicRouteFiles = {
  blog: "app/blog/[slug]/page.tsx",
  project: "app/portfolio/projects/[slug]/page.tsx",
}

function isValidHref(href: string | undefined): href is string {
  return Boolean(href && href.length > 1 && !href.startsWith("#"))
}

function splitHref(href: string): { pathname: string; hash: string } {
  const [pathname, hash = ""] = href.split("#")
  return { pathname: pathname || "/", hash }
}

function routeExists(pathname: string): boolean {
  if (pathname === "/") return true
  const normalized = pathname.replace(/\/$/, "")
  const staticPath = path.join(appRoot, "app", normalized.replace(/^\//, ""), "page.tsx")
  if (existsSync(staticPath)) return true
  if (dynamicRouteChecks.blog(normalized) && existsSync(path.join(appRoot, dynamicRouteFiles.blog))) return true
  if (dynamicRouteChecks.project(normalized) && existsSync(path.join(appRoot, dynamicRouteFiles.project))) return true
  return false
}

function hashExists(pathname: string, hash: string): boolean {
  if (!hash) return true
  const knownAnchors = new Set<string>([
    "testimonials",
    "proof-of-work",
    "expertise",
    "process",
    "faqs",
    ...services.map((s) => s.id),
    ...engagementTypes.map((e) => `engagement-${e.id}`),
  ])
  if (knownAnchors.has(hash)) return true
  const phaseAnchor = /^phase-\d{2}$/
  return pathname === "/how-i-work" && phaseAnchor.test(hash)
}

function main(): void {
  const errors: string[] = []
  const warnings: string[] = []
  let totalRelations = 0
  let resolvedRelations = 0

  // Ensure our static pages exist.
  for (const rel of staticRouteFiles) {
    if (!existsSync(path.join(appRoot, rel))) {
      errors.push(`Missing route file: ${rel}`)
    }
  }

  // Coverage and unresolved relation values.
  for (const audit of relationAudits) {
    const total = audit.values.length
    if (total === 0) {
      warnings.push(`Unused relation field: ${audit.label}`)
      continue
    }
    totalRelations += total
    const resolvedKeys = new Set(resolverMap[audit.resolver](audit.values).map((r) => r.key))
    const unresolved = audit.values.filter((v) => !resolvedKeys.has(v))
    resolvedRelations += total - unresolved.length
    if (unresolved.length > 0) {
      errors.push(
        `${audit.label}: ${unresolved.length}/${total} unresolved (examples: ${Array.from(new Set(unresolved)).slice(0, 5).join(", ")})`,
      )
    }
  }

  const resolutionRate = totalRelations === 0 ? 1 : resolvedRelations / totalRelations
  if (resolutionRate < 0.95) {
    errors.push(`Resolution rate ${(resolutionRate * 100).toFixed(1)}% is below required 95%`)
  }

  // Gather all generated links and validate route + hash targets.
  const allRelatedHrefs = new Set<string>()
  for (const resolver of Object.values(resolverMap)) {
    const allInputs: string[] = [
      ...services.map((s) => s.id),
      ...projects.map((p) => p.slug),
      ...testimonials.map((t) => t.id),
      ...workPhases.map((p) => p.step),
      ...engagementTypes.map((e) => e.id),
      ...metrics.map((m) => m.tag),
      ...expertiseAreas.map((a) => a.id ?? ""),
      ...processSteps.map((s) => s.id ?? ""),
      ...faqs.map((f) => f.id ?? ""),
      ...whatIBringCards.map((a) => a.slug),
      ...standaloneArticles.map((a) => a.slug),
    ].filter(Boolean)
    for (const item of resolver(allInputs)) {
      if (!isValidHref(item.href)) {
        errors.push(`Invalid href produced for key "${item.key}"`)
        continue
      }
      allRelatedHrefs.add(item.href)
    }
  }

  for (const href of Array.from(allRelatedHrefs)) {
    const { pathname, hash } = splitHref(href)
    if (!routeExists(pathname)) {
      errors.push(`Route does not exist for href: ${href}`)
      continue
    }
    if (!hashExists(pathname, hash)) {
      errors.push(`Anchor does not exist for href: ${href}`)
    }
  }

  const report = [
    `Audited ${relationAudits.length} relation groups`,
    `Relation resolution rate: ${(resolutionRate * 100).toFixed(1)}% (${resolvedRelations}/${totalRelations})`,
    `Resolved hrefs checked: ${allRelatedHrefs.size}`,
    warnings.length ? `Warnings (${warnings.length})` : "",
    ...warnings.map((w) => `  - ${w}`),
    errors.length ? `Errors (${errors.length})` : "No errors found",
    ...errors.map((e) => `  - ${e}`),
  ]
  console.log(report.filter(Boolean).join("\n"))

  if (errors.length > 0) {
    process.exit(1)
  }
}

main()
