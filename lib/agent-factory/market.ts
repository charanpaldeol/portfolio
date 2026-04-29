import { z } from "zod"

export const MarketSourceRssSchema = z.object({
  kind: z.literal("rss"),
  url: z.string().url(),
  label: z.string().optional(),
})

export const MarketSourceUrlSchema = z.object({
  kind: z.literal("url"),
  url: z.string().url(),
  label: z.string().optional(),
})

export const MarketSourceSchema = z.discriminatedUnion("kind", [MarketSourceRssSchema, MarketSourceUrlSchema])
export type MarketSource = z.infer<typeof MarketSourceSchema>

export const MarketSourcesFileSchema = z.object({
  version: z.literal(1),
  sources: z.array(MarketSourceSchema),
})
export type MarketSourcesFile = z.infer<typeof MarketSourcesFileSchema>

export const EvidenceSnippetSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  title: z.string().nullable(),
  excerpt: z.string(),
  fetched_at: z.string(),
  source_kind: z.enum(["rss", "url"]),
  fetch_ok: z.boolean(),
  fetch_error: z.string().nullable(),
})
export type EvidenceSnippet = z.infer<typeof EvidenceSnippetSchema>

export const MarketEvidenceFileSchema = z.object({
  version: z.literal(1),
  snippets: z.array(EvidenceSnippetSchema),
  updated_at: z.string(),
})
export type MarketEvidenceFile = z.infer<typeof MarketEvidenceFileSchema>

export const ProductSeedSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  keywords: z.array(z.string().min(1)),
  icp: z.string().optional(),
  pricing_hypothesis: z.string().optional(),
  /** Static priors 0–10 per dimension (optional); merged with evidence-derived signal */
  priors: z
    .object({
      tam: z.number().min(0).max(10).optional(),
      urgency: z.number().min(0).max(10).optional(),
      competition: z.number().min(0).max(10).optional(),
      founder_fit: z.number().min(0).max(10).optional(),
      build_time: z.number().min(0).max(10).optional(),
      pricing_power: z.number().min(0).max(10).optional(),
    })
    .optional(),
})
export type ProductSeed = z.infer<typeof ProductSeedSchema>

export const ProductSeedsFileSchema = z.object({
  version: z.literal(1),
  items: z.array(ProductSeedSchema),
})
export type ProductSeedsFile = z.infer<typeof ProductSeedsFileSchema>

export const ScoreBreakdownSchema = z.object({
  tam: z.number(),
  urgency: z.number(),
  competition: z.number(),
  founder_fit: z.number(),
  build_time: z.number(),
  pricing_power: z.number(),
  weighted_total: z.number(),
  evidence_hits: z.number(),
})
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>

export const ProductCandidateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  seed_id: z.string().min(1),
  score: ScoreBreakdownSchema,
  matched_snippet_ids: z.array(z.string()),
})
export type ProductCandidate = z.infer<typeof ProductCandidateSchema>

export const ProductCandidatesFileSchema = z.object({
  version: z.literal(1),
  candidates: z.array(ProductCandidateSchema),
  updated_at: z.string(),
})
export type ProductCandidatesFile = z.infer<typeof ProductCandidatesFileSchema>

export const SelectedProductSchema = z.object({
  version: z.literal(1),
  product_id: z.string().min(1),
  name: z.string().min(1),
  icp: z.string(),
  pricing_hypothesis: z.string(),
  chosen_at: z.string(),
  score: ScoreBreakdownSchema,
  evidence_snippet_ids: z.array(z.string()),
})
export type SelectedProduct = z.infer<typeof SelectedProductSchema>

const WEIGHTS = {
  tam: 0.2,
  urgency: 0.2,
  competition: 0.15,
  founder_fit: 0.15,
  build_time: 0.15,
  pricing_power: 0.15,
} as const

function clamp01(n: number) {
  return Math.max(0, Math.min(10, n))
}

function countKeywordHits(text: string, keywords: string[]) {
  const lower = text.toLowerCase()
  let hits = 0
  for (const k of keywords) {
    const kk = k.toLowerCase()
    if (!kk) continue
    let idx = 0
    while (idx < lower.length) {
      const found = lower.indexOf(kk, idx)
      if (found === -1) break
      hits += 1
      idx = found + kk.length
    }
  }
  return hits
}

export function scoreCandidate(args: {
  seed: ProductSeed
  corpus: string
  snippetIds: string[]
}): ScoreBreakdown {
  const { seed, corpus, snippetIds: _snippetIds } = args
  const hits = countKeywordHits(corpus, seed.keywords)
  const signal = Math.min(10, hits * 1.5)

  const p = seed.priors ?? {}
  const tam = clamp01((p.tam ?? 5) + signal * 0.15)
  const urgency = clamp01((p.urgency ?? 5) + signal * 0.2)
  const competition = clamp01((p.competition ?? 5) - signal * 0.05)
  const founder_fit = clamp01((p.founder_fit ?? 6) + signal * 0.1)
  const build_time = clamp01((p.build_time ?? 5) - signal * 0.1)
  const pricing_power = clamp01((p.pricing_power ?? 5) + signal * 0.15)

  const weighted_total =
    tam * WEIGHTS.tam +
    urgency * WEIGHTS.urgency +
    competition * WEIGHTS.competition +
    founder_fit * WEIGHTS.founder_fit +
    build_time * WEIGHTS.build_time +
    pricing_power * WEIGHTS.pricing_power

  return {
    tam,
    urgency,
    competition,
    founder_fit,
    build_time,
    pricing_power,
    weighted_total,
    evidence_hits: hits,
  }
}

