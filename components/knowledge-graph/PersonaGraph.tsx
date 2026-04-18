"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <GraphSkeleton />,
})

// ── Graphify schema — mirrors graphify-content/graph.json exactly ──────────────

type FileType = "code" | "document" | "concept" | "rationale" | "image" | "paper"

interface GraphifyNode {
  id: string
  label: string
  file_type: FileType
  community: number
  source_file?: string
  source_location?: string | null
  source_url?: string | null
  author?: string | null
  contributor?: string | null
  norm_label?: string
}

interface GraphifyLink {
  source: string
  target: string
  relation: string
  weight?: number
  confidence?: string
  confidence_score?: number
  source_file?: string
  source_location?: string | null
}

interface GraphifyGraph {
  directed: boolean
  multigraph: boolean
  graph?: unknown
  nodes: GraphifyNode[]
  links: GraphifyLink[]
}

type MutableNode = GraphifyNode & {
  x?: number
  y?: number
  fx?: number
  fy?: number
}

type MutableLink = Omit<GraphifyLink, "source" | "target"> & {
  source: string | MutableNode
  target: string | MutableNode
}

// ── Editorial palette resolved at runtime from CSS vars ────────────────────────

interface Palette {
  surface: string
  surfaceContainer: string
  onSurface: string
  onSurfaceVariant: string
  primary: string
  outline: string
  /** Graphify's native Tableau-10 categorical palette, resolved from CSS vars. */
  graphifyCats: string[]
}

// Fallbacks mirror the @theme declarations in styles/tailwind.css. They're
// only used for SSR/first-paint before getComputedStyle returns live values.
const FALLBACK_GRAPHIFY_CATS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ac",
]

const DEFAULT_PALETTE: Palette = {
  surface: "#fcf9f5",
  surfaceContainer: "#e5e1d8",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#5c5d59",
  primary: "#00694c",
  outline: "#5c5d59",
  graphifyCats: FALLBACK_GRAPHIFY_CATS,
}

function readPalette(root: HTMLElement): Palette {
  const styles = getComputedStyle(root)
  const v = (name: string, fallback: string): string => {
    const raw = styles.getPropertyValue(name).trim()
    return raw || fallback
  }
  const cats = FALLBACK_GRAPHIFY_CATS.map((fb, i) =>
    v(`--color-graphify-cat-${i}`, fb),
  )
  return {
    surface: v("--color-surface", DEFAULT_PALETTE.surface),
    surfaceContainer: v("--color-surface-container", DEFAULT_PALETTE.surfaceContainer),
    onSurface: v("--color-on-surface", DEFAULT_PALETTE.onSurface),
    onSurfaceVariant: v("--color-on-surface-variant", DEFAULT_PALETTE.onSurfaceVariant),
    primary: v("--color-primary", DEFAULT_PALETTE.primary),
    outline: v("--color-outline-variant", DEFAULT_PALETTE.outline),
    graphifyCats: cats,
  }
}

// Graphify's own graph.html cycles communities through Tableau-10 categorical
// hues — we mirror that here so colors feel consistent with graphify's output.
function communityColor(cid: number, p: Palette): string {
  const idx = Math.abs(cid) % p.graphifyCats.length
  return p.graphifyCats[idx]!
}

// ── File-type filters (graphify's own taxonomy) ────────────────────────────────

const FILE_TYPE_LABEL: Record<FileType, string> = {
  code: "Code",
  document: "Documents",
  concept: "Concepts",
  rationale: "Rationales",
  image: "Images",
  paper: "Papers",
}

const FILE_TYPES_ORDER: FileType[] = ["code", "document", "concept", "rationale", "image", "paper"]

// ── Main component ─────────────────────────────────────────────────────────────

