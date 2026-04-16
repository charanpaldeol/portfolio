import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { GITHUB_URL, LINKEDIN_URL } from "@/config/navigation"
import { SITE_URL } from "@/lib/site"

const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400"

const querySchema = z.object({}).strict()

export async function GET(request: NextRequest) {
  const query = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = querySchema.safeParse(query)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 })
  }
  const body = {
    name: "Charan Deol",
    siteUrl: SITE_URL,
    jobTitle: "Product Engineer & Consultant",
    sameAs: [GITHUB_URL, LINKEDIN_URL, SITE_URL],
  }
  return NextResponse.json(body, {
    headers: { "Cache-Control": CACHE_CONTROL },
  })
}
