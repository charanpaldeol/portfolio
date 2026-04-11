import { z } from "zod"

const healthJson = z.object({ status: z.literal("ok") })

export async function GET() {
  const body = { status: "ok" as const }
  healthJson.parse(body)
  return Response.json(body)
}
