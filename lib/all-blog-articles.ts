import { standaloneArticles } from "@/lib/blog-articles-data"
import type { WhatIBringCard } from "@/lib/what-i-bring-cards"
import { whatIBringCards } from "@/lib/what-i-bring-cards"

/** Single ordered list for sitemap, /blog, /llms*, and /api/content/articles. */
export const allBlogArticles: WhatIBringCard[] = [...whatIBringCards, ...standaloneArticles]
