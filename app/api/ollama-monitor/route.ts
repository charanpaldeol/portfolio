import { z } from "zod"

import { featureFlag } from "@/lib/feature-flags"
import { fetchOllamaMonitorSnapshot } from "@/lib/ollama-monitor-data"

const ResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    fetchedAt: z.string(),
    origin: z.string(),
    version: z.string().nullable(),
    rootBody: z.string().nullable(),
    tags: z.array(
      z.object({
        name: z.string(),
        size: z.number().optional(),
        modified_at: z.string().optional(),
      }),
    ),
    ps: z.array(
      z.object({
        name: z.string(),
        model: z.string(),
        size: z.number().optional(),
        size_vram: z.number().optional(),
        context_length: z.number().optional(),
        expires_at: z.string().optional(),
      }),
    ),
  }),
})

export async function GET() {
  if (!featureFlag("ollama-live-stats")) {
    return new Response(JSON.stringify({ ok: false, error: "disabled" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    })
  }

  const data = await fetchOllamaMonitorSnapshot()
  const body = ResponseSchema.parse({ ok: true as const, data })
  return Response.json(body)
}
