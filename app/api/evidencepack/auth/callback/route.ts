import { cookies } from "next/headers"
import { z } from "zod"

import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

const querySchema = z.object({
  token: z.string().min(1),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsed = querySchema.safeParse({ token: url.searchParams.get("token") })
  if (!parsed.success) {
    return Response.redirect(new URL("/evidencepack/login", url), 302)
  }

  const payload = verifyEvidencePackToken(parsed.data.token)
  if (!payload) {
    return Response.redirect(new URL("/evidencepack/login", url), 302)
  }

  const cookieJar = await cookies()
  cookieJar.set(getEvidencePackSessionCookieName(), parsed.data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(payload.exp),
  })

  return Response.redirect(new URL("/evidencepack/app", url), 302)
}

