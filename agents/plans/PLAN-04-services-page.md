# PLAN-04: Services Page — Real Content

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
The `/portfolio/services` page is currently the weakest page on the site — basic and thin. Rewrite it with concrete service offerings, who each is for, and what outcomes clients get. This is often the first page a potential client checks after the home page.

## What exists today
- **Page**: `app/portfolio/services/ServicesContent.tsx` — read this first to understand the current state
- **Related content**: `lib/what-i-bring-cards.ts` — rich service card data with article sections; use this as source material but don't duplicate it
- **Hero**: must use `EditorialPageHero`

The goal is NOT to duplicate `what-i-bring`. That page explains the *philosophy*. Services explains the *commercial offering* — what you hire Charan to do, what you get, and what problems it solves.

## Steps

### Step 1 — Read existing files
Read these in full before writing anything:
1. `app/portfolio/services/ServicesContent.tsx` — current state
2. `lib/what-i-bring-cards.ts` — source material (philosophy + capability descriptions)
3. `app/portfolio/projects/[slug]/ProjectDetailContent.tsx` — visual/layout reference
4. `components/portfolio/EditorialPageHero.tsx` — hero props
5. `styles/tailwind.css` — available design tokens

### Step 2 — Create services data
Create `lib/services-data.ts`:

```typescript
export type ServiceTier = {
  id: string
  name: string             // Service name
  tagline: string          // One sentence outcome statement
  description: string      // 2-3 paragraphs explaining the service
  whoItsFor: string        // "Best for: [type of client/team]"
  notFor?: string          // "Not a fit if: [anti-pattern]" — optional but powerful
  deliverables: string[]   // Concrete list of outputs (3–6 items)
  engagement: string       // "Ongoing (3–6 months)" or "Fixed scope (4–8 weeks)"
  outcomes: {              // 2-3 measurable outcomes past clients have seen
    metric: string         // e.g. "30–50%"
    description: string    // e.g. "reduction in design-dev handoff cycles"
  }[]
}

export const services: ServiceTier[] = [
  // Write 4 services based on Charan's positioning:
  //
  // 1. Product Design Strategy
  //    — Problem framing, user research synthesis, design direction for teams building 0→1 or undergoing redesigns
  //
  // 2. AI-Native UX Design
  //    — Designing AI-powered product experiences: prompt UX, output interfaces, human-in-the-loop workflows
  //    — This is the differentiator. No generic "I use AI in my process" — this is about designing PRODUCTS that use AI
  //
  // 3. Design Systems & Component Architecture
  //    — Building or auditing token-based design systems, Figma ↔ code parity, component libraries
  //
  // 4. Fractional Design Leadership
  //    — Embedded part-time design lead for teams without a senior designer
  //    — Covers hiring, process, craft standards, cross-functional alignment
]

export type ServiceFAQ = {
  question: string
  answer: string
}

export const serviceFAQs: ServiceFAQ[] = [
  // 4-5 questions: rates, location, timeline, what makes Charan different, how to start
]
```

### Step 3 — Rewrite ServicesContent
Rewrite `app/portfolio/services/ServicesContent.tsx` (keep the filename — the page.tsx imports it).

**Section 1 — Hero** (use `EditorialPageHero`):
- eyebrow: "Services"
- title: "From strategy to shipped product"
- subtitle: "Product design consulting for teams building AI-powered products, scaling design systems, and shipping faster."

**Section 2 — Services grid** (4 service cards):
Each card layout:
- Service name as H2 (Manrope bold, `text-2xl md:text-3xl`)
- Tagline below in `text-on-surface-variant`
- "Who it's for" as a label chip: `bg-primary-fixed text-on-primary-fixed rounded-full px-3 py-1 text-xs font-semibold`
- Description paragraphs
- Deliverables list with bullet points (use `text-primary` bullet color via `before:` pseudo or inline SVG dot)
- Engagement duration chip
- Outcomes as a 2-3 stat row: large number + description

Layout: alternate between left-heavy and right-heavy asymmetric layouts (first card: content left, accent right; second: accent left, content right). Use `bg-surface-container-low` for alternating section backgrounds — no borders.

**Section 3 — Differentiation statement**:
A full-width editorial callout (similar to DESIGN.md "Expert Highlight" pattern):
- Left accent bar: `w-1 bg-tertiary self-stretch`
- Large pull-quote: `text-3xl md:text-4xl font-display font-bold text-on-surface`
- Quote: "I bring both design craft and engineering literacy — which means I speak your developers' language and ship work that doesn't fall apart in implementation."

**Section 4 — FAQ**:
4–5 questions using `<details>`/`<summary>` HTML (no JavaScript needed, no Radix).

**Section 5 — CTA**:
Link to `/work-with-me` for engagement details, `/contact` for reaching out.

If the component exceeds 300 lines, split:
- `ServicesContent.tsx` — layout shell + section composition
- `ServiceCard.tsx` — individual service card

### Step 4 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
node scripts/audit.js
```

Commit:
```
feat: rewrite services page with concrete offerings and outcomes

- Create lib/services-data.ts with 4 typed ServiceTier objects
- Rewrite ServicesContent with metrics, deliverables, differentiation statement
- Add service FAQ and dual CTA to work-with-me + contact
```

## Success criteria
- `/portfolio/services` shows 4 distinct services with deliverables and outcomes
- Each service card answers: what it is, who it's for, what you get
- Page has a differentiation statement section
- Page has FAQ and CTA
- `pnpm build` passes
- `node scripts/audit.js` exits 0

## Constraints
- Do NOT duplicate the philosophical content from `/what-i-bring` — link there if needed
- No hex colors — design tokens only
- No 1px borders — tonal shifts only
- Server Component only
- Keep files ≤ 300 lines
- Mark placeholder rates/availability with `// TODO`
