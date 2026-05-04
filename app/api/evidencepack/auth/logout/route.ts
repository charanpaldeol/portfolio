import { cookies } from "next/headers"
import { z } from "zod"

import { getEvidencePackSessionCookieName } from "@/lib/evidencepack-auth"

const bodySchema = z.object({})

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  const url = new URL(request.url)
  const cookieJar = await cookies()
  cookieJar.set(getEvidencePackSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })
  return Response.redirect(new URL("/evidencepack", url), 302)
}

