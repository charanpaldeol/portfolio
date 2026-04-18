import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Knowledge graph · Charan Pal Deol",
  description:
    "Interactive knowledge graph of this portfolio, generated and rendered by graphify (safishamsi/graphify) — nodes, edges, and Leiden communities as-is.",
}

export default function KnowledgeGraphPage() {
  return (
    <section className="relative -mx-4 -my-6 h-[calc(100dvh-var(--portfolio-nav-h,72px))] min-h-[620px] md:-mx-6 md:-my-8">
      <iframe
        src="/knowledge-graph/graph.html"
        title="graphify knowledge graph"
        className="h-full w-full rounded-2xl border-0 bg-[#0f0f1a] shadow-editorial"
        loading="lazy"
      />
    </section>
  )
}
