import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { allBlogArticles } from "@/lib/all-blog-articles"

const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400"

const querySchema = z.object({}).strict()

export async function GET(request: NextRequest) {
  const query = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = querySchema.safeParse(query)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 })
  }
  return NextResponse.json(allBlogArticles, {
    headers: { "Cache-Control": CACHE_CONTROL },
  })
}
