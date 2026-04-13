# PLAN-02: Social Proof — Testimonials & Credibility Signals

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
Add social proof to the portfolio. The site currently has zero testimonials, no client callouts, and no collaboration signals. This is the #1 credibility gap for a consulting-oriented portfolio. Add a testimonials section to the home page and a credibility strip to the About page.

## What exists today
- **Home page**: `app/page.tsx` — renders sections from `components/home/`
- **About page**: `app/portfolio/about/page.tsx` imports `AboutContent` from `./AboutContent` — the component file is at `app/portfolio/about/AboutContent.tsx`
- **No testimonials data** exists anywhere yet

## Steps

### Step 1 — Read existing structure
Read these files before writing anything:
1. `app/page.tsx` — understand how home sections are composed
2. `app/portfolio/about/page.tsx` and the AboutContent component it imports
3. `components/home/CTABand.tsx` — to understand visual style of existing home sections
4. `components/home/ProofMetrics.tsx` — to understand animation patterns used on home
5. `lib/proof-metrics-data.ts` — to understand the data pattern to follow
6. `styles/tailwind.css` — available design tokens

### Step 2 — Create testimonials data
Create `lib/testimonials-data.ts`:

```typescript
export type Testimonial = {
  id: string
  quote: string           // The testimonial text (1–4 sentences)
  author: string          // Full name
  title: string           // Job title at time of collaboration
  company?: string        // Company name (optional)
  relationship: string    // "Collaborated on X" or "Client for Y project" — provides context
  avatarInitials: string  // 2-letter initials for avatar fallback
}

export const testimonials: Testimonial[] = [
  // Add 3–5 placeholder testimonials that Charan can replace with real ones.
  // Mark each with a comment: // TODO: replace with real testimonial from [person]
  // Write plausible, professional quotes that match Charan's positioning:
  // product strategy, AI-native delivery, design systems, engineering rigor.
  // Example tone: "Charan brought both design vision and engineering discipline
  // to our platform redesign — a rare combination that meant we shipped
  // without the usual design-dev handoff friction."
  {
    id: "t1",
    quote: "// TODO: replace with real testimonial",
    author: "// TODO",
    title: "// TODO",
    company: "// TODO",
    relationship: "// TODO",
    avatarInitials: "??",
  },
  // Add 4 more following the same pattern
]
```

Write 5 placeholder testimonials with realistic-sounding professional context (not generic). Vary the relationship types: colleague, direct report, client, cross-functional partner.

### Step 3 — Create Testimonials component
Create `components/home/Testimonials.tsx` (Server Component, no `"use client"`):

**Layout**: A 3-column grid (1-col mobile, 2-col tablet, 3-col desktop) of quote cards.

**Card design** (follow DESIGN.md):
- Background: `bg-surface-container-lowest` (creates natural lift on `bg-surface` sections)
- No borders — tonal lift only
- Quote text: `text-on-surface`, Inter, `text-base` or `text-lg`, italic style
- Opening quote mark: large decorative `"` in `text-primary`, `font-display`, `text-5xl`
- Author name: `font-semibold text-on-surface`
- Title + company: `text-on-surface-variant text-sm`
- Avatar: `w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center` with initials in `text-on-primary-fixed font-semibold text-sm`
- Relationship tag: small `text-xs text-on-surface-variant` below author

**Section wrapper**:
- Section heading: `text-sm font-semibold uppercase tracking-widest text-on-surface-variant` eyebrow label — "What collaborators say"
- H2: Manrope bold, large — "Trusted by teams that ship"
- Subtle background: `bg-surface-container-low` tonal band (no borders)

**Props**:
```typescript
type TestimonialsProps = {
  testimonials: Testimonial[]
}
```

Keep component under 300 lines. If card markup is complex, extract a `TestimonialCard` sub-component in the same file or as `components/home/TestimonialCard.tsx`.

### Step 4 — Add Testimonials to home page
The current home page section order is: Hero → HomeJumpNav → WhatIBring → ProofMetrics → HomeHowIWorkTeaser → HowIThink → BlogTeaser → CTABand.

In `app/page.tsx`, import the new component and add it **after `ProofMetrics` and before `HomeHowIWorkTeaser`** — this is the natural social-proof placement immediately following the metrics:

```typescript
import { Testimonials } from "@/components/home/Testimonials"
import { testimonials } from "@/lib/testimonials-data"

// In the page JSX, add:
<Testimonials testimonials={testimonials} />
```

### Step 5 — Add credibility strip to About page
In `AboutContent.tsx`, add a "Collaboration history" or "Who I've worked with" section near the bottom. This should be a simple horizontal strip of company/org names (text-based, no logos needed since we don't have brand assets):

```
Companies & teams I've worked with:
[Company A] · [Company B] · [Company C] · [Company D] · [Company E]
```

Style: `text-on-surface-variant text-sm`, centered, `tracking-wide`. Add a `TODO` comment for Charan to fill in real company names.

### Step 6 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
node scripts/audit.js
```

Commit:
```
feat: add testimonials section and credibility signals

- Create lib/testimonials-data.ts with typed Testimonial interface
- Add components/home/Testimonials.tsx (3-column quote card grid)
- Integrate testimonials section into home page
- Add collaboration history strip to About page
```

## Success criteria
- Home page shows a testimonials section with 3+ cards
- About page has a companies/collaboration section
- No hex colors, no borders
- `pnpm build` passes
- `node scripts/audit.js` exits 0

## Constraints
- Server Component only (no `"use client"`)
- All placeholder content must have `// TODO: replace` comments
- No images/avatars — use initials only (we don't have headshots)
- No hex colors — design tokens only
- No 1px borders — tonal background shifts only
