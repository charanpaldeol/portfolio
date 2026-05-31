import type { MetadataRoute } from "next"

import { allBlogArticles } from "@/lib/all-blog-articles"
import { projects } from "@/lib/projects-data"
import {
  SEO_CONTENT_DATES,
  blogPublishedDate,
  projectLastModified,
} from "@/lib/seo-content-dates"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

function dateFromIso(iso: string): Date {
  return new Date(iso)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL
  const portfolioCore = projectLastModified()
  const workPages = dateFromIso(SEO_CONTENT_DATES.workPages)
  const blogIndex = dateFromIso(SEO_CONTENT_DATES.blogIndex)
  const contact = dateFromIso(SEO_CONTENT_DATES.contact)
  const internetOwned = dateFromIso(SEO_CONTENT_DATES.internetOwned)
  const eyeBreak = dateFromIso(SEO_CONTENT_DATES.eyeBreak)
  const knowledgeGraph = dateFromIso(SEO_CONTENT_DATES.knowledgeGraph)
  const home = dateFromIso(SEO_CONTENT_DATES.siteLaunch)

  const blogPosts = allBlogArticles.map((article) => ({
    url: `${base}/blog/${article.slug}`,
    lastModified: blogPublishedDate(article.slug),
  }))

  const projectPages = projects.map((project) => ({
    url: `${base}/portfolio/projects/${project.slug}`,
    lastModified: portfolioCore,
  }))

  return [
    { url: base, lastModified: home },
    { url: `${base}/blog`, lastModified: blogIndex },
    { url: `${base}/portfolio/about`, lastModified: portfolioCore },
    { url: `${base}/portfolio/experience`, lastModified: portfolioCore },
    { url: `${base}/portfolio/services`, lastModified: portfolioCore },
    { url: `${base}/portfolio/projects`, lastModified: portfolioCore },
    { url: `${base}/what-i-bring`, lastModified: workPages },
    { url: `${base}/how-i-work`, lastModified: workPages },
    { url: `${base}/how-i-think`, lastModified: workPages },
    { url: `${base}/how-i-use-ai`, lastModified: workPages },
    { url: `${base}/tools-and-methods`, lastModified: workPages },
    { url: `${base}/work-with-me`, lastModified: workPages },
    { url: `${base}/contact`, lastModified: contact },
    { url: `${base}/knowledge-graph`, lastModified: knowledgeGraph },
    { url: `${base}/internet-owned`, lastModified: internetOwned },
    { url: `${base}/eye-break`, lastModified: eyeBreak },
    ...blogPosts,
    ...projectPages,
  ]
}
