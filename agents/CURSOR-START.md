# CURSOR START — Copy-Paste Prompts for Each Plan

## How to use in Cursor (or any single-agent tool)
1. Open Cursor Agent / Composer
2. Set working directory to: `/Users/al/Projects AI/Portfolio/portfolio`
3. Copy one of the prompts below and paste it as your first message
4. The agent runs autonomously — builds, self-reviews, fixes, loops, commits
5. Done when it outputs ✅ COMPLETE AND PUSHED

Each prompt is fully self-contained. The agent reads all context from files on disk.

---
---

## PLAN-01 — Case Study Depth

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-01 (Case Study Depth) fully and push to git.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md  (coding rules — mandatory)
2. agents/plans/PLAN-01-case-study-depth.md  (your work brief)
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-01" section + "Universal checks" section)

── STEP 2: EXECUTE ──
Follow every step in PLAN-01-case-study-depth.md exactly.

── STEP 3: SELF-REVIEW LOOP ──
After completing the work, run this loop. Repeat until ALL pass:

  a) pnpm tsc --noEmit          → must show 0 errors
  b) pnpm lint                  → must show 0 errors (warnings OK)
  c) node scripts/audit.js      → must exit 0
  d) pnpm build                 → must succeed

  Then check EVERY item in the PLAN-01 checklist AND Universal checks from REVIEW-CHECKLIST.md.
  For each ❌ item: fix it → re-run all 4 commands → re-check all items → repeat.
  Max 3 fix attempts per item. If still failing after 3 attempts: document it, move on.

── STEP 4: COMMIT (only after ALL checks pass) ──
  git add lib/projects-data.ts app/portfolio/projects/[slug]/ProjectDetailContent.tsx app/portfolio/projects/PortfolioProjectsContent.tsx
  git commit -m "$(cat <<'EOF'
feat: restructure project case studies to metrics-first format

- Extend ProjectData with impactMetrics, tagline, role, timeline, myRole, keyLearning
- Redesign ProjectDetailContent with impact strip above the fold
- Update project cards to surface tagline and top metric

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write completion report to: agents/governance/reports/PLAN-01-status.md
  Output: ✅ PLAN-01 COMPLETE AND PUSHED

RULES: No hex colors in TSX. No borders. Use cn(). Components ≤ 300 lines. Data in /lib/. Never ask for human input.
```

---

## PLAN-02 — Social Proof

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-02 (Social Proof) fully and push to git.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-02-social-proof.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-02" section + "Universal checks")

── STEP 2: EXECUTE ──
Follow every step in PLAN-02-social-proof.md exactly.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit          → 0 errors
  b) pnpm lint                  → 0 errors
  c) node scripts/audit.js      → exit 0
  d) pnpm build                 → success

  Check EVERY item in PLAN-02 checklist + Universal checks.
  Fix any ❌ → re-run all 4 → re-check → repeat until all pass.

── STEP 4: COMMIT ──
  git add lib/testimonials-data.ts components/home/Testimonials.tsx app/page.tsx app/portfolio/about/
  git commit -m "$(cat <<'EOF'
feat: add testimonials section and credibility signals

- Create lib/testimonials-data.ts with Testimonial interface (5 placeholder entries)
- Add components/home/Testimonials.tsx (3-column quote card grid)
- Integrate testimonials into home page and About page

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-02-status.md
  Output: ✅ PLAN-02 COMPLETE AND PUSHED

RULES: No hex colors. No borders. cn() only. Server Component. All placeholders marked // TODO.
```

---

## PLAN-03 — Work With Me Page

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-03 (Work With Me Page) fully and push to git.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-03-work-with-me.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-03" section + "Universal checks")

── STEP 2: EXECUTE ──
Follow every step in PLAN-03-work-with-me.md exactly.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit          → 0 errors
  b) pnpm lint                  → 0 errors
  c) node scripts/audit.js      → exit 0
  d) pnpm build                 → success

  Check EVERY item in PLAN-03 checklist + Universal checks.
  Fix any ❌ → re-run all 4 → re-check → repeat until all pass.
  Specifically verify: /work-with-me route renders, all 5 sections present, route in navigation.

