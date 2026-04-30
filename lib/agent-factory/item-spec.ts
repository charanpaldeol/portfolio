import { z } from "zod"

/** Optional fields on queue/roadmap `spec` understood by the factory runtime. */
export const FactoryItemSpecFieldsSchema = z.object({
  command: z.string().optional(),
  acceptance: z.union([z.string(), z.array(z.string())]).optional(),
  require_diff: z.boolean().optional(),
})

export type FactoryItemSpecFields = z.infer<typeof FactoryItemSpecFieldsSchema>

export function parseFactoryItemSpec(spec: unknown): {
  command: string | null
  acceptanceCommands: string[]
  requireDiff: boolean
} {
  if (typeof spec !== "object" || spec === null) {
    return { command: null, acceptanceCommands: [], requireDiff: false }
  }
  const parsed = FactoryItemSpecFieldsSchema.safeParse(spec)
  if (!parsed.success) {
    const rec = spec as { command?: unknown; acceptance?: unknown; require_diff?: unknown }
    const command =
      typeof rec.command === "string" && rec.command.trim() ? rec.command.trim() : null
    const acceptanceCommands: string[] = []
    if (typeof rec.acceptance === "string" && rec.acceptance.trim()) acceptanceCommands.push(rec.acceptance.trim())
    else if (Array.isArray(rec.acceptance)) {
      for (const line of rec.acceptance) {
        if (typeof line === "string" && line.trim()) acceptanceCommands.push(line.trim())
      }
    }
    return {
      command,
      acceptanceCommands,
      requireDiff: rec.require_diff === true,
    }
  }
  const v = parsed.data
  const command = typeof v.command === "string" && v.command.trim() ? v.command.trim() : null
  const acceptanceCommands: string[] = []
  if (typeof v.acceptance === "string" && v.acceptance.trim()) {
    acceptanceCommands.push(v.acceptance.trim())
  } else if (Array.isArray(v.acceptance)) {
    for (const line of v.acceptance) {
      if (typeof line === "string" && line.trim()) acceptanceCommands.push(line.trim())
    }
  }
  return {
    command,
    acceptanceCommands,
    requireDiff: v.require_diff === true,
  }
}
