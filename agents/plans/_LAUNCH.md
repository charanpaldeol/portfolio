# LAUNCH — Run All 10 Portfolio Improvement Agents in Parallel

## How to use
Copy the prompt below and paste it as a message to Claude Code.
Claude will spawn all 10 agents simultaneously, each working independently on its plan.

---

## The prompt (copy everything between the dashes)

---

Spawn 10 agents in parallel using the Agent tool. Each agent must:
1. Read `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/_PROJECT_CONTEXT.md` first (shared project rules)
2. Read its specific plan file
3. Execute the plan fully — implement code, run checks, commit to git

All agents work in the same repo at `/Users/al/Projects AI/Portfolio/portfolio`. Plans are designed to be non-conflicting (different files). Run all 10 simultaneously.

Agent 1 — Case Study Depth:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-01-case-study-depth.md`. Extend lib/projects-data.ts with impactMetrics/tagline/role/timeline fields, rewrite the project detail page to be metrics-first, update project cards to surface the top metric.

Agent 2 — Social Proof:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-02-social-proof.md`. Create lib/testimonials-data.ts, build a Testimonials component, add to home page and About page.

Agent 3 — Work With Me Page:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-03-work-with-me.md`. Create /work-with-me page with engagement types, process steps, FAQ, and CTA. Add to navigation.

Agent 4 — Services Page:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-04-services-page.md`. Rewrite ServicesContent.tsx with 4 concrete service offerings, deliverables, outcomes, and differentiation statement.

Agent 5 — AI Workflow Narrative:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-05-ai-workflow-narrative.md`. Create /how-i-use-ai page with 5 workflow phases showing where AI helps and what stays human. Add to navigation.

Agent 6 — Systems Thinking Visual:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-06-systems-thinking-visual.md`. Create SVG Design Leverage Stack diagram, add Systems Thinking section to how-i-work page.

Agent 7 — Email Capture:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-07-email-capture.md`. Create /api/newsletter route with Zod validation, build NewsletterSignup component, integrate at end of blog articles and in footer.

Agent 8 — Architecture Cleanup:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-08-architecture-cleanup.md`. Extract HowIWork data arrays to lib/how-i-work-data.ts, fix remaining hardcoded colors, add as const to data arrays.

Agent 9 — Mobile & Performance:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-09-mobile-performance.md`. Enable mobile Playwright projects, write mobile e2e tests, fix any layout issues, add preconnect hint for simpleicons CDN.

Agent 10 — New Articles:
Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-10-new-articles.md`. Write 3 new standalone articles (prompt-as-design-artifact, why-design-systems-fail, designing-for-decisions), wire them into the blog list and dynamic route.

---

## Individual plan files (for running single agents)

| Plan | File | What it builds |
|------|------|----------------|
| 01 | `PLAN-01-case-study-depth.md` | Metrics-first project detail pages |
| 02 | `PLAN-02-social-proof.md` | Testimonials section + credibility signals |
| 03 | `PLAN-03-work-with-me.md` | /work-with-me consulting page |
| 04 | `PLAN-04-services-page.md` | Rewritten services page with real offerings |
| 05 | `PLAN-05-ai-workflow-narrative.md` | /how-i-use-ai personal workflow page |
| 06 | `PLAN-06-systems-thinking-visual.md` | SVG systems diagram in how-i-work |
| 07 | `PLAN-07-email-capture.md` | Newsletter signup + /api/newsletter route |
| 08 | `PLAN-08-architecture-cleanup.md` | Data extraction + hardcoded color fixes |
| 09 | `PLAN-09-mobile-performance.md` | Mobile e2e tests + layout fixes + preconnect |
| 10 | `PLAN-10-new-articles.md` | 3 new blog articles |

## Running a single agent
To run just one plan, say:
> "Run PLAN-03. Read `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/_PROJECT_CONTEXT.md` and `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-03-work-with-me.md` and execute the plan fully."

## Conflict map (safe to run in parallel)
The plans were designed to touch different files. Known safe-to-parallel combinations:

| Plans | Shared files | Risk |
|-------|-------------|------|
| 01 + any | `lib/projects-data.ts` | Low — only Plan 01 touches this |
| 02 + 03 + 04 + 05 + 06 | `config/navigation.tsx` | **Merge conflict risk** — Plans 03, 05, 06 all add nav items. If running in parallel, one may need to merge. Or run 03+05+06 sequentially. |
| 07 + 10 | `app/blog/[slug]/page.tsx`, Footer | Medium — both touch blog infrastructure. Prefer sequentially if possible. |
| 08 + any | `components/home/HowIWork.tsx` | Low — only Plan 08 touches this |
| 09 + any | `playwright.config.ts`, `app/layout.tsx` | Low — only Plan 09 touches these |

**Recommended parallel batches if you want zero conflicts:**
- Batch A (fully safe in parallel): Plans 01, 02, 04, 06, 08, 09
- Batch B (run after A): Plans 03, 05, 07, 10
