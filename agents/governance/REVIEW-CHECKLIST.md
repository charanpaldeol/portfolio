# Governance Review — Per-Plan Acceptance Checklists

This file contains the specific acceptance criteria for each plan. The governance agent reads the relevant section when reviewing a submission.

---

## PLAN-01: Case Study Depth

```
[ ] lib/projects-data.ts has new fields: impactMetrics, tagline, role, timeline, myRole, keyLearning
[ ] All 7+ projects have impactMetrics with at least 2 entries
[ ] ProjectDetailContent shows impact numbers BEFORE body text (above the fold)
[ ] Impact metrics are displayed as large stat cards, not as a list
[ ] "Key Learning" section uses the Expert Highlight pull-quote style (left accent bar, large text)
[ ] Project cards on the list page show tagline and top metric
[ ] EditorialPageHero used for page hero
[ ] ProjectDetailContent is a Server Component (no "use client")
[ ] No component file exceeds 300 lines (split if needed)
[ ] pnpm build generates all project slug routes statically
```

---

## PLAN-02: Social Proof

```
[ ] lib/testimonials-data.ts exists with Testimonial TypeScript interface exported
[ ] At least 5 testimonial entries exist (even as placeholders — marked // TODO)
[ ] components/home/Testimonials.tsx exists and accepts testimonials prop
[ ] Testimonials section renders on home page
[ ] Testimonial cards use bg-surface-container-lowest (no borders)
[ ] Avatar uses initials only (no image — no headshots available)
[ ] Relationship tag visible on each card
[ ] About page has a "companies I've worked with" or similar credibility strip
[ ] All placeholder testimonials marked with // TODO comment
[ ] Server Component (no "use client")
```

---

## PLAN-03: Work With Me Page

```
[ ] /work-with-me route exists and renders without errors
[ ] lib/work-with-me-data.ts exists with EngagementType, ProcessStep, FAQ interfaces
[ ] 3 engagement types defined (fractional, project-based, advisory)
[ ] 4 process steps defined
[ ] 4+ FAQs defined
[ ] EditorialPageHero used for hero section
[ ] All 5 sections present: hero, engagement types, process, FAQ, final CTA
[ ] Final CTA links to /contact (with TODO for Calendly replacement)
[ ] Route added to config/navigation.tsx
[ ] Rate/availability fields marked // TODO for Charan
[ ] Server Component
[ ] No component exceeds 300 lines
```

---

## PLAN-04: Services Page

```
[ ] lib/services-data.ts exists with ServiceTier TypeScript interface
[ ] 4 services defined: Product Design Strategy, AI-Native UX, Design Systems, Fractional Leadership
[ ] Each service has: name, tagline, description, whoItsFor, deliverables[], engagement, outcomes[]
[ ] ServicesContent shows deliverables list for each service
[ ] ServicesContent shows outcome metrics for each service
[ ] Differentiation pull-quote section present (Expert Highlight pattern)
[ ] FAQ section present (uses <details>/<summary>)
[ ] CTA links to /work-with-me AND /contact
[ ] No content duplicated from /what-i-bring
[ ] EditorialPageHero used
[ ] No component exceeds 300 lines (split if needed)
```

---

## PLAN-05: AI Workflow Narrative

```
[ ] /how-i-use-ai route exists and renders
[ ] lib/ai-workflow-data.ts exists with WorkflowPhase and AIPhilosophyPoint interfaces
[ ] 5 workflow phases defined with: title, description, howAIHelps, tools[], humanPart
[ ] 3 philosophy points defined
[ ] Each phase clearly shows "Where AI helps" AND "What stays human" sections
[ ] Specific tool names mentioned (not generic "AI tools")
[ ] Honest limitations section present (pull-quote with tertiary accent)
[ ] Route added to config/navigation.tsx
[ ] EditorialPageHero used
[ ] Server Component
[ ] Does NOT read as a tools list — reads as a philosophy/workflow narrative
```

---

## PLAN-06: Systems Thinking Visual

