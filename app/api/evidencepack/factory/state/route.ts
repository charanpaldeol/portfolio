import { z } from "zod"

import { readFactoryQueueFile, readFactoryRunsFile } from "@/lib/agent-factory/mutate"
import { requireEvidencePackFactorySession } from "@/lib/evidencepack-factory-auth"

export async function GET(request: Request) {
  try {
    const auth = await requireEvidencePackFactorySession()
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const url = new URL(request.url)
    const parsed = z
      .object({
        limitRuns: z.coerce.number().int().min(1).max(50).default(15),
      })
      .safeParse(Object.fromEntries(url.searchParams))

    const limitRuns = parsed.success ? parsed.data.limitRuns : 15

    const [queue, runs] = await Promise.all([readFactoryQueueFile(), readFactoryRunsFile()])
    return Response.json({
      queue,
      runs: { ...runs, runs: runs.runs.slice(0, limitRuns) },
    })
  } catch (err) {
    console.error("EvidencePack factory state API error:", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}

