# LAUNCH — Run All 10 Portfolio Improvement Agents with Governance

## Overview

```
┌─────────────────────────────────────────────────────┐
│                   ORCHESTRATOR                       │
│         (you, Claude Code, or Cursor)                │
└────────────────────┬────────────────────────────────┘
                     │ spawns
        ┌────────────┴────────────┐
        ▼                         ▼
  Worker Agents (x10)      Governance Agent
  • Build features          • Reviews submissions
  • Run checks              • Approves or rejects
  • Write reports     ◄──── • Gives specific feedback
  • Fix & resubmit          • Authorises git commit
        │                         │
        └──── files on disk ───────┘
         (agents/governance/reports/ + reviews/)
```

All communication between agents happens through **files on disk** — making this workflow portable across Claude Code, Cursor, and any other AI tool.

---

## Option A — Run all 10 in parallel (Claude Code)

Copy the prompt below and paste it as a new message in Claude Code.

---

**[ COPY FROM HERE ]**

Spawn 10 worker agents in parallel using the Agent tool, plus keep the governance agent ready to review each one when they report back.

Each worker agent must:
1. Read `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/_PROJECT_CONTEXT.md`
2. Read its specific plan file
3. Do the work fully
4. Run `pnpm tsc --noEmit`, `pnpm lint`, `node scripts/audit.js`, `pnpm build`
5. Write a completion report to `agents/governance/reports/PLAN-[XX]-status.md` using the template at `agents/governance/REPORT-TEMPLATE.md`
6. Output "GOVERNANCE REVIEW REQUESTED — Plan: PLAN-[XX] — Round: 1"
7. Wait — do NOT commit anything

Spawn these 10 worker agents now:

Agent 1 — PLAN-01 (Case Study Depth): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-01-case-study-depth.md`. Extend lib/projects-data.ts with impactMetrics/tagline/role/timeline, rewrite project detail page to metrics-first, update project cards.

Agent 2 — PLAN-02 (Social Proof): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-02-social-proof.md`. Create lib/testimonials-data.ts, build Testimonials component, add to home and About pages.

Agent 3 — PLAN-03 (Work With Me): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-03-work-with-me.md`. Create /work-with-me page with engagement types, process, FAQ, CTA. Add to navigation.

Agent 4 — PLAN-04 (Services Page): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-04-services-page.md`. Rewrite ServicesContent with 4 concrete services, deliverables, outcomes, differentiation statement.

Agent 5 — PLAN-05 (AI Workflow): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-05-ai-workflow-narrative.md`. Create /how-i-use-ai page with 5 workflow phases and philosophy. Add to navigation.

Agent 6 — PLAN-06 (Systems Thinking Visual): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-06-systems-thinking-visual.md`. Create SVG Design Leverage Stack diagram, add Systems Thinking section to how-i-work page.

Agent 7 — PLAN-07 (Email Capture): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-07-email-capture.md`. Create /api/newsletter route with Zod, build NewsletterSignup component, add to blog articles and footer.

Agent 8 — PLAN-08 (Architecture Cleanup): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-08-architecture-cleanup.md`. Extract HowIWork data to lib/, fix remaining hardcoded colors, add as const.

Agent 9 — PLAN-09 (Mobile & Performance): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-09-mobile-performance.md`. Enable mobile Playwright tests, write mobile e2e tests, add preconnect hint.

Agent 10 — PLAN-10 (New Articles): Read and execute `/Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-10-new-articles.md`. Write 3 new standalone articles and wire into blog routing.

After all agents have written their reports, for each agent that outputs "GOVERNANCE REVIEW REQUESTED": spawn a governance agent with this prompt: "You are the governance agent for cpdeol.com. Read `/Users/al/Projects AI/Portfolio/portfolio/agents/governance/GOVERNANCE-AGENT.md` for your full brief. Review PLAN-[XX] now. The worker's report is at `agents/governance/reports/PLAN-[XX]-status.md`. Run all 4 automated checks, verify the code, check against `agents/governance/REVIEW-CHECKLIST.md`, write your decision to `agents/governance/reviews/PLAN-[XX]-review.md`, and output either APPROVED (with commit commands) or REVISION NEEDED (with specific fixes)."

**[ COPY TO HERE ]**

---

## Option B — Run in Cursor (or any AI tool)

Use this workflow for any single plan in Cursor, Windsurf, or another AI assistant.

### Step 1 — Brief the worker agent
Paste this as the system prompt or first message:

```
You are a worker agent for cpdeol.com.

