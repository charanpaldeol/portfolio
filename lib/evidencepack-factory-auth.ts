import { cookies } from "next/headers"

import { getEvidencePackAccess } from "@/lib/evidencepack-access"
import { getEvidencePackSessionCookieName, verifyEvidencePackToken } from "@/lib/evidencepack-auth"

export async function requireEvidencePackFactorySession() {
  const cookieJar = await cookies()
  const token = cookieJar.get(getEvidencePackSessionCookieName())?.value ?? null
  const session = token ? verifyEvidencePackToken(token) : null
  if (!session) return { ok: false as const, status: 401 as const, error: "Unauthorized" }

  const access = await getEvidencePackAccess(session.email)
  const allowed = access.invited || access.subscribed
  if (!allowed) return { ok: false as const, status: 403 as const, error: "Forbidden" }

  return { ok: true as const, session }
}