```
[ ] components/home/SystemsThinkingDiagram.tsx exists
[ ] Diagram is an SVG with viewBox, role="img", aria-label
[ ] SVG is responsive (className="w-full")
[ ] All SVG colors use var(--color-*) CSS variables — ZERO hex in the file
[ ] Follows the C = { ... } alias map pattern from app/internet-owned/diagrams.tsx
[ ] lib/systems-thinking-data.ts exists with SystemsExample interface
[ ] "Systems Thinking in Practice" section added to how-i-work page
[ ] Systems examples render below the diagram as cards
[ ] DiagramFigure wrapper used (matches diagrams.tsx pattern)
[ ] figcaption present on the diagram
```

---

## PLAN-07: Email Capture

```
[ ] app/api/newsletter/route.ts exists
[ ] Newsletter route uses Zod safeParse for email validation
[ ] Newsletter route never leaks internal errors (generic messages only)
[ ] RESEND_AUDIENCE_ID is optional — route works gracefully without it
[ ] env.mjs updated with RESEND_AUDIENCE_ID: z.string().optional()
[ ] .env.example updated with RESEND_AUDIENCE_ID comment
[ ] components/home/NewsletterSignup.tsx exists with variant prop ("inline" | "footer")
[ ] Component is "use client" (has form state)
[ ] Newsletter signup appears at end of EVERY blog article
[ ] Newsletter signup appears in Footer
[ ] Success state replaces form after submission
[ ] Error state shows generic message
[ ] Privacy note present ("No spam. Unsubscribe any time.")
```

---

## PLAN-08: Architecture Cleanup

```
[ ] lib/how-i-work-data.ts exists and exports workPhases and expertiseAreas
[ ] HowIWork.tsx imports from lib/how-i-work-data.ts (no inline data arrays)
[ ] HowIWork.tsx visual output is identical to before (data-only change)
[ ] #8a8680 hex removed from all .tsx files
[ ] #0A66C2 hex removed from all .tsx files (uses --color-external-linkedin)
[ ] node scripts/audit.js exits 0 with no violations
[ ] TypeScript interfaces explicitly typed on data arrays in lib/
[ ] pnpm build passes
[ ] No visual/functional changes to any page
```

---

## PLAN-09: Mobile & Performance

```
[ ] playwright.config.ts has Pixel 5 and iPhone 12 projects enabled (not commented out)
[ ] e2e/mobile.spec.ts exists with at least 5 tests
[ ] Mobile tests cover: home render, mobile nav, 3+ editorial pages, contact form, blog article
[ ] Horizontal overflow check included in tests
[ ] <link rel="preconnect" href="https://cdn.simpleicons.org" /> in app/layout.tsx
[ ] All mobile tests pass (npx playwright test --project="Mobile Chrome" e2e/mobile.spec.ts)
[ ] No visual regressions introduced (layout fixes only — no design changes)
[ ] next/image used for any <img> tags found
[ ] pnpm build passes
```

---

## PLAN-10: New Articles

```
[ ] lib/blog-articles-data.ts exists with 3 article entries
[ ] Article slugs: prompt-as-design-artifact, why-design-systems-fail, designing-for-decisions
[ ] All 3 articles have full content (5 sections each, 150-300 words per section)
[ ] No lorem ipsum or placeholder article body text
[ ] Articles use same TypeScript type as existing articles (no new types introduced)
[ ] app/blog/[slug]/page.tsx serves articles from both data sources
[ ] generateStaticParams includes all 8 article slugs
[ ] /blog list page shows all 8 articles
[ ] All 3 new routes render without 404
[ ] pnpm build pre-renders all 3 new routes as static pages
[ ] lib/what-i-bring-cards.ts is UNCHANGED
```

---

## Universal checks (apply to ALL plans)

```
[ ] pnpm tsc --noEmit: 0 errors
[ ] pnpm lint: 0 errors (warnings OK)
[ ] node scripts/audit.js: exit 0
[ ] pnpm build: success
[ ] No hex colors in any .tsx file
[ ] No 1px borders in any new component
[ ] cn() used for all class construction (not twMerge / template literals)
[ ] No component file > 300 lines
[ ] No data arrays hardcoded in components
[ ] New API routes use Zod
[ ] All new lib files have exported TypeScript interfaces
```
