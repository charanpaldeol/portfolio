import { NextResponse } from "next/server"

import { allBlogArticles } from "@/lib/all-blog-articles"

const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400"

export async function GET() {
  const articles = allBlogArticles
  return NextResponse.json(articles, {
    headers: { "Cache-Control": CACHE_CONTROL },
  })
}
