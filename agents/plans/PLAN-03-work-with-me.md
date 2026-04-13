# PLAN-03: Work With Me — Consulting CTA Page

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
Create a `/work-with-me` page that makes it crystal clear how to engage Charan as a consultant. Currently the site has no page that explains engagement types, process, or first steps. Ambiguity about how to work with him creates friction that kills inbound consulting leads. This page removes that friction.

## What exists today
- **Contact routes**: both `/contact` and `/portfolio/contact` exist (duplicate — leave them, don't modify)
- **CTABand**: `components/home/CTABand.tsx` — a CTA section used on home; use as style reference
- **Navigation**: `config/navigation.tsx` — need to add the new route here
- **Navbar**: uses `config/navigation.tsx` for its links
- **PageShell**: `components/layout/PageShell.tsx` — wrap new page in this
- **EditorialPageHero**: `components/portfolio/EditorialPageHero.tsx` — use for the page hero

## Steps

### Step 1 — Read existing files
Read these before writing anything:
1. `config/navigation.tsx` — understand the nav link types so you can add the new route
2. `components/layout/PageShell.tsx` — understand how to wrap the page
3. `components/portfolio/EditorialPageHero.tsx` — understand hero props
4. `app/portfolio/services/ServicesContent.tsx` — to understand existing service content (avoid duplicating)
5. `components/home/CTABand.tsx` — style reference for CTA sections
6. `app/what-i-bring/page.tsx` — style reference for a good editorial page

### Step 2 — Create page data
Create `lib/work-with-me-data.ts`:

```typescript
export type EngagementType = {
  id: string
  icon: string            // emoji or simple descriptor — we'll render as text icon
  name: string            // "Fractional Design Lead" / "Project-Based Consulting" / etc.
  description: string     // 2-3 sentences on what this engagement looks like
  idealFor: string        // "Best for teams that need..." 1 sentence
  typicalDuration: string // "3–6 months" / "4–12 weeks" / etc.
  deliverables: string[]  // 3–5 bullet points of what they get
}

export type ProcessStep = {
  number: string          // "01" / "02" / etc.
  title: string
  description: string     // What happens in this step
  duration: string        // "1 week" / "30 min call" / etc.
}

export type FAQ = {
  question: string
  answer: string
}

export const engagementTypes: EngagementType[] = [
  // Write 3 engagement types:
  // 1. Fractional Design Lead — ongoing part-time embedded work
  // 2. Project-Based Consulting — fixed-scope deliverable
  // 3. Design System / AI Workflow Advisory — specific expertise engagement
]

export const processSteps: ProcessStep[] = [
  // Write 4 steps: Discovery call → Proposal → Kick-off → Delivery
]

export const faqs: FAQ[] = [
  // Write 4–6 FAQs covering: rates, availability, location, how to start, etc.
  // Mark rate-related answers with TODO for Charan to fill in
]
```

### Step 3 — Create the page component
Create `app/work-with-me/page.tsx` (Server Component):

```typescript
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Work With Me | Charan Pal Deol",
  description: "Consulting and fractional design leadership engagements. Product strategy, AI-native UX, and design systems for teams that ship.",
}
```

Create `app/work-with-me/WorkWithMeContent.tsx` (Server Component) with these sections:

**Section 1 — Hero** (use `EditorialPageHero`):
- eyebrow: "Available for consulting"
- title: "Let's build something worth shipping"
- subtitle: "I work with product teams as a fractional design lead, project consultant, and design systems advisor."

**Section 2 — Engagement types** (3 cards):
- Render `engagementTypes` as large cards side-by-side (1-col mobile, 3-col desktop)
- Card: icon + name as H3 + description + `idealFor` + `typicalDuration` chip + deliverables list
- Card bg: `bg-surface-container-lowest`, no borders, generous padding

**Section 3 — How it works** (process steps):
- Numbered steps: large `01` `02` `03` `04` in `text-primary font-display`
- Title + description + duration label
- Layout: vertical timeline on mobile, 4-column on desktop

**Section 4 — FAQ accordion**:
- Use a simple disclosure pattern (no Radix needed — pure HTML `<details>`/`<summary>` is fine for Server Component)
- Style: `summary` with `cursor-pointer`, chevron indicator via CSS, `text-on-surface`

**Section 5 — Final CTA**:
- Large `bg-inverse-surface` band (dark) with `text-inverse-on-surface`
- Heading: "Ready to start?"
- Body: "Book a free 30-minute discovery call. No commitment, no pitch deck — just a conversation about your product challenge."
- Button: links to `/contact` — styled as primary gradient button
- Note: add `// TODO: replace /contact with Calendly link when available`

### Step 4 — Add to navigation
In `config/navigation.tsx`, add the new route to the `workLinks` array (line ~55). The exact interface is:
```typescript
export interface NavLink {
  href: string
  label: string
  description: string
  icon: ReactNode   // use a Lucide icon, e.g. <Handshake className="h-5 w-5" />
}
```
Add a `NavLink` entry for `/work-with-me`. Import the icon from `lucide-react`. The `description` field appears as subtitle text in the dropdown — write 1 sentence describing the page.

### Step 5 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
node scripts/audit.js
```

Commit:
```
feat: add /work-with-me consulting page

- Create lib/work-with-me-data.ts with engagement types, process, FAQs
- Add app/work-with-me/ page with 5 sections
- Add route to navigation config
```

## Success criteria
- `/work-with-me` renders without errors
- Page has all 5 sections: hero, engagement types, process, FAQ, CTA
- CTA links to `/contact`
- Route appears in Navbar
- `pnpm build` passes
- `node scripts/audit.js` exits 0

## Constraints
- Server Component only (no `"use client"`)
- Use `EditorialPageHero` for the page hero
- No hex colors — design tokens only
- No 1px borders — tonal shifts only
- Component files max 300 lines — split if needed
- All TODO items marked for Charan to complete