── STEP 4: COMMIT ──
  git add lib/work-with-me-data.ts app/work-with-me/ config/navigation.tsx
  git commit -m "$(cat <<'EOF'
feat: add /work-with-me consulting page

- Create lib/work-with-me-data.ts with EngagementType, ProcessStep, FAQ
- Add app/work-with-me/ with 5 sections: hero, engagements, process, FAQ, CTA
- Add route to config/navigation.tsx

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-03-status.md
  Output: ✅ PLAN-03 COMPLETE AND PUSHED

RULES: No hex colors. No borders. cn() only. Use EditorialPageHero. Server Component. TODOs marked.
```

---

## PLAN-04 — Services Page

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-04 (Services Page) fully and push to git.
NOTE: The current services page has WRONG generic agency content (531 lines). Preserve Framer Motion animation patterns, replace all service data.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-04-services-page.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-04" section + "Universal checks")

── STEP 2: EXECUTE ──
Follow every step in PLAN-04-services-page.md exactly.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit          → 0 errors
  b) pnpm lint                  → 0 errors
  c) node scripts/audit.js      → exit 0
  d) pnpm build                 → success

  Check EVERY item in PLAN-04 checklist + Universal checks.
  Fix any ❌ → re-run all 4 → re-check → repeat.
  Specifically verify: 4 services with deliverables + outcomes, differentiation pull-quote, FAQ, dual CTA.

── STEP 4: COMMIT ──
  git add lib/services-data.ts app/portfolio/services/ServicesContent.tsx
  git commit -m "$(cat <<'EOF'
feat: rewrite services page with concrete offerings and outcomes

- Create lib/services-data.ts with 4 typed ServiceTier objects
- Rewrite ServicesContent with metrics, deliverables, differentiation statement
- Add service FAQ and dual CTA to work-with-me + contact

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-04-status.md
  Output: ✅ PLAN-04 COMPLETE AND PUSHED

RULES: No hex colors. No borders. No duplicating /what-i-bring content. Components ≤ 300 lines.
```

---

## PLAN-05 — AI Workflow Narrative

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-05 (AI Workflow Narrative) fully and push to git.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-05-ai-workflow-narrative.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-05" section + "Universal checks")

── STEP 2: EXECUTE ──
Follow every step in PLAN-05-ai-workflow-narrative.md exactly.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit          → 0 errors
  b) pnpm lint                  → 0 errors
  c) node scripts/audit.js      → exit 0
  d) pnpm build                 → success

  Check EVERY item in PLAN-05 checklist + Universal checks.
  Fix any ❌ → re-run all 4 → re-check → repeat.
  Specifically verify: each phase has both "where AI helps" AND "what stays human". Reads as philosophy, not tools list.

── STEP 4: COMMIT ──
  git add lib/ai-workflow-data.ts app/how-i-use-ai/ config/navigation.tsx
  git commit -m "$(cat <<'EOF'
feat: add /how-i-use-ai workflow narrative page

- Create lib/ai-workflow-data.ts with 5 workflow phases and 3 philosophy points
- Add app/how-i-use-ai/ with philosophy, workflow walkthrough, honest limitations
- Add route to navigation

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-05-status.md
  Output: ✅ PLAN-05 COMPLETE AND PUSHED

