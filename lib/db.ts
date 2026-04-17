import { neon } from "@neondatabase/serverless"

import { env } from "@/env.mjs"

let sql: ReturnType<typeof neon> | null = null

/** Neon SQL client; `null` when `DATABASE_URL` is not set. */
export function getDb() {
  const url = env.DATABASE_URL
  if (!url) return null
  if (!sql) sql = neon(url)
  return sql
}
