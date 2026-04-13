# PLAN-05: AI Workflow Narrative — Personal Process Page

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
Create a `/how-i-use-ai` page that tells Charan's personal story of working with AI tools in the design and product process. The site already has "AI-Native Delivery" as a service, but there's no personal, authentic narrative of *how AI actually shows up in the daily work*. This page is a genuine differentiator — 72% of hiring managers value AI literacy but almost no designers document it specifically. This is not a list of tools. It is a *philosophy + workflow* story.

## What exists today
- **Related content**: `lib/what-i-bring-cards.ts` — read the `ai-native-delivery` card entry for existing positioning language
- **AI article content**: in `lib/what-i-bring-cards.ts` — find the entry where `slug === "ai-native-delivery"`. This is the existing AI-native messaging to build on.
- **How I Work page**: `app/how-i-work/page.tsx` — workflow framing reference
- **Internet Owned editorial**: `app/internet-owned/InternetOwnedEditorial.tsx` — example of long-form editorial layout with scroll-tracking sidebar nav

## Steps

### Step 1 — Read existing files
Read before writing:
1. `lib/what-i-bring-cards.ts` — find the `ai-native-delivery` entry, use its language
2. `app/how-i-work/page.tsx` + the HowIWork component it renders
3. `app/internet-owned/InternetOwnedEditorial.tsx` — to understand scroll-tracking sidebar nav pattern (optional to implement, but good reference)
4. `components/portfolio/EditorialPageHero.tsx` — hero props
5. `config/navigation.tsx` — to add the new route

### Step 2 — Create page data
Create `lib/ai-workflow-data.ts`:

```typescript
export type WorkflowPhase = {
  id: string
  title: string            // Phase name, e.g. "Discovery & Research"
  description: string      // 1 paragraph on this phase
  howAIHelps: string       // 1-2 paragraphs specifically on how AI changes this phase
  tools: string[]          // Specific tools used in this phase (Claude, Cursor, Figma AI, etc.)
  humanPart: string        // Critical: what remains irreducibly human — 1-2 sentences
  // This prevents the narrative from sounding like "AI does my job"
}

export type AIPhilosophyPoint = {
  id: string
  title: string
  body: string
}

export const workflowPhases: WorkflowPhase[] = [
  // Write 5 phases covering a typical product design workflow:
  // 1. Discovery & Research — AI for synthesis, pattern finding in user interviews
  // 2. Problem Framing — AI for generating problem statement variants, stress-testing assumptions
  // 3. Ideation & Concept Design — AI for rapid concept exploration, not final design
  // 4. Prototyping & Iteration — Cursor for prototype code, Figma AI for layout variants
  // 5. Handoff & Documentation — AI for writing specs, generating component docs
]

export const philosophyPoints: AIPhilosophyPoint[] = [
  // 3 core beliefs about AI in product design:
  // 1. AI accelerates the loop, humans set the direction
  // 2. The prompt is a design artifact — how you ask shapes what you get
  // 3. AI-native ≠ AI-dependent — know when NOT to use it
]
```

### Step 3 — Create the page
Create `app/how-i-use-ai/page.tsx` (Server Component) with metadata:
```typescript
export const metadata = {
  title: "How I Use AI | Charan Pal Deol",
  description: "A behind-the-scenes look at how AI tools integrate into product design workflows — from research synthesis to prototype code.",
}
```

Create `app/how-i-use-ai/HowIUseAIContent.tsx` with these sections:

**Section 1 — Hero** (use `EditorialPageHero`):
- eyebrow: "Working in public"
- title: "AI is my leverage, not my replacement"
- subtitle: "A transparent look at where AI accelerates my work, where it falls short, and what stays irreducibly human."

**Section 2 — Philosophy** (3 cards, horizontal):
Render `philosophyPoints`. Each card: bold title + body paragraph. Use `bg-surface-container-lowest` cards with no borders. Large decorative number `01` `02` `03` in `text-primary/20` behind the title (relative positioning).

**Section 3 — Workflow walkthrough** (5 phases, vertical):
For each `WorkflowPhase`:
- Phase number + title as H2
- `description` as intro paragraph
- **"Where AI helps"** sub-section with `howAIHelps` text + tool chips (`bg-secondary-fixed text-on-secondary-fixed rounded-full px-3 py-1 text-xs`)
- **"What stays human"** sub-section with `humanPart` text — use a `bg-primary-fixed` left accent strip to visually distinguish this

Alternate section backgrounds between `bg-surface` and `bg-surface-container-low` — no borders.

**Section 4 — Honest limitations** (editorial callout):
A pull-quote style section (DESIGN.md "Expert Highlight" pattern):
- Left accent bar: `w-1 bg-tertiary`
- Body: "AI still can't tell you if you're solving the right problem. Research, stakeholder alignment, and strategic judgment remain wholly human work. I use AI to think faster inside the right problem — not to find the problem itself."

**Section 5 — Related reading CTA**:
Link to `/blog/ai-native-delivery` and `/what-i-bring` for deeper context.

### Step 4 — Add to navigation
In `config/navigation.tsx`, add `/how-i-use-ai` to the `ideasLinks` array (line ~132). This array uses `SimpleNavLink` interface:
```typescript
export interface SimpleNavLink {
  href: string
  label: string
}
```
Add: `{ href: "/how-i-use-ai", label: "How I Use AI" }` to `ideasLinks`.

### Step 5 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
node scripts/audit.js
```

Commit:
```
feat: add /how-i-use-ai workflow narrative page

- Create lib/ai-workflow-data.ts with 5 workflow phases and 3 philosophy points
- Add app/how-i-use-ai/ page with philosophy, workflow walkthrough, honest limitations
- Add route to navigation
```

## Success criteria
- `/how-i-use-ai` renders with all 5 sections
- Page distinguishes between "where AI helps" and "what stays human" in each phase
- Page includes specific tool names (not just "I use AI")
- Route appears in navigation
- `pnpm build` passes
- `node scripts/audit.js` exits 0

## Constraints
- Server Component only
- No hex colors — design tokens only
- No borders — tonal shifts only
- Do NOT make this sound like a tools review or a features list — it must read as a philosophy + workflow story
- Keep files ≤ 300 lines
- Use `EditorialPageHero` for the hero