export function selectTopCandidate(candidates: ProductCandidate[]): ProductCandidate | null {
  if (!candidates.length) return null
  return candidates.slice().sort((a, b) => b.score.weighted_total - a.score.weighted_total)[0] ?? null
}

export type RoadmapTemplateItem = {
  id: string
  title: string
  priority: number
  definition_of_done: string[]
}

function slugForRoadmapId(productId: string) {
  return productId
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "")
    .slice(0, 24) || "PRODUCT"
}

export function buildRoadmapTemplateForProduct(args: {
  productName: string
  productId: string
  /** Monotonic revision so new roadmaps do not collide with completed queue IDs */
  roadmapRevision?: number
}): RoadmapTemplateItem[] {
  const { productName, productId, roadmapRevision = 0 } = args
  const S = slugForRoadmapId(productId)
  const prefix = roadmapRevision > 0 ? `${S}_R${roadmapRevision}` : S
  const p = (n: string) => `${prefix}_${n}`
  return [
    {
      id: p("REVENUE_PRICING_PAGE_V1"),
      title: `${productName}: pricing page v1`,
      priority: 1000,
      definition_of_done: [
        "Pricing page exists with one clear plan and CTA",
        "CTA leads to login/signup entrypoint",
        "No placeholder links or dead ends",
      ],
    },
    {
      id: p("REVENUE_AUTH_MAGIC_LINK_V1"),
      title: `${productName}: magic-link auth v1`,
      priority: 990,
      definition_of_done: [
        "User can request a magic link and establish a session cookie",
        "After login, user is redirected into the app",
        "Auth failure states are handled",
      ],
    },
    {
      id: p("REVENUE_STRIPE_CHECKOUT_V1"),
      title: `${productName}: Stripe Checkout session creation v1`,
      priority: 980,
      definition_of_done: [
        "Authenticated user can start checkout from inside the app",
        "Checkout success/cancel URLs are correct",
        "No secrets leak to the client",
      ],
    },
    {
      id: p("REVENUE_STRIPE_WEBHOOKS_V1"),
      title: `${productName}: Stripe webhooks → subscription record v1`,
      priority: 970,
      definition_of_done: [
        "Webhook endpoint verifies signature and records subscription status",
        "DB subscription state updates on relevant Stripe events",
        "Handles replay/idempotency safely",
      ],
    },
    {
      id: p("REVENUE_ACCESS_GATING_V1"),
      title: `${productName}: paid access gating v1`,
      priority: 960,
      definition_of_done: [
        "App gates paid features behind subscription/invite access",
        "Gating uses a single source of truth for access checks",
        "Locked states explain what to do next",
      ],
    },
    {
      id: p("CORE_UPLOAD_PDF_V1"),
      title: `${productName}: upload PDF v1 (store file + metadata)`,
      priority: 900,
      definition_of_done: [
        "Upload PDF stores blob and writes document metadata row",
        "Upload UI shows success + lists recent uploads",
        "Large file and type errors are handled",
      ],
    },
    {
      id: p("CORE_PDF_INGEST_PIPELINE_V1"),
      title: `${productName}: PDF ingest pipeline v1 (chunks in DB)`,
      priority: 890,
      definition_of_done: [
        "Uploaded PDFs are ingested into chunk rows",
        "Chunks are queryable for drafting and citations",
        "Ingest can be retried safely",
      ],
    },
    {
      id: p("CORE_QUESTIONNAIRES_MODEL_V1"),
      title: `${productName}: questionnaires model v1 (persist + list + open)`,
      priority: 880,
      definition_of_done: [
        "Questionnaire entity can be saved and re-opened",
        "List view shows questionnaires for current user",
        "DB schema + types are defined",
      ],
    },
    {
      id: p("CORE_DRAFT_WITH_CITATIONS_V1"),
      title: `${productName}: draft answers with citations v1 (flagged)`,
      priority: 870,
      definition_of_done: [
        "Draft answers can be generated referencing chunks",
        "Citations are stored per question",
        "UI is gated behind a feature flag",
      ],
    },
    {
      id: p("EXPORT_CSV_V1"),
      title: `${productName}: questionnaire CSV export v1`,
      priority: 800,
      definition_of_done: [
        "Export CSV for a saved questionnaire",
        "Export includes answers + citation references",
        "Download works from the app UI",
      ],
    },
    {
      id: p("EXPORT_EVIDENCE_ZIP_V1"),
      title: `${productName}: evidence pack ZIP export v1`,
      priority: 790,
      definition_of_done: [
        "Export zip contains questionnaire CSV + evidence snippets",
        "Export has a manifest for traceability",
        "Works for a saved questionnaire",
      ],
    },
    {
      id: p("RELIABILITY_EVENT_LOG_V1"),
      title: `${productName}: event log v1 (minimal audit trail)`,
      priority: 700,
      definition_of_done: [
        "Key actions emit events with request id + user identifier",
        "Events are queryable for support/debug",
        "No PII leakage beyond what is required",
      ],
    },
  ]
}