RULES: No hex colors. No borders. Use EditorialPageHero. Server Component. Specific tool names required.
```

---

## PLAN-06 — Systems Thinking Visual

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-06 (Systems Thinking Visual) fully and push to git.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-06-systems-thinking-visual.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-06" section + "Universal checks")
4. app/internet-owned/diagrams.tsx  (CRITICAL — follow this SVG pattern exactly)

── STEP 2: EXECUTE ──
Follow every step in PLAN-06-systems-thinking-visual.md exactly.
Mirror the const C = { ... } pattern and DiagramFigure wrapper from diagrams.tsx.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit          → 0 errors
  b) pnpm lint                  → 0 errors
  c) node scripts/audit.js      → exit 0  (grep for any hex in the new SVG file — must be zero)
  d) pnpm build                 → success

  Check EVERY item in PLAN-06 checklist + Universal checks.
  Fix any ❌ → re-run all 4 → re-check → repeat.
  Critical: grep the new diagram file for #[0-9a-fA-F] — must return nothing.

── STEP 4: COMMIT ──
  git add components/home/SystemsThinkingDiagram.tsx lib/systems-thinking-data.ts app/how-i-work/
  git commit -m "$(cat <<'EOF'
feat: add systems thinking visual diagram to how-i-work page

- Create components/home/SystemsThinkingDiagram.tsx (SVG Design Leverage Stack)
- Create lib/systems-thinking-data.ts with SystemsExample data
- Add Systems Thinking in Practice section to how-i-work page

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-06-status.md
  Output: ✅ PLAN-06 COMPLETE AND PUSHED

RULES: ALL SVG colors via var(--color-*) CSS variables — absolutely zero hex values in the file.
```

---

## PLAN-07 — Email Capture

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-07 (Email Capture) fully and push to git.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-07-email-capture.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-07" section + "Universal checks")
4. app/api/contact/route.ts  (follow this Zod + error-handling pattern exactly)

── STEP 2: EXECUTE ──
Follow every step in PLAN-07-email-capture.md exactly.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit          → 0 errors
  b) pnpm lint                  → 0 errors
  c) node scripts/audit.js      → exit 0
  d) pnpm build                 → success

  Check EVERY item in PLAN-07 checklist + Universal checks.
  Fix any ❌ → re-run all 4 → re-check → repeat.
  Critical checks: API route uses Zod safeParse. Generic error messages only. Works with no RESEND_AUDIENCE_ID set.

── STEP 4: COMMIT ──
  git add app/api/newsletter/route.ts components/home/NewsletterSignup.tsx env.mjs .env.example app/blog/ components/layout/Footer.tsx
  git commit -m "$(cat <<'EOF'
feat: add newsletter email capture

- Create app/api/newsletter/route.ts with Zod validation and Resend audience integration
- Add components/home/NewsletterSignup.tsx (inline + footer variants)
- Integrate newsletter signup at end of blog articles and in footer
- Add RESEND_AUDIENCE_ID to env.mjs and .env.example

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-07-status.md
  Output: ✅ PLAN-07 COMPLETE AND PUSHED

RULES: API must use Zod. Never leak errors to client. "use client" on form component only. No hex colors.
```

---

## PLAN-08 — Architecture Cleanup ← START HERE (lowest risk)

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-08 (Architecture Cleanup) fully and push to git.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-08-architecture-cleanup.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-08" section + "Universal checks")

── STEP 2: EXECUTE ──
Follow every step in PLAN-08-architecture-cleanup.md exactly.
This is data-only cleanup — no visual changes, no new pages.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit          → 0 errors
  b) pnpm lint                  → 0 errors
  c) node scripts/audit.js      → exit 0  (this is the primary success signal for this plan)
  d) pnpm build                 → success

  Check EVERY item in PLAN-08 checklist + Universal checks.
  Fix any ❌ → re-run all 4 → re-check → repeat.
  Critical: node scripts/audit.js must exit 0. grep components/home/HowIWork.tsx for inline arrays — must be empty.

── STEP 4: COMMIT ──
  git add lib/how-i-work-data.ts components/home/HowIWork.tsx styles/tailwind.css components/layout/
  git commit -m "$(cat <<'EOF'
chore: architecture cleanup — extract HowIWork data and fix hardcoded colors

- Create lib/how-i-work-data.ts with workPhases and expertiseAreas
- Remove inline data arrays from HowIWork.tsx, import from lib
- Add --color-shell-mid token to tailwind.css, replace hardcoded #8a8680
- Use --color-external-linkedin token in SocialLinks.tsx

node scripts/audit.js now exits 0 on all checks.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-08-status.md
  Output: ✅ PLAN-08 COMPLETE AND PUSHED

RULES: Zero visual changes. Zero functional changes. Only move data. If as const causes TS errors, skip it.
```

---

## PLAN-09 — Mobile & Performance

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-09 (Mobile & Performance) fully and push to git.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-09-mobile-performance.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-09" section + "Universal checks")
4. e2e/eye-break.spec.ts  (follow this test-writing pattern exactly)

