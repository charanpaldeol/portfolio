import { NextResponse } from "next/server"

import { projects } from "@/lib/projects-data"

const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400"

export async function GET() {
  return NextResponse.json(projects, {
    headers: { "Cache-Control": CACHE_CONTROL },
  })
}
