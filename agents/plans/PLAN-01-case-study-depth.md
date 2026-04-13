# PLAN-01: Case Study Depth — Metrics-First Format

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
Rewrite the project case studies so hiring managers and consulting prospects can understand business impact within 6 seconds. Currently the project detail pages exist but lead with description. They need to be restructured to: **Impact first → Role → Process → Outcomes → Learnings**.

## What exists today
- **Data**: `lib/projects-data.ts` — 7+ `ProjectData` objects with `problem`, `solution`, `metrics`, `techStack` fields
- **Detail page**: `app/portfolio/projects/[slug]/ProjectDetailContent.tsx` — renders a project's data
- **List page**: `app/portfolio/projects/PortfolioProjectsContent.tsx` — grid of project cards

## Steps

### Step 1 — Read existing data and components
Read these files in full before writing anything:
1. `lib/projects-data.ts` — understand the current data shape
2. `app/portfolio/projects/[slug]/ProjectDetailContent.tsx` — understand current rendering
3. `app/portfolio/projects/PortfolioProjectsContent.tsx` — understand card layout
4. `components/portfolio/EditorialPageHero.tsx` — understand hero props

### Step 2 — Extend the ProjectData type
In `lib/projects-data.ts`, extend (do not break) the existing TypeScript interface to add:
```typescript
type ProjectData = {
  // ... existing fields preserved ...
  slug: string
  title: string
  tagline: string          // ADD: one sentence, outcome-first. E.g. "Reduced onboarding drop-off by 40% through progressive disclosure redesign"
  role: string             // ADD: "Lead Product Designer" / "Design System Architect" / etc.
  timeline: string         // ADD: e.g. "Q2–Q3 2024 · 4 months"
  impactMetrics: {         // ADD: 2-4 top-line numbers shown prominently at the top
    value: string          // e.g. "40%"
    label: string          // e.g. "reduction in drop-off"
  }[]
  problem: string          // existing
  myRole: string           // ADD: 2-3 sentences on your specific contribution (not team's)
  solution: string         // existing
  processSteps?: {         // ADD: optional 3-5 process steps for richer case studies
    phase: string          // e.g. "Discovery"
    description: string
  }[]
  metrics: string[]        // existing — keep as supporting evidence
  keyLearning?: string     // ADD: one insight that changed how you think
  techStack: { ... }[]     // existing
}
```

Fill in the new fields for ALL existing projects. If a project lacks real data, write plausible but honest placeholder copy that Charan can update (mark with `// TODO: update with real data`). Use the existing `problem`, `solution`, `metrics` fields as source material to infer the new fields.

### Step 3 — Redesign ProjectDetailContent layout
Rewrite `app/portfolio/projects/[slug]/ProjectDetailContent.tsx` with this section order:

1. **`EditorialPageHero`** — use existing component with `title={project.title}` and `subtitle={project.tagline}`
2. **Impact strip** (right below hero, full-width) — show `impactMetrics` as large stat cards (2–4 numbers side by side). This is the 6-second hook. Use `bg-surface-container-low` tonal shift, no borders.
3. **Context row** — `role` + `timeline` as small label/value pairs on one line
4. **Problem** — H2 "The Problem", body text from `problem`
5. **My Role** — H2 "My Contribution", body from `myRole`  
6. **Process** (if `processSteps` exists) — numbered steps with phase label + description
7. **Solution** — H2 "The Solution", body from `solution`
8. **Results** — H2 "Results", render `metrics[]` as a styled list with check icons (use `text-primary` for the check)
9. **Key Learning** (if exists) — pull-quote style using `text-4xl` Manrope with a `bg-primary` left accent bar (4px wide, `bg-tertiary` per DESIGN.md "Expert Highlight" component spec)
10. **Tech Stack** — existing rendering, keep as-is

Component must remain a Server Component (no `"use client"`). Data flows from the page via props.

### Step 4 — Update project card on list page
In `PortfolioProjectsContent.tsx` (or wherever cards render), update the card to show:
- `tagline` as the subtitle (instead of or alongside `problem`)
- The first `impactMetrics` entry as a small badge/chip on the card

### Step 5 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
node scripts/audit.js
```
Fix any errors. Then commit:
```
feat: restructure project case studies to metrics-first format

- Extend ProjectData with impactMetrics, tagline, role, timeline, myRole, keyLearning
- Redesign ProjectDetailContent with impact strip above the fold
- Update project cards to surface tagline and top metric
```

## Success criteria
- Opening a project detail page shows impact numbers before any body text
- All 7+ projects have `impactMetrics` with at least 2 entries
- `pnpm build` passes
- `node scripts/audit.js` exits 0

## Constraints
- Do NOT use hex colors — use design token classes only
- Do NOT add borders — use `bg-surface-container-low` tonal shifts
- Do NOT make the page a Client Component
- Keep `EditorialPageHero` for the page hero
- Component must stay ≤ 300 lines — split into sub-components if needed