export function PersonaGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<unknown>(null)
  const [palette, setPalette] = useState<Palette>(DEFAULT_PALETTE)
  const [size, setSize] = useState({ width: 900, height: 640 })
  const [graph, setGraph] = useState<GraphifyGraph | null>(null)
  const [communityLabels, setCommunityLabels] = useState<Record<number, string>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTypes, setActiveTypes] = useState<Set<FileType>>(
    () => new Set(FILE_TYPES_ORDER),
  )

  // Resolve palette + resize --------------------------------------------------
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setPalette(readPalette(document.documentElement))
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) setSize({ width: rect.width, height: rect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Fetch graphify artefacts (served from /public/knowledge-graph) ------------
  useEffect(() => {
    let alive = true
    ;(async () => {
      const [g, l] = await Promise.all([
        fetch("/knowledge-graph/graph.json").then((r) => r.json()),
        fetch("/knowledge-graph/labels.json").then((r) => r.json()),
      ])
      if (!alive) return
      setGraph(g as GraphifyGraph)
      const labels: Record<number, string> = {}
      for (const [k, v] of Object.entries(l as Record<string, string>)) {
        labels[Number(k)] = v
      }
      setCommunityLabels(labels)
    })().catch((err) => {
      console.error("[knowledge-graph] failed to load graphify data", err)
    })
    return () => {
      alive = false
    }
  }, [])

  // Derived view data ---------------------------------------------------------
  const filtered = useMemo(() => {
    if (!graph) return { nodes: [] as MutableNode[], links: [] as MutableLink[] }
    const kept = new Set(
      graph.nodes.filter((n) => activeTypes.has(n.file_type)).map((n) => n.id),
    )
    const nodes = graph.nodes.filter((n) => kept.has(n.id)).map<MutableNode>((n) => ({ ...n }))
    const links = graph.links
      .filter((e) => kept.has(e.source as string) && kept.has(e.target as string))
      .map<MutableLink>((e) => ({ ...e }))
    return { nodes, links }
  }, [graph, activeTypes])

  const nodeById = useMemo(() => {
    const m = new Map<string, GraphifyNode>()
    if (graph) for (const n of graph.nodes) m.set(n.id, n)
    return m
  }, [graph])

  const selected = selectedId ? (nodeById.get(selectedId) ?? null) : null

  // Top communities by size for the legend (graphify emits 148; keep it scannable)
  const topCommunities = useMemo(() => {
    if (!graph) return [] as Array<{ cid: number; size: number }>
    const sizeMap = new Map<number, number>()
    for (const n of graph.nodes) sizeMap.set(n.community, (sizeMap.get(n.community) ?? 0) + 1)
    return Array.from(sizeMap.entries())
      .map(([cid, size]) => ({ cid, size }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 15)
  }, [graph])

  // File-type counts for the filter rail
  const typeCounts = useMemo(() => {
    const c: Record<string, number> = {}
    if (graph) for (const n of graph.nodes) c[n.file_type] = (c[n.file_type] ?? 0) + 1
    return c
  }, [graph])

  const toggleType = (t: FileType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  // Custom canvas renderers ---------------------------------------------------
  const renderNode = useCallback(
    (nodeUntyped: unknown, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const node = nodeUntyped as MutableNode
      if (node.x === undefined || node.y === undefined) return

      // Radius scales modestly; graphify doesn't emit a degree field so use a
      // base size and let force-graph's default collision handle density.
      const radius = node.file_type === "code" ? 3.2 : 3.8
      const color = communityColor(node.community, palette)
      const isActive = selectedId === node.id

      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false)
      ctx.fillStyle = color
      ctx.globalAlpha = isActive || !selectedId ? 1 : 0.7
      ctx.fill()
      if (isActive) {
        ctx.lineWidth = 2 / globalScale
        ctx.strokeStyle = palette.onSurface
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Only show labels at decent zoom or when a node is selected/hovered,
      // otherwise 439 labels overlap into illegibility.
      if (globalScale > 2 || isActive) {
        const fontSize = Math.max(10, 11 / globalScale)
        ctx.font = `${fontSize}px "Inter", system-ui, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillStyle = palette.onSurface
        const label = node.label.length > 32 ? `${node.label.slice(0, 30)}…` : node.label
        ctx.fillText(label, node.x, node.y + radius + 2)
      }
    },
    [palette, selectedId],
  )

  const renderLink = useCallback(
    (linkUntyped: unknown, ctx: CanvasRenderingContext2D) => {
      const link = linkUntyped as MutableLink
      const s = typeof link.source === "object" ? link.source : null
      const t = typeof link.target === "object" ? link.target : null
      if (!s || !t || s.x === undefined || s.y === undefined || t.x === undefined || t.y === undefined) {
        return
      }
      const touchesSelected =
        selectedId !== null && (s.id === selectedId || t.id === selectedId)
      ctx.strokeStyle = touchesSelected ? palette.primary : palette.outline
      ctx.globalAlpha = touchesSelected ? 0.9 : selectedId ? 0.1 : 0.35
      ctx.lineWidth = touchesSelected ? 1.5 : 0.6
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(t.x, t.y)
      ctx.stroke()
      ctx.globalAlpha = 1
    },
    [palette, selectedId],
  )

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-3 md:grid md:grid-cols-[200px_minmax(0,1fr)_280px] md:gap-4 md:overflow-hidden md:p-4 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
      {/* Filter rail ──────────────────────────────────────────────────────── */}
      <aside className="order-2 rounded-2xl bg-surface-container-low p-5 shadow-editorial md:order-none md:overflow-y-auto">
        <h3 className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
          File types
        </h3>
        <ul className="flex flex-col gap-1.5">
          {FILE_TYPES_ORDER.map((t) => {
            const count = typeCounts[t] ?? 0
            if (count === 0) return null
            const active = activeTypes.has(t)
            return (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => toggleType(t)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                    active
                      ? "bg-primary-fixed text-on-primary-fixed"
                      : "bg-transparent text-on-surface-variant hover:bg-surface-container",
                  )}
                  aria-pressed={active}
                >
                  <span>{FILE_TYPE_LABEL[t]}</span>
                  <span className="text-xs tabular-nums opacity-70">{count}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <h3 className="mt-6 mb-3 text-[11px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
          Top clusters
        </h3>
        <ul className="flex flex-col gap-1.5 text-sm">
          {topCommunities.map(({ cid, size }) => (
            <li key={cid} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: communityColor(cid, palette) }}
                aria-hidden
              />
              <span className="flex-1 text-on-surface">
                {communityLabels[cid] ?? `Cluster ${cid}`}
              </span>
              <span className="text-xs tabular-nums text-on-surface-variant">{size}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Canvas ───────────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative order-1 h-[70dvh] min-h-[520px] overflow-hidden rounded-2xl bg-surface-container-low shadow-editorial md:order-none md:h-auto md:min-h-0"
      >
        {graph ? (
          <ForceGraph2D
            ref={canvasRef as unknown as never}
            graphData={filtered}
            width={size.width}
            height={size.height}
            backgroundColor={palette.surface}
            nodeRelSize={4}
            nodeCanvasObject={renderNode}
            nodeCanvasObjectMode={() => "replace"}
            linkCanvasObject={renderLink}
            linkCanvasObjectMode={() => "replace"}
            cooldownTicks={200}
            d3AlphaDecay={0.025}
            d3VelocityDecay={0.35}
            onEngineStop={() => {
              const fg = canvasRef.current as
                | { zoomToFit?: (ms: number, pad: number) => void }
                | null
              fg?.zoomToFit?.(600, 48)
            }}
            onNodeClick={(n: unknown) => {
              const node = n as MutableNode
              setSelectedId(node.id)
            }}
            onBackgroundClick={() => setSelectedId(null)}
            enableNodeDrag
          />
        ) : (
          <GraphSkeleton />
        )}
      </div>

      {/* Detail panel ─────────────────────────────────────────────────────── */}
      <aside
        className="order-3 rounded-2xl bg-surface-container-low p-6 shadow-editorial md:order-none md:overflow-y-auto"
        aria-live="polite"
      >
        {selected ? (
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
              {FILE_TYPE_LABEL[selected.file_type] ?? selected.file_type}
            </span>
            <h3 className="text-xl font-semibold leading-tight text-on-surface">
              {selected.label}
            </h3>
            {selected.source_file ? (
              <p className="font-mono text-xs break-all text-on-surface-variant">
                {selected.source_file}
                {selected.source_location ? `:${selected.source_location}` : ""}
              </p>
            ) : null}
            <p className="text-xs text-on-surface-variant">
              Cluster: {communityLabels[selected.community] ?? `Cluster ${selected.community}`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-sm text-on-surface-variant">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">
              Inspect
            </span>
            <p>
              Click any node to see its source file and cluster. Drag nodes to
              rearrange; scroll to zoom. Labels appear as you zoom in.
            </p>
            {graph ? (
              <p className="mt-3 text-xs">
                {graph.nodes.length} nodes · {graph.links.length} edges ·{" "}
                {new Set(graph.nodes.map((n) => n.community)).size} communities
              </p>
            ) : null}
          </div>
        )}
      </aside>
    </div>
  )
}

function GraphSkeleton() {
  return (
    <div className="flex h-full min-h-[520px] w-full items-center justify-center rounded-2xl bg-surface-container-low">
      <span className="text-sm text-on-surface-variant">Loading graph…</span>
    </div>
  )
}
