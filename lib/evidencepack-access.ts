import { getDb } from "@/lib/db"

export type EvidencePackAccess = {
  invited: boolean
  subscribed: boolean
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function getEvidencePackAccess(ownerEmail: string): Promise<EvidencePackAccess> {
  const sql = getDb()
  if (!sql) return { invited: false, subscribed: false }

  const emailNormalized = normalizeEmail(ownerEmail)

  const invited = await (async () => {
    try {
      const rows: unknown = await sql`SELECT 1 AS ok FROM evidencepack_invites WHERE invited_email_normalized = ${emailNormalized} LIMIT 1`
      return Array.isArray(rows) && rows.length > 0
    } catch (e) {
      console.error("EvidencePack access invite lookup error:", e)
      return false
    }
  })()

  const subscribed = await (async () => {
    try {
      const rows: unknown = await sql`SELECT status FROM evidencepack_subscriptions WHERE owner_email = ${ownerEmail} LIMIT 1`
      if (!Array.isArray(rows) || rows.length === 0) return false
      const first = rows[0]
      if (typeof first !== "object" || first === null) return false
      const record = first as Record<string, unknown>
      const status = record["status"]
      return status === "active" || status === "trialing"
    } catch (e) {
      console.error("EvidencePack access subscription lookup error:", e)
      return false
    }
  })()

  return { invited, subscribed }
}

