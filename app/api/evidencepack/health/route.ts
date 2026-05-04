import { z } from "zod"

import { env } from "@/env.mjs"

const querySchema = z.object({
  ping: z.string().optional(),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsed = querySchema.safeParse({ ping: url.searchParams.get("ping") })
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  return Response.json({
    ok: true,
    config: {
      database: Boolean(env.DATABASE_URL),
      resend: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
      auth: Boolean(env.EVIDENCEPACK_AUTH_SECRET),
      blob: Boolean(env.BLOB_READ_WRITE_TOKEN),
    },
  })
}

