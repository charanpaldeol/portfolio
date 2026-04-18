/**
 * Builds the visitor-facing knowledge corpus for graphify.
 *
 * Imports every `.ts` data module under `lib/` that holds *what visitors read*,
 * plus a handful of page-hero strings regex-extracted from `.tsx` pages, and
 * emits one markdown document per content bucket to `../graphify-content/`.
 *
 * Why: graphify's default pipeline runs tree-sitter AST extraction on source
 * files, which produces component/function/route identifiers (`CTA()`,
 * `PageHero()`, `/blog`) — implementation noise, not knowledge. By feeding
 * graphify a corpus of pure prose markdown instead, its document pipeline
 * (Claude-driven concept extraction) runs and the resulting graph is made of
 * ideas, not identifiers.
 *
 * Run with: `pnpm build:content` (uses tsx).
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { workflowPhases, philosophyPoints } from "../lib/ai-workflow-data"
import { standaloneArticles } from "../lib/blog-articles-data"
import {
  homeHeroAvailability,
  homeHeroBodyPlain,
  homeHeroIndustries,
  homeHeroName,
  homeHeroSubhead,
} from "../lib/home-hero-data"
import {
  homeDeliveryPhaseTitles,
  homeHowIWorkIntro,
  homeHowIWorkPullQuote,
} from "../lib/home-page-sections"
import { HOW_I_THINK_PRINCIPLES } from "../lib/how-i-think-principles"
import { expertiseAreas, workPhases } from "../lib/how-i-work-data"
import { projects } from "../lib/projects-data"
import { metrics } from "../lib/proof-metrics-data"
import { serviceFAQs, services } from "../lib/services-data"
import { systemsExamples } from "../lib/systems-thinking-data"
import { testimonials } from "../lib/testimonials-data"
import { toolGroups } from "../lib/tools-and-methods-data"
import { whatIBringCards } from "../lib/what-i-bring-cards"
import {
  engagementTypes,
  faqs as workWithMeFaqs,
  processSteps,
} from "../lib/work-with-me-data"

// ── Path setup ────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const portfolioRoot = resolve(__dirname, "..")
const repoRoot = resolve(portfolioRoot, "..")
const outDir = resolve(repoRoot, "graphify-content")
mkdirSync(outDir, { recursive: true })

// ── Small markdown helpers ────────────────────────────────────────────────────

const lines: string[] = []
const para = (s: string) => s.replace(/\s+/g, " ").trim()
const bullet = (s: string) => `- ${para(s)}`

type MDBuilder = {
  h1: (s: string) => MDBuilder
  h2: (s: string) => MDBuilder
  h3: (s: string) => MDBuilder
  p: (s: string | undefined | null) => MDBuilder
  bullets: (items: readonly (string | undefined | null)[]) => MDBuilder
  blank: () => MDBuilder
  lines: () => string[]
}

function md(): MDBuilder {
  const buf: string[] = []
  const api: MDBuilder = {
    h1: (s) => {
      buf.push(`# ${s}`, "")
      return api
    },
    h2: (s) => {
      buf.push(`## ${s}`, "")
      return api
    },
    h3: (s) => {
      buf.push(`### ${s}`, "")
      return api
    },
    p: (s) => {
      if (s && s.trim()) buf.push(para(s), "")
      return api
    },
    bullets: (items) => {
      const kept = items.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      if (kept.length === 0) return api
      for (const it of kept) buf.push(bullet(it))
      buf.push("")
      return api
    },
    blank: () => {
      buf.push("")
      return api
    },
    lines: () => buf,
  }
  return api
}

function write(filename: string, builder: MDBuilder) {
  const path = resolve(outDir, filename)
  const body = builder.lines().join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n"
  writeFileSync(path, body, "utf8")
  return { path, bytes: body.length }
}

function withNavigate(builder: MDBuilder, links: readonly { label: string; href: string }[]) {
  builder.h2("Navigate next")
  builder.bullets(links.map((link) => `[${link.label}](${link.href})`))
  return builder
}

// ── Bucket builders ───────────────────────────────────────────────────────────

function buildHome() {
  const b = md()
    .h1("Home")
    .p(`Availability: ${homeHeroAvailability}.`)
    .h2("Hero")
    .p(`${homeHeroName} — ${homeHeroSubhead.prefix} ${homeHeroSubhead.accent}`)
    .p(homeHeroBodyPlain)
    .p(`Industries of focus: ${homeHeroIndustries.join(", ")}.`)
    .h2("Operating model in brief")
    .p(homeHowIWorkIntro)
    .p(`Pull quote: "${homeHowIWorkPullQuote}".`)
    .p(
      `Delivery phases in order: ${homeDeliveryPhaseTitles.join(" → ")}.`,
    )
  return withNavigate(b, [
    { label: "Services", href: "/portfolio/services" },
    { label: "Projects", href: "/portfolio/projects" },
    { label: "Proof of work", href: "/#proof-of-work" },
    { label: "Work with me", href: "/work-with-me" },
  ])
}

function buildServices() {
  const b = md().h1("Services")
  for (const s of services) {
    b.h2(s.name)
      .p(s.tagline)
      .p(s.description)
      .h3("Who it's for").p(s.whoItsFor)
    if (s.notFor) b.h3("Not for").p(s.notFor)
    b.h3("Deliverables").bullets(s.deliverables)
    b.h3("Engagement").p(s.engagement)
    b.h3("Outcomes").bullets(s.outcomes.map((o) => `${o.metric} — ${o.description}`))
  }
  if (serviceFAQs.length) {
    b.h2("Service FAQs")
    for (const f of serviceFAQs) b.h3(f.question).p(f.answer)
  }
  return withNavigate(b, [
    { label: "Projects", href: "/portfolio/projects" },
    { label: "Proof of work", href: "/#proof-of-work" },
    { label: "Work with me", href: "/work-with-me" },
    { label: "Contact", href: "/contact" },
  ])
}

function buildProjects() {
  const b = md().h1("Projects")
  for (const p of projects) {
    b.h2(p.title).p(p.tagline).p(p.shortDescription)
    b.bullets([
      `Role: ${p.role}`,
      `Timeline: ${p.timeline}`,
      `Category: ${p.category}`,
      `Outcome: ${p.outcome}`,
      p.tags?.length ? `Tags: ${p.tags.join(", ")}` : undefined,
    ])
    b.h3("Problem").p(p.problem)
    b.h3("My role").p(p.myRole)
    b.h3("Solution").p(p.solution)
    if (p.processSteps?.length)
      b.h3("Process").bullets(p.processSteps.map((s) => `${s.phase} — ${s.description}`))
    if (p.metrics?.length) b.h3("Metrics").bullets(p.metrics)
    if (p.keyLearning) b.h3("Key learning").p(p.keyLearning)
    if (p.impactMetrics?.length)
      b.h3("Impact").bullets(p.impactMetrics.map((m) => `${m.value} — ${m.label}`))
    if (p.techStack?.length) {
      b.h3("Tech stack")
      for (const ts of p.techStack) b.p(`${ts.category}: ${ts.technologies.join(", ")}.`)
    }
  }
  return withNavigate(b, [
    { label: "Proof of work", href: "/#proof-of-work" },
    { label: "Services", href: "/portfolio/services" },
    { label: "How I work", href: "/how-i-work" },
    { label: "Contact", href: "/contact" },
  ])
}

function buildHowIWork() {
  const b = md().h1("How I work")
  b.h2("Delivery phases")
  for (const phase of workPhases) b.h3(`${phase.step} — ${phase.title}`).p(phase.description)
  b.h2("Expertise areas")
  for (const e of expertiseAreas) b.h3(e.title).p(e.body)
  return withNavigate(b, [
    { label: "Tools & methods", href: "/tools-and-methods" },
    { label: "Work with me", href: "/work-with-me" },
    { label: "Projects", href: "/portfolio/projects" },
    { label: "How I think", href: "/how-i-think" },
  ])
}

function buildHowIThink() {
  const b = md().h1("How I think")
  for (const p of HOW_I_THINK_PRINCIPLES) {
    b.h2(p.quote).p(`Why: ${p.why}`)
    if (p.example) b.p(`In practice: ${p.example}`)
  }
  return withNavigate(b, [
    { label: "How I work", href: "/how-i-work" },
    { label: "Work with me", href: "/work-with-me" },
    { label: "What I bring", href: "/what-i-bring" },
    { label: "Blog", href: "/blog" },
  ])
}

function buildWhatIBring() {
  const b = md().h1("What I bring")
  for (const c of whatIBringCards) {
    b.h2(c.title).p(c.body)
    for (const s of c.sections) b.h3(s.heading).bullets(s.paragraphs)
  }
  return withNavigate(b, [
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/portfolio/projects" },
    { label: "Work with me", href: "/work-with-me" },
    { label: "Contact", href: "/contact" },
  ])
}

function buildBlog() {
  const b = md().h1("Blog")
  for (const a of standaloneArticles) {
    b.h2(a.title).p(a.body)
    for (const s of a.sections) b.h3(s.heading).bullets(s.paragraphs)
  }
  return withNavigate(b, [
    { label: "What I bring", href: "/what-i-bring" },
    { label: "How I think", href: "/how-i-think" },
    { label: "How I work", href: "/how-i-work" },
    { label: "Projects", href: "/portfolio/projects" },
  ])
}

function buildTestimonials() {
  const b = md().h1("Testimonials")
  for (const t of testimonials) {
    const attribution = [t.author, t.title, t.company].filter(Boolean).join(" · ")
    b.h2(attribution).p(`"${t.quote}"`).p(`Relationship: ${t.relationship}.`)
  }
  return withNavigate(b, [
    { label: "Projects", href: "/portfolio/projects" },
    { label: "Services", href: "/portfolio/services" },
    { label: "Proof of work", href: "/#proof-of-work" },
    { label: "Contact", href: "/contact" },
  ])
}

function buildWorkWithMe() {
  const b = md().h1("Work with me")
  b.h2("Engagement types")
  for (const e of engagementTypes) {
    b.h3(e.name)
      .p(e.description)
      .p(`Ideal for: ${e.idealFor}`)
      .p(`Typical duration: ${e.typicalDuration}.`)
      .h3("Deliverables")
      .bullets(e.deliverables)
  }
  b.h2("Process")
  for (const s of processSteps) b.h3(`${s.number} — ${s.title}`).p(s.description).p(`Duration: ${s.duration}.`)
  b.h2("Work-with-me FAQs")
  for (const f of workWithMeFaqs) b.h3(f.question).p(f.answer)
  return withNavigate(b, [
    { label: "Services", href: "/portfolio/services" },
    { label: "How I work", href: "/how-i-work" },
    { label: "Projects", href: "/portfolio/projects" },
    { label: "Contact", href: "/contact" },
  ])
}

function buildProofMetrics() {
  const b = md().h1("Proof of work")
  for (const m of metrics) {
    const statDisplay = "statDisplay" in m ? m.statDisplay : undefined
    const stat = statDisplay ?? (m.numericValue !== null ? `${m.numericValue}${m.statSuffix ?? ""}` : "")
    b.h2(stat ? `${stat} — ${m.tag}` : m.tag).p(m.label)
  }
  return withNavigate(b, [
    { label: "Projects", href: "/portfolio/projects" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Services", href: "/portfolio/services" },
    { label: "Work with me", href: "/work-with-me" },
  ])
}

function buildAIWorkflow() {
  const b = md().h1("How I use AI")
  b.h2("Workflow phases")
  for (const p of workflowPhases) {
    b.h3(p.title)
      .p(p.description)
      .p(`How AI helps: ${p.howAIHelps}`)
      .p(`Human part: ${p.humanPart}`)
      .p(`Tools: ${p.tools.join(", ")}.`)
  }
  b.h2("Philosophy")
  for (const q of philosophyPoints) b.h3(q.title).p(q.body)
  return withNavigate(b, [
    { label: "Tools & methods", href: "/tools-and-methods" },
    { label: "How I work", href: "/how-i-work" },
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/portfolio/projects" },
  ])
}

function buildSystemsThinking() {
  const b = md().h1("Systems thinking")
  for (const s of systemsExamples) b.h2(`${s.layer} — ${s.title}`).p(s.description).p(`Impact: ${s.impact}`)
  return withNavigate(b, [
    { label: "Services", href: "/portfolio/services" },
    { label: "How I work", href: "/how-i-work" },
    { label: "Projects", href: "/portfolio/projects" },
    { label: "What I bring", href: "/what-i-bring" },
  ])
}

function buildToolsAndMethods() {
  const b = md().h1("Tools & methods")
  for (const g of toolGroups) {
    b.h2(g.phase).p(g.description).p(`Toolkit: ${g.chips.join(", ")}.`)
    if (g.bold?.length) b.p(`Core emphasis: ${g.bold.join(", ")}.`)
  }
  return withNavigate(b, [
    { label: "How I work", href: "/how-i-work" },
    { label: "How I use AI", href: "/how-i-use-ai" },
    { label: "Projects", href: "/portfolio/projects" },
    { label: "Proof of work", href: "/#proof-of-work" },
  ])
}

// ── Emit ──────────────────────────────────────────────────────────────────────

const outputs: Array<{ name: string; build: () => MDBuilder }> = [
  { name: "home.md", build: buildHome },
  { name: "services.md", build: buildServices },
  { name: "projects.md", build: buildProjects },
  { name: "how-i-work.md", build: buildHowIWork },
  { name: "how-i-think.md", build: buildHowIThink },
  { name: "what-i-bring.md", build: buildWhatIBring },
  { name: "blog.md", build: buildBlog },
  { name: "testimonials.md", build: buildTestimonials },
  { name: "work-with-me.md", build: buildWorkWithMe },
  { name: "proof-metrics.md", build: buildProofMetrics },
  { name: "how-i-use-ai.md", build: buildAIWorkflow },
  { name: "systems-thinking.md", build: buildSystemsThinking },
  { name: "tools-and-methods.md", build: buildToolsAndMethods },
]

let totalBytes = 0
for (const { name, build } of outputs) {
  const { bytes } = write(name, build())
  totalBytes += bytes
  console.log(`[graphify-content] wrote ${name.padEnd(24)} ${(bytes / 1024).toFixed(1)} KB`)
}
console.log(
  `[graphify-content] ${outputs.length} files · ${(totalBytes / 1024).toFixed(1)} KB · ${outDir}`,
)

lines.length = 0
