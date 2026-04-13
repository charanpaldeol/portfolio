# PLAN-10: New Thought Leadership Articles

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
Add 3 new thought leadership articles to the blog. Currently the site has 5 articles all tied to the "What I Bring" service cards. This plan adds 3 new standalone articles on differentiated topics — AI workflow, systems thinking, and design + engineering collaboration — to build SEO authority and establish Charan as a thought leader beyond his service descriptions.

## What exists today
- **Article data**: `lib/what-i-bring-cards.ts` — current 5 articles live here as part of service card data. Read this carefully to understand the data shape.
- **Blog list page**: `app/blog/page.tsx` — renders all articles
- **Blog article page**: `app/blog/[slug]/page.tsx` — dynamic route rendering articles
- **BlogTopicArticle component**: wherever it's imported from — renders article content
- **Article data type**: defined in `what-i-bring-cards.ts` — the new articles must conform to the same type

## Steps

### Step 1 — Read existing files
Read before writing:
1. `lib/what-i-bring-cards.ts` — understand the full data type including article sections, slugs, tags
2. `app/blog/page.tsx` — understand how articles are listed
3. `app/blog/[slug]/page.tsx` — understand how `generateStaticParams` works and where data comes from
4. The `BlogTopicArticle` component (find its import in the `[slug]` page) — understand what props it accepts

### Step 2 — Understand the existing data structure
The type in `lib/what-i-bring-cards.ts` is **`WhatIBringCard`** (exact name — use this). It has nested `WhatIBringArticleSection[]`. Read the file in full to understand every field before writing new articles. Your new data file must use this same type — do not create a new type.

### Step 3 — Create standalone article data file
Create `lib/blog-articles-data.ts` for the new standalone articles (keep `what-i-bring-cards.ts` unchanged):

```typescript
import type { WhatIBringCard } from "@/lib/what-i-bring-cards"
// WhatIBringCard is the exact type — do not create a new type

export const standaloneArticles: WhatIBringCard[] = [
  // ARTICLE 1: "The Prompt is a Design Artifact"
  // Topic: How writing good AI prompts requires the same skills as good UX writing
  // Angle: Most designers treat prompts as technical commands. They're actually
  //        interface design — clarity, specificity, and user mental model all apply.
  // Sections to cover:
  //   1. Why bad prompts produce bad outputs (not AI's fault — it's a design problem)
  //   2. The parallel between prompt writing and UX copy
  //   3. Specificity: designing for the model's "mental model"
  //   4. Iteration as core prompt design workflow
  //   5. Practical framework: Context → Constraint → Criteria
  // slug: "prompt-as-design-artifact"
  // Tags: AI, UX Writing, Design Process
  
  // ARTICLE 2: "Why Design Systems Fail (And What to Do Instead)"
  // Topic: Design systems that look great in Figma but break in production
  // Angle: The failure mode isn't the tokens or components — it's the absence of
  //        a shared mental model between design and engineering. Systems succeed
  //        when they're documentation + tooling + culture, not just a component library.
  // Sections to cover:
  //   1. The "Figma graveyard" problem — why adoption fails
  //   2. The three failure modes: no ownership, no codegen parity, no feedback loop
  //   3. What a successful system looks like operationally
  //   4. The minimum viable design system for a 5-person startup
  //   5. Signals that your design system is working
  // slug: "why-design-systems-fail"
  // Tags: Design Systems, Engineering, Team Process

  // ARTICLE 3: "Designing for Decisions, Not Screens"
  // Topic: Senior designers focus on enabling good decisions, not just designing screens
  // Angle: Most junior designers think in screens. Senior designers think in decisions
  //        — what decision does a user/stakeholder need to make, and how does the
  //        design enable the right one? This mental shift is what separates IC designers
  //        from design leaders.
  // Sections to cover:
  //   1. The difference between "I designed a dashboard" and "I designed a decision surface"
  //   2. How to map the decisions in any product flow
  //   3. Information architecture as decision architecture
  //   4. Stakeholder decisions vs user decisions (both matter)
  //   5. A framework for auditing existing designs through a decisions lens
  // slug: "designing-for-decisions"
  // Tags: Product Design, Strategy, Leadership
]
```

Write complete, substantive article content — not outlines or placeholders. Each article should have 5 rich sections of 150–300 words each. The writing tone should match the existing articles in `what-i-bring-cards.ts` — expert, direct, practical. Write as Charan's voice: confident, experience-backed, not academic.

### Step 4 — Update blog data source
Read `app/blog/[slug]/page.tsx` in full first. Key facts:
- `generateStaticParams` is **hardcoded** with 5 slugs (lines 32–40). You must change it to be dynamic.
- The page uses `requireWhatIBringCard(slug)` from `lib/what-i-bring-cards.ts` — this function throws `notFound()` for unknown slugs.

Make these changes:
1. Import `standaloneArticles` from `@/lib/blog-articles-data`
2. Change `generateStaticParams` from hardcoded to:
   ```typescript
   import { whatIBringCards } from "@/lib/what-i-bring-cards"
   import { standaloneArticles } from "@/lib/blog-articles-data"
   
   export function generateStaticParams() {
     return [...whatIBringCards, ...standaloneArticles].map((a) => ({ slug: a.slug }))
   }
   ```
3. In the page component, replace `requireWhatIBringCard(slug)` with a lookup that checks both sources:
   ```typescript
   const allArticles = [...whatIBringCards, ...standaloneArticles]
   const card = allArticles.find((a) => a.slug === slug)
   if (!card) notFound()
   ```
   Import `notFound` from `"next/navigation"` if not already imported.

### Step 5 — Update blog list page
In `app/blog/page.tsx`, the current page iterates over `whatIBringCards` only (flat list, no sections). Add the new articles as a separate **"Thinking out loud"** section below the existing cards:

```typescript
import { standaloneArticles } from "@/lib/blog-articles-data"

// In JSX, after the existing whatIBringCards section, add:
<section>
  <h2>Thinking out loud</h2>
  {standaloneArticles.map((article) => (
    // render each article card using the same card component/pattern as above
  ))}
</section>
```

Read the file first to copy the exact card rendering pattern used for `whatIBringCards`.

### Step 6 — Verify static generation
```bash
pnpm build
```

Check that:
- All 3 new article slugs are pre-rendered as static routes
- No TypeScript errors
- The blog list shows 8 articles total (5 existing + 3 new)

### Step 7 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
node scripts/audit.js
```

Commit:
```
feat: add 3 standalone thought leadership articles

- Create lib/blog-articles-data.ts with 3 new articles:
  prompt-as-design-artifact, why-design-systems-fail, designing-for-decisions
- Update app/blog/[slug]/page.tsx to serve both article sources
- Update app/blog/page.tsx to list all 8 articles
```

## Success criteria
- 3 new articles exist at `/blog/prompt-as-design-artifact`, `/blog/why-design-systems-fail`, `/blog/designing-for-decisions`
- All 3 appear on the `/blog` list page
- Articles have full content (not placeholder text)
- `pnpm build` pre-renders all new slugs statically
- `node scripts/audit.js` exits 0

## Constraints
- Do NOT modify `lib/what-i-bring-cards.ts` — only add the new file
- Do NOT change how existing articles render
- Articles must use the same TypeScript type as existing articles (no new types)
- No hex colors in any new components or pages
- Article content must be substantive — no lorem ipsum, no single-sentence sections
- Writing tone: practical, direct, experience-backed — avoid academic/corporate language
