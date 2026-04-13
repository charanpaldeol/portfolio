# PLAN-07: Email Capture — Newsletter Signup

> Read `agents/plans/_PROJECT_CONTEXT.md` first for coding rules, file locations, and tech stack.

## Objective
Add an email capture mechanism to convert passive article readers into a pipeline of warm prospects. Currently someone can read all 5 blog articles and leave with no way for Charan to follow up. A newsletter signup at the end of blog articles, on the home page, and in the footer turns one-time visitors into ongoing relationships.

## What exists today
- **Blog article page**: `app/blog/[slug]/page.tsx` + the `BlogTopicArticle` component
- **Home page**: `app/page.tsx`
- **Footer**: `components/layout/Footer.tsx`
- **Contact API**: `app/api/contact/route.ts` — study this for the API route pattern (uses Zod + Resend)
- **Environment**: `env.mjs` — Resend env vars already configured; we'll add a new list ID variable
- **CTABand**: `components/home/CTABand.tsx` — existing CTA; the email signup is different (lower-friction)

## Steps

### Step 1 — Read existing files
Read before writing:
1. `app/api/contact/route.ts` — study the Zod + Resend pattern to replicate it
2. `app/blog/[slug]/page.tsx` + the BlogTopicArticle component it uses
3. `components/layout/Footer.tsx` — to add signup there
4. `env.mjs` — to add new env variable
5. `.env.example` — to document the new variable

### Step 2 — Create the API route
Create `app/api/newsletter/route.ts`:

```typescript
import { z } from "zod"
import { NextResponse } from "next/server"

// Zod schema — validate before anything else
const subscribeSchema = z.object({
  email: z.string().email().max(255),
})

export async function POST(request: Request) {
  // 1. Parse body
  // 2. Validate with subscribeSchema.safeParse()
  // 3. On invalid: return 400 with { error: "Invalid email address" }
  // 4. On valid: 
  //    - If RESEND_AUDIENCE_ID env var is set, add contact to Resend audience
  //    - If not set (local dev / before setup), log and return success anyway
  // 5. Return 200 with { success: true, message: "You're on the list." }
  // 6. Catch all errors: return 500 with generic { error: "Something went wrong." }
  //    Never leak internal error details
}
```

For Resend audience integration:
```typescript
// Add contact to Resend audience (if configured)
if (process.env.RESEND_AUDIENCE_ID) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.contacts.create({
    email: validatedData.email,
    audienceId: process.env.RESEND_AUDIENCE_ID,
    unsubscribed: false,
  })
}
```

### Step 3 — Update env.mjs and .env.example
In `env.mjs`, add to the server schema:
```typescript
RESEND_AUDIENCE_ID: z.string().optional(),
```

In `.env.example`, add:
```
# Resend audience ID for newsletter signups (optional — get from Resend dashboard)
RESEND_AUDIENCE_ID=aud_...
```

### Step 4 — Create the signup component
Create `components/home/NewsletterSignup.tsx` — this is a Client Component (needs form state):

```typescript
"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  variant?: "inline" | "footer"  // inline = full-width section; footer = compact
}
```

**Form behavior**:
- Single email input + submit button
- States: idle → submitting (show spinner or "Joining...") → success ("You're on the list ✓") → error ("Something went wrong — try again")
- On submit: `fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) })`
- On success: replace form with success message, keep email hidden
- Input: `type="email"` with `required`, `placeholder="your@email.com"`, accessible `aria-label`

**Visual design**:

`variant="inline"` (for blog article end and home page):
- Full-width section with `bg-surface-container-low` background
- Eyebrow: "Stay in the loop" (`text-xs font-semibold uppercase tracking-widest text-on-surface-variant`)
- Heading: "Get new articles when they drop" (Manrope, `text-2xl font-bold`)
- Subtext: "Product design, AI workflows, and systems thinking — roughly once a month. No noise."
- Input + button side by side on desktop, stacked on mobile
- Input: `bg-surface rounded-lg px-4 py-3 text-on-surface` (no border, `focus:outline-none focus:ring-2 focus:ring-primary`)
- Button: `bg-primary text-primary-foreground rounded-lg px-6 py-3 font-semibold`
- Privacy note: `text-xs text-on-surface-variant mt-2` — "No spam. Unsubscribe any time."

`variant="footer"` (compact, for footer):
- Single line: input + button
- No heading (context is implied by footer placement)
- Same input/button styles but smaller padding

### Step 5 — Add to blog articles
In the `BlogTopicArticle` component (or the blog `[slug]` page), add `<NewsletterSignup variant="inline" />` after the article body content, before any related links section.

Read the component first to understand the exact placement.

### Step 6 — Add to footer
In `components/layout/Footer.tsx`, add `<NewsletterSignup variant="footer" />` in an appropriate column or above the copyright line.

### Step 7 — Add to home page (optional, low priority)
If the home page has a natural spot (after Blog Teaser or before Footer), add `<NewsletterSignup variant="inline" />`. Read `app/page.tsx` to decide — don't force it if the page is already content-dense.

### Step 8 — Verify and commit
```bash
pnpm tsc --noEmit
pnpm lint
node scripts/audit.js
```

Commit:
```
feat: add newsletter email capture

- Create app/api/newsletter/route.ts with Zod validation and Resend audience integration
- Add components/home/NewsletterSignup.tsx with inline and footer variants
- Integrate newsletter signup at end of all blog articles and in footer
- Add RESEND_AUDIENCE_ID to env.mjs and .env.example
```

## Success criteria
- Newsletter form appears at the end of blog articles
- Form appears in footer
- Form submits without error (even with no RESEND_AUDIENCE_ID set — graceful degradation)
- Success state shows after submission
- API route uses Zod validation
- `pnpm build` passes
- `node scripts/audit.js` exits 0

## Constraints
- API route MUST use Zod validation (enforced by ESLint `api-routes-require-zod`)
- Never leak internal errors to the client — always use generic error messages
- The client component must be only the form itself, not the whole section (keep server/client boundary clean)
- No hex colors — design tokens only
- No borders on inputs — use `ring` focus state instead
