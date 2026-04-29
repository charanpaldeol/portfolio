import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import {
  MarketEvidenceFileSchema,
  MarketSourcesFileSchema,
  type EvidenceSnippet,
  type MarketSource,
} from "@/lib/agent-factory/market"

function nowIso() {
  return new Date().toISOString()
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hashUrl(url: string) {
  return createHash("sha256").update(url, "utf8").digest("hex").slice(0, 32)
}

function stripTags(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function excerptText(text: string, max = 2000) {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

async function fetchText(args: { url: string; timeoutMs: number }): Promise<{ ok: boolean; status: number; text: string; error: string | null }> {
  const { url, timeoutMs } = args
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: {
        "user-agent": "PortfolioFactoryMarketScan/1.0",
        accept: "application/rss+xml, application/xml, text/xml, text/html, */*",
      },
    })
    const text = await res.text()
    return { ok: res.ok, status: res.status, text, error: res.ok ? null : `HTTP ${res.status}` }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, status: 0, text: "", error: msg }
  } finally {
    clearTimeout(t)
  }
}

function parseRssLinks(xml: string, fallbackBase: string): Array<{ url: string; title: string | null }> {
  const out: Array<{ url: string; title: string | null }> = []
  const blocks = xml.split(/<item[\s>]/i).slice(1)
  for (const raw of blocks) {
    const block = raw.split(/<\/item>/i)[0] ?? raw
    const titleMatch =
      block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ?? block.match(/<title>([\s\S]*?)<\/title>/i)
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/i)
    const title = titleMatch ? stripTags(titleMatch[1] ?? "").trim() || null : null
    let url = linkMatch ? (linkMatch[1] ?? "").trim() : ""
    if (!url) continue
    if (url.startsWith("//")) url = `https:${url}`
    if (url.startsWith("/")) {
      try {
        url = new URL(url, fallbackBase).toString()
      } catch {
        continue
      }
    }
    out.push({ url, title })
  }
  return out
}

async function collectFromSource(source: MarketSource, timeoutMs: number): Promise<Omit<EvidenceSnippet, "fetched_at">[]> {
  const fetched = await fetchText({ url: source.url, timeoutMs })
  const ts = nowIso()
  if (!fetched.ok || !fetched.text) {
    return [
      {
        id: hashUrl(source.url),
        url: source.url,
        title: source.label ?? null,
        excerpt: "",
        source_kind: source.kind,
        fetch_ok: false,
        fetch_error: fetched.error ?? `HTTP ${fetched.status}`,
      },
    ]
  }

  if (source.kind === "rss") {
    const links = parseRssLinks(fetched.text, source.url).slice(0, 25)
    if (!links.length) {
      return [
        {
          id: hashUrl(source.url),
          url: source.url,
          title: source.label ?? "RSS feed",
          excerpt: excerptText(stripTags(fetched.text).slice(0, 500)),
          source_kind: "rss",
          fetch_ok: true,
          fetch_error: null,
        },
      ]
    }

    const snippets: Omit<EvidenceSnippet, "fetched_at">[] = []
    for (const item of links) {
      const child = await fetchText({ url: item.url, timeoutMs })
      await sleep(Number(process.env.FACTORY_MARKET_FETCH_DELAY_MS ?? "400"))
      const body = child.ok ? stripTags(child.text) : ""
      snippets.push({
        id: hashUrl(item.url),
        url: item.url,
        title: item.title,
        excerpt: excerptText(child.ok ? body : (child.error ?? `HTTP ${child.status}`)),
        source_kind: "rss",
        fetch_ok: child.ok,
        fetch_error: child.ok ? null : child.error ?? `HTTP ${child.status}`,
      })
    }
    return snippets
  }

  return [
    {
      id: hashUrl(source.url),
      url: source.url,
      title: source.label ?? null,
      excerpt: excerptText(stripTags(fetched.text)),
      source_kind: "url",
      fetch_ok: true,
      fetch_error: null,
    },
  ]
}

async function main() {
  const root = process.cwd()
  const sourcesPath = path.join(root, "agents", "market-sources.json")
  const evidencePath = path.join(root, "agents", "market-evidence.json")
  const timeoutMs = Number(process.env.FACTORY_MARKET_FETCH_TIMEOUT_MS ?? "15000")

  const sourcesRaw = await readFile(sourcesPath, "utf8")
  const sourcesFile = MarketSourcesFileSchema.parse(JSON.parse(sourcesRaw) as unknown)

  let existing: EvidenceSnippet[] = []
  try {
    const prev = await readFile(evidencePath, "utf8")
    const parsed = MarketEvidenceFileSchema.parse(JSON.parse(prev) as unknown)
    existing = parsed.snippets
  } catch {
    existing = []
  }
  const byId = new Map(existing.map((s) => [s.id, s] as const))

  for (const source of sourcesFile.sources) {
    try {
      const rows = await collectFromSource(source, timeoutMs)
      for (const row of rows) {
        byId.set(row.id, { ...row, fetched_at: nowIso() })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      const id = hashUrl(source.url)
      byId.set(id, {
        id,
        url: source.url,
        title: source.label ?? null,
        excerpt: "",
        fetched_at: nowIso(),
        source_kind: source.kind,
        fetch_ok: false,
        fetch_error: msg,
      })
    }
    await sleep(Number(process.env.FACTORY_MARKET_FETCH_DELAY_MS ?? "400"))
  }

  const next: EvidenceSnippet[] = Array.from(byId.values()).sort((a, b) => a.url.localeCompare(b.url))
  const file: unknown = {
    version: 1,
    snippets: next,
    updated_at: nowIso(),
  }
  await mkdir(path.dirname(evidencePath), { recursive: true })
  await writeFile(evidencePath, `${JSON.stringify(MarketEvidenceFileSchema.parse(file), null, 2)}\n`, "utf8")
  console.log(`factory:market:scan: wrote ${next.length} snippet(s) -> agents/market-evidence.json`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
