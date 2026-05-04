import { z } from "zod"

const OllamaVersionSchema = z.object({ version: z.string() })

const OllamaTagModelSchema = z.object({
  name: z.string(),
  size: z.number().optional(),
  modified_at: z.string().optional(),
})

const OllamaTagsSchema = z.object({
  models: z.array(OllamaTagModelSchema),
})

const OllamaPsModelSchema = z.object({
  name: z.string(),
  model: z.string(),
  size: z.number().optional(),
  size_vram: z.number().optional(),
  context_length: z.number().optional(),
  expires_at: z.string().optional(),
})

const OllamaPsSchema = z.object({
  models: z.array(OllamaPsModelSchema),
})

export type OllamaMonitorPayload = {
  fetchedAt: string
  origin: string
  version: string | null
  tags: z.infer<typeof OllamaTagsSchema>["models"]
  ps: z.infer<typeof OllamaPsSchema>["models"]
  rootBody: string | null
}

export function ollamaMonitorOrigin(): string {
  const raw =
    (process.env.OLLAMA_MONITOR_ORIGIN ?? process.env.FACTORY_RESEARCH_OLLAMA_URL ?? "http://127.0.0.1:11434").trim()
  return raw.replace(/\/+$/, "")
}

export function formatBytes(n: number | undefined): string {
  if (n === undefined || !Number.isFinite(n) || n < 0) return "—"
  const units = ["B", "KB", "MB", "GB", "TB"]
  let v = n
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i += 1
  }
  const digits = i === 0 ? 0 : v >= 100 ? 0 : v >= 10 ? 1 : 2
  return `${v.toFixed(digits)} ${units[i]}`
}

async function readText(origin: string, path: string, ms: number): Promise<string | null> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(`${origin}${path}`, { signal: ctrl.signal, cache: "no-store" })
    if (!r.ok) return null
    return await r.text()
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

async function readJson<T>(origin: string, path: string, schema: z.ZodType<T>, ms: number): Promise<T | null> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(`${origin}${path}`, { signal: ctrl.signal, cache: "no-store" })
    if (!r.ok) return null
    const json: unknown = await r.json()
    const parsed = schema.safeParse(json)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

export async function fetchOllamaMonitorSnapshot(): Promise<OllamaMonitorPayload> {
  const origin = ollamaMonitorOrigin()
  const [rootBody, versionJson, tagsJson, psJson] = await Promise.all([
    readText(origin, "/", 3000),
    readJson(origin, "/api/version", OllamaVersionSchema, 3000),
    readJson(origin, "/api/tags", OllamaTagsSchema, 3000),
    readJson(origin, "/api/ps", OllamaPsSchema, 3000),
  ])

  return {
    fetchedAt: new Date().toISOString(),
    origin,
    version: versionJson?.version ?? null,
    tags: tagsJson?.models ?? [],
    ps: psJson?.models ?? [],
    rootBody: rootBody?.trim() ? rootBody.trim().slice(0, 200) : null,
  }
}
