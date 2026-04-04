import type { MetadataRoute } from "next"

import { whatIBringCards } from "@/lib/what-i-bring-cards"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cpdeol.com"

  const blogPosts = whatIBringCards.map((card) => ({
    url: `${base}/blog/${card.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/portfolio/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/portfolio/experience`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/portfolio/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/eye-break`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/internet-owned`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    ...blogPosts,
  ]
}