Read these two files in full before doing anything else:
1. /Users/al/Projects AI/Portfolio/portfolio/agents/plans/_PROJECT_CONTEXT.md
2. /Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-[XX]-[name].md

Execute the plan completely. When done, run all 4 checks, write your report to agents/governance/reports/PLAN-[XX]-status.md using the template at agents/governance/REPORT-TEMPLATE.md, then say "GOVERNANCE REVIEW REQUESTED — PLAN-[XX] — Round 1". Do NOT commit anything.
```

### Step 2 — Brief the governance agent
When the worker says "GOVERNANCE REVIEW REQUESTED", start a new conversation and paste:

```
You are the Governance Agent for cpdeol.com.

Read your full brief at:
/Users/al/Projects AI/Portfolio/portfolio/agents/governance/GOVERNANCE-AGENT.md

Review PLAN-[XX]:
- Worker report: agents/governance/reports/PLAN-[XX]-status.md
- Acceptance checklist: agents/governance/REVIEW-CHECKLIST.md (find the PLAN-[XX] section)
- Run: pnpm tsc --noEmit, pnpm lint, node scripts/audit.js, pnpm build
- Read every file the worker created or modified
- Write your decision to: agents/governance/reviews/PLAN-[XX]-review.md

Output either:
- APPROVED with exact git commands
- REVISION NEEDED with specific fixes
```

### Step 3 — Loop if revision needed
If governance outputs "REVISION NEEDED":
1. Show the worker agent the review file: `agents/governance/reviews/PLAN-[XX]-review.md`
2. Tell it: "Fix every item marked ❌. Increment round to [N+1]. Update your status report. Request governance review again."
3. Repeat Step 2 with the new round number.

### Step 4 — Commit when approved
When governance outputs "APPROVED", give the exact git commands to the worker agent (they're in the review file).

---

## Option C — Run one plan right now (quickstart)

To run a single plan immediately, paste this:

```
You are a worker agent. Read /Users/al/Projects AI/Portfolio/portfolio/agents/plans/_PROJECT_CONTEXT.md and /Users/al/Projects AI/Portfolio/portfolio/agents/plans/PLAN-08-architecture-cleanup.md. Execute the plan. When done, write your report to agents/governance/reports/PLAN-08-status.md and say "GOVERNANCE REVIEW REQUESTED".
```

(Plan 08 — Architecture Cleanup — is the lowest-risk starting point: no new pages, no content to write, just data extraction and color fixes.)

---

## Conflict map — safe parallel batches

Plans 03, 05, 06 all modify `config/navigation.tsx`. Plans 07, 10 both touch blog infrastructure.

| Batch | Plans | Notes |
|-------|-------|-------|
| **Batch A** (fully parallel, zero conflicts) | 01, 02, 04, 06, 08, 09 | Touch entirely different files |
| **Batch B** (run after A is committed) | 03, 05, 07, 10 | Nav + blog changes; safe once Batch A is merged |

---

## File map

```
agents/
├── governance/
│   ├── GOVERNANCE-AGENT.md     ← Governance agent's full brief
│   ├── REVIEW-CHECKLIST.md     ← Per-plan acceptance criteria
│   ├── REPORT-TEMPLATE.md      ← Worker completion report template
│   ├── reports/                ← Workers write here (PLAN-XX-status.md)
│   └── reviews/                ← Governance writes here (PLAN-XX-review.md)
└── plans/
    ├── _PROJECT_CONTEXT.md     ← Shared rules for all agents
    ├── _LAUNCH.md              ← THIS FILE
    ├── PLAN-01 through PLAN-10 ← Individual plan briefs
```