── STEP 2: EXECUTE ──
Follow every step in PLAN-09-mobile-performance.md exactly.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit                    → 0 errors
  b) pnpm lint                            → 0 errors
  c) node scripts/audit.js               → exit 0
  d) pnpm build                           → success
  e) Start dev server and run mobile tests:
     npx playwright test --project="Mobile Chrome" e2e/mobile.spec.ts

  Check EVERY item in PLAN-09 checklist + Universal checks.
  Fix any ❌ → re-run → repeat.
  If a mobile test fails due to a real layout bug: fix the layout, re-run tests.
  If a mobile test fails due to test code error: fix the test assertion.

── STEP 4: COMMIT ──
  git add playwright.config.ts e2e/mobile.spec.ts app/layout.tsx
  git commit -m "$(cat <<'EOF'
fix: enable mobile Playwright tests and performance improvements

- Enable Pixel 5 and iPhone 12 Playwright projects in playwright.config.ts
- Add e2e/mobile.spec.ts with 5 mobile test scenarios
- Add preconnect hint for cdn.simpleicons.org in root layout
- Fix any layout overflow issues found during mobile testing

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-09-status.md
  Output: ✅ PLAN-09 COMPLETE AND PUSHED

RULES: Fix layout issues only — zero design changes. Test behavior not implementation details.
```

---

## PLAN-10 — New Articles

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are an autonomous agent for cpdeol.com. Complete this mission without stopping or asking for human input.

MISSION: Execute PLAN-10 (New Articles) fully and push to git.
NOTE: Article type is WhatIBringCard (exact name). generateStaticParams in blog/[slug]/page.tsx is hardcoded — you must convert it to dynamic. Do NOT modify lib/what-i-bring-cards.ts.

── STEP 1: LOAD CONTEXT ──
Read these files in full before writing a single line of code:
1. agents/plans/_PROJECT_CONTEXT.md
2. agents/plans/PLAN-10-new-articles.md
3. agents/governance/REVIEW-CHECKLIST.md  (find "PLAN-10" section + "Universal checks")
4. lib/what-i-bring-cards.ts  (CRITICAL — WhatIBringCard is the type; use it exactly)
5. app/blog/[slug]/page.tsx  (CRITICAL — generateStaticParams is hardcoded, you must make it dynamic)

── STEP 2: EXECUTE ──
Follow every step in PLAN-10-new-articles.md exactly.
Do NOT modify lib/what-i-bring-cards.ts.

── STEP 3: SELF-REVIEW LOOP ──
  a) pnpm tsc --noEmit          → 0 errors
  b) pnpm lint                  → 0 errors
  c) node scripts/audit.js      → exit 0
  d) pnpm build                 → success (must pre-render all 3 new slugs)

  Check EVERY item in PLAN-10 checklist + Universal checks.
  Fix any ❌ → re-run all 4 → re-check → repeat.
  Critical: all 3 article slugs in build output. No lorem ipsum. 5 full sections per article.

── STEP 4: COMMIT ──
  git add lib/blog-articles-data.ts app/blog/[slug]/page.tsx app/blog/page.tsx
  git commit -m "$(cat <<'EOF'
feat: add 3 standalone thought leadership articles

- Create lib/blog-articles-data.ts with prompt-as-design-artifact,
  why-design-systems-fail, designing-for-decisions
- Update blog [slug] route to serve both article sources
- Update blog list page to show all 8 articles

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
  git push
  Write report to: agents/governance/reports/PLAN-10-status.md
  Output: ✅ PLAN-10 COMPLETE AND PUSHED

RULES: Same TypeScript type as existing articles. lib/what-i-bring-cards.ts untouched. Substantive content only.
```

---

## Recommended order if running sequentially in Cursor

```
Round 1 (no conflicts):    08 → 01 → 02 → 04 → 06 → 09
Round 2 (after Round 1):   03 → 05 → 07 → 10
```

Plan 08 first — it's the cleanest, lowest-risk, and makes the audit fully green before other agents add new code.
