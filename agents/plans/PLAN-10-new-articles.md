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
The articles in `what-i-bring-cards.ts` have a specific nested shape with `sections`, `eyebrow`, `body`, etc. Understand the exact TypeScript type before writing new articles.

### Step 3 — Create standalone article data file
Create `lib/blog-articles-data.ts` for the new standalone articles (keep `what-i-bring-cards.ts` unchanged):

```typescript
// Import the same article type used in what-i-bring-cards.ts
// (read that file to get the exact type name and shape)

export const standaloneArticles: [ArticleType][] = [
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
The `app/blog/[slug]/page.tsx` currently calls `generateStaticParams` from the what-i-bring cards. Update it to also include the new standalone articles:

Read `app/blog/[slug]/page.tsx` first, then:
1. Import `standaloneArticles` from `lib/blog-articles-data.ts`
2. In `generateStaticParams`, return slugs from BOTH data sources: `[...whatIBringCards, ...standaloneArticles].map(a => ({ slug: a.slug }))`
3. In the page component, find the article by slug from both sources: check `whatIBringCards` first, then `standaloneArticles`, and handle `notFound()` if neither matches

### Step 5 — Update blog list page
In `app/blog/page.tsx`, import the new standalone articles and render them alongside existing ones. Read the page to understand the current rendering — likely it maps over the cards array. Combine the arrays: show all articles.

If the blog list page has separate sections (e.g. "Service Articles" vs "Thoughts"), use that structure. If it's a flat list, add the new articles to the flat list. Follow existing patterns exactly.

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
