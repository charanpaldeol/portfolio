import { NextResponse } from "next/server"

import { GITHUB_URL, LINKEDIN_URL } from "@/config/navigation"
import { SITE_URL } from "@/lib/site"

const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400"

export async function GET() {
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
