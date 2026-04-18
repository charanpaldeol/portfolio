import { standaloneArticles } from "@/lib/blog-articles-data"
import { HOW_I_THINK_PRINCIPLES } from "@/lib/how-i-think-principles"
import { expertiseAreas, workPhases } from "@/lib/how-i-work-data"
import { projects } from "@/lib/projects-data"
import { type Metric, metrics as proofMetricsLiteral } from "@/lib/proof-metrics-data"

const proofMetrics: readonly Metric[] = proofMetricsLiteral
import { services } from "@/lib/services-data"
import { testimonials } from "@/lib/testimonials-data"
import { whatIBringCards } from "@/lib/what-i-bring-cards"
import { engagementTypes, processSteps, faqs as workWithMeFaqs } from "@/lib/work-with-me-data"

export type RelatedItem = {
  /** Short visible label (e.g. service name). */
  label: string
  /** Optional secondary text shown beneath/after the label. */
  sublabel?: string
  /** Optional destination. Items without an href render as static chips. */
  href?: string
  /** Stable identifier (slug / id / tag) — useful for React keys. */
  key: string
}

export function resolveServices(ids: readonly string[] | undefined): RelatedItem[] {
  if (!ids?.length) return []
  return ids
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is (typeof services)[number] => Boolean(s))
    .map((s) => ({ key: s.id, label: s.name, sublabel: s.tagline, href: `/portfolio/services#${s.id}` }))
}

export function resolveProjects(slugs: readonly string[] | undefined): RelatedItem[] {
  if (!slugs?.length) return []
  return slugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[number] => Boolean(p))
    .map((p) => ({ key: p.slug, label: p.title, sublabel: p.tagline, href: `/portfolio/projects/${p.slug}` }))
}

export function resolveTestimonials(ids: readonly string[] | undefined): RelatedItem[] {
  if (!ids?.length) return []
  return ids
    .map((id) => testimonials.find((t) => t.id === id))
    .filter((t): t is (typeof testimonials)[number] => Boolean(t))
    .map((t) => ({ key: t.id, label: `${t.author} — ${t.title}`, sublabel: t.relationship, href: "/#testimonials" }))
}

export function resolvePhases(steps: readonly string[] | undefined): RelatedItem[] {
  if (!steps?.length) return []
  return steps
    .map((step) => workPhases.find((p) => p.step === step))
    .filter((p): p is (typeof workPhases)[number] => Boolean(p))
    .map((p) => ({ key: p.step, label: `${p.step} · ${p.title}`, sublabel: p.description, href: "/how-i-work" }))
}

export function resolvePrinciples(ids: readonly string[] | undefined): RelatedItem[] {
  if (!ids?.length) return []
  return ids
    .map((id) => HOW_I_THINK_PRINCIPLES.find((p) => p.id === id))
    .filter((p): p is (typeof HOW_I_THINK_PRINCIPLES)[number] => Boolean(p))
    .map((p) => ({ key: p.id, label: p.quote, sublabel: p.why, href: "/how-i-think" }))
}

export function resolveEngagements(ids: readonly string[] | undefined): RelatedItem[] {
  if (!ids?.length) return []
  return ids
    .map((id) => engagementTypes.find((e) => e.id === id))
    .filter((e): e is (typeof engagementTypes)[number] => Boolean(e))
    .map((e) => ({ key: e.id, label: e.name, sublabel: e.typicalDuration, href: `/work-with-me#engagement-${e.id}` }))
}

export function resolveProofMetrics(tags: readonly string[] | undefined): RelatedItem[] {
  if (!tags?.length) return []
  return tags
    .map((tag) => proofMetrics.find((m) => m.tag === tag))
    .filter((m): m is (typeof proofMetrics)[number] => Boolean(m))
    .map((m) => {
      const numericLabel = m.numericValue != null ? `${m.numericValue}${m.statSuffix ?? ""}` : null
      return {
        key: m.tag,
        label: m.statDisplay ?? numericLabel ?? m.tag,
        sublabel: m.tag,
        href: "/#proof",
      }
    })
}

export function resolveExpertiseAreas(ids: readonly string[] | undefined): RelatedItem[] {
  if (!ids?.length) return []
  return ids
    .map((id) => expertiseAreas.find((a) => a.id === id))
    .filter((a): a is (typeof expertiseAreas)[number] => Boolean(a))
    .map((a) => ({ key: a.id ?? a.title, label: a.title, sublabel: a.body, href: "/how-i-work#expertise" }))
}

export function resolveBlogArticles(slugs: readonly string[] | undefined): RelatedItem[] {
  if (!slugs?.length) return []
  const combined = [...whatIBringCards, ...standaloneArticles]
  return slugs
    .map((slug) => combined.find((a) => a.slug === slug))
    .filter((a): a is (typeof combined)[number] => Boolean(a))
    .map((a) => ({ key: a.slug, label: a.title, sublabel: a.badge, href: `/blog/${a.slug}` }))
}

export function resolveProcessSteps(ids: readonly string[] | undefined): RelatedItem[] {
  if (!ids?.length) return []
  return ids
    .map((id) => processSteps.find((s) => s.id === id))
    .filter((s): s is (typeof processSteps)[number] => Boolean(s))
    .map((s) => ({ key: s.id ?? s.number, label: `${s.number} · ${s.title}`, sublabel: s.duration, href: "/work-with-me#process" }))
}

export function resolveWorkWithMeFaqs(ids: readonly string[] | undefined): RelatedItem[] {
  if (!ids?.length) return []
  return ids
    .map((id) => workWithMeFaqs.find((f) => f.id === id))
    .filter((f): f is (typeof workWithMeFaqs)[number] => Boolean(f))
    .map((f) => ({ key: f.id ?? f.question, label: f.question, href: "/work-with-me#faqs" }))
}
