/** Stable last-modified dates for sitemap entries (ISO date strings). */
export const SEO_CONTENT_DATES = {
  siteLaunch: "2025-01-15",
  blogIndex: "2026-03-01",
  portfolioCore: "2026-02-01",
  workPages: "2026-02-15",
  contact: "2025-06-01",
  internetOwned: "2025-11-01",
  eyeBreak: "2025-09-01",
  knowledgeGraph: "2026-03-01",
} as const

/** Per-slug publication dates for blog articles. */
export const BLOG_PUBLISHED_DATES: Record<string, string> = {
  "problem-framing": "2025-02-10",
  "solution-design": "2025-03-05",
  "ai-native-delivery": "2025-04-12",
  "engineering-depth": "2025-05-20",
  "value-realization": "2025-06-18",
  "prompt-as-design-artifact": "2025-08-01",
  "why-design-systems-fail": "2025-09-14",
  "designing-for-decisions": "2025-10-22",
}

export function blogPublishedDate(slug: string): Date {
  const iso = BLOG_PUBLISHED_DATES[slug] ?? SEO_CONTENT_DATES.blogIndex
  return new Date(iso)
}

export function projectLastModified(): Date {
  return new Date(SEO_CONTENT_DATES.portfolioCore)
}
