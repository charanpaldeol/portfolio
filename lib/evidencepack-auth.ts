import { createHmac, timingSafeEqual } from "crypto"

import { env } from "@/env.mjs"

const COOKIE_NAME = "ep_session"

type SessionPayload = {
  email: string
  exp: number
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url")
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8")
}

function sign(raw: string) {
  const secret = env.EVIDENCEPACK_AUTH_SECRET
  if (!secret) return null
  return createHmac("sha256", secret).update(raw).digest("base64url")
}

export function getEvidencePackSessionCookieName() {
  return COOKIE_NAME
}

export function createEvidencePackMagicLinkToken(email: string, ttlMs: number) {
  const exp = Date.now() + ttlMs
  const payload: SessionPayload = { email, exp }
  const raw = JSON.stringify(payload)
  const sig = sign(raw)
  if (!sig) return null
  return `${base64UrlEncode(raw)}.${sig}`
}

export function verifyEvidencePackToken(token: string): SessionPayload | null {
  const secret = env.EVIDENCEPACK_AUTH_SECRET
  if (!secret) return null
  const [b64, sig] = token.split(".")
  if (!b64 || !sig) return null

  let raw: string
  try {
    raw = base64UrlDecode(b64)
  } catch {
    return null
  }

  const expected = createHmac("sha256", secret).update(raw).digest("base64url")
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  if (!timingSafeEqual(a, b)) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof parsed !== "object" || parsed === null) return null
  const record = parsed as Record<string, unknown>
  const email = record["email"]
  const exp = record["exp"]
  if (typeof email !== "string" || typeof exp !== "number") return null
  if (!email.includes("@")) return null
  if (Date.now() > exp) return null
  return { email, exp }
}

