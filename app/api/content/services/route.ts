import { NextResponse } from "next/server"

import { services } from "@/lib/services-data"

const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400"

export async function GET() {
  return NextResponse.json(services, {
    headers: { "Cache-Control": CACHE_CONTROL },
  })
}
