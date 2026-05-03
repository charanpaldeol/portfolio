# Code Factory Plan — cpdeol.com
> Based on Eric Zakariasson's "Building Your Own Software Factory" (Cursor / AI Engineer, April 2026)
> Mapped against current portfolio codebase state

---

## Where We Are Now

Eric's framework has 6 levels. Honestly, this codebase is already surprisingly far along:

| Level | Description | Status |
|-------|-------------|--------|
| 1 | Spicy autocomplete | ✅ Done |
| 2 | Pair programming back-and-forth | ✅ Done |
| 3 | Agent generates code, human reviews | ✅ Done |
| **4** | **Delegation + structured plans, self-review loops** | **✅ We're here** |
| 5 | Async parallel agents, human as manager | 🔶 Partial |
| 6 | Dark factory — agents ship autonomously | ❌ Not yet |

**What we already have that most teams don't:**
- `.cursorrules` acting as a proper SOP (Eric's #1 precursor)
- `agents/plans/` with 10 fully-specified agent briefs
- Self-review loops baked into every plan prompt (tsc → lint → audit → build)
- `agents/governance/` with checklists and report templates
- Custom ESLint rules blocking bad patterns at commit time
- Playwright e2e tests + Vitest unit tests
- Design system tokens enforced by code
- Husky pre-commit hooks as hard guardrails
- SKILL files for different agent roles (designer, developer, tester, etc.)

**The gap to factory:** everything above runs *synchronously with a human present*. The factory runs *async and in parallel*, with agents verifying their own work and humans only reviewing outcomes.

---

## The Factory Plan — 4 Phases

---

### PHASE 1 — Harden the Foundation
*"Verifiable systems first. Agents can't be free if you can't trust their output."*

This is Eric's "precursor to factory" — the unglamorous work that makes everything else possible.

#### 1.1 Make the Dev Environment Agent-Startable

Right now, `pnpm dev` requires a human. Agents need to be able to boot the environment themselves.

**What to build:**
- A single `pnpm agent:start` script that: kills port 3000, starts Next.js dev, waits for it to be ready, outputs a health-check URL
- Document expected startup sequence in `agents/CURSOR-START.md` so agents know what "ready" looks like
- Verify agents can run `pnpm e2e:headless` without a human touching anything

**Why:** Eric specifically called this out — "Can agents start the dev environment?" is a prerequisite. If they can't, they can't verify UI work autonomously.

#### 1.2 Wire Up E2E Tests to Every Plan

The plans have a self-review loop (tsc → lint → audit → build) but **don't run Playwright**. This is the biggest gap in verification.

**What to build:**
- Add `pnpm e2e:headless` as step (e) in every plan's self-review loop
- Expand `e2e/` coverage to cover every major page: home, services, portfolio, blog, work-with-me
- Add smoke tests that agents can run in < 60 seconds: does each route render, does navigation work, are key elements present

**Why:** Eric said "agents verify their own work via unit tests, integration tests, UI tests — actually clicking the DOM." Right now agents *can't* click the DOM to verify. This closes that gap.

#### 1.3 Add a `pnpm verify` Master Command

**Status:** `package.json` already defines `pnpm verify` (tsc, lint, audit, build, port cleanup, `e2e:smoke`, `e2e:proof`; `verify:full` adds unit tests). The original sketch used `e2e:headless` — the **implemented** chain is the source of truth.

**Remaining:** Replace any plan text that still lists four separate steps with **`pnpm verify`**. **`factory-run-once`** invokes **`pnpm verify`** in the worktree (same bar as human pre-merge; exceptions in **`docs/factory/FACTORY_VERIFY_GATE.md`**) — **Goal-truth Phase A1** ✅.

**Why:** Simplifies agent prompts, reduces prompt length, and makes it easier to add new checks without updating 10 plan files.

#### 1.4 Screenshot/Visual Verification for UI Changes

For any plan that touches UI, agents need a way to produce proof that it looks right.

**What to build:**
- Add a Playwright screenshot step to `pnpm verify` that captures key pages at desktop + mobile
- Save screenshots to `agents/governance/screenshots/[plan-id]/` after each run
- Agents reference these screenshots in their completion reports

**Why:** Eric talked about "video recording of agent computer-use actions" as human-verifiable proof. Screenshots are our equivalent — you can glance at an image to confirm a page looks right without reading 300 lines of diff.

---

### PHASE 2 — Build the Factory Infrastructure
*"Shift from sync to async. The work should happen in the background."*

This is where the real factory starts — agents running without a human present.

#### 2.1 Parallel Plan Execution via Background Agents

Right now you run one plan at a time in Cursor. The factory runs many in parallel.

**What to build:**
- Define which plans are safe to run in parallel (no shared files = no merge conflicts)
  - Current safe pairs: 08+01, 02+04, 06+09
- Create a `PARALLEL-RUNS.md` in `agents/` documenting which plans can run simultaneously
- Move to Cursor's background agents feature for all plans — start a plan, switch context, start another

**Why:** Eric runs "5-10 agents async at all times." The plans already have the structure for this — they just need to be kicked off in parallel rather than sequentially.

#### 2.2 Add MCP Context Integrations

Agents currently have no access to external context — they can't check Vercel logs, Linear tickets, or Slack feedback. This forces a human to copy-paste context before every agent run.

**Priority integrations to wire up:**
- **Vercel MCP** (already installed!) — agents can check build logs and deployment status autonomously
- **GitHub** — agents can read open issues, check PR status, reference past decisions
- **Linear** — when you create a ticket, the agent reads the spec directly instead of you pasting it
- **Google Drive** — agents reference specs and research docs (like this transcript!) without you copying content

**How:** Update `_PROJECT_CONTEXT.md` to tell agents which MCPs are available and when to use them. Add to `.cursorrules`: "Before starting work, check Vercel for any failing builds."

**Why:** Eric described the manual work of copying Datadog logs, pasting Notion specs, and pulling Slack feedback as exactly the kind of friction that should be automated. MCP connections remove the human as a copy-paste layer.

#### 2.3 Feature Flag System

Currently agents ship complete features or nothing. Feature flags let agents merge safely and leave humans to toggle features in production.

**What to build:**
- Simple feature flag utility in `lib/feature-flags.ts` — just a server-side env var check
- Pattern: `if (featureFlag('new-testimonials')) { ... }`
- Agents add flags to any new section or feature they build
- Add `FEATURE_FLAGS` section to `.cursorrules` so agents know the pattern
- Document in plans: "New features must be behind a flag unless explicitly told otherwise"

**Why:** Eric specifically said "feature flagging skills" are an enabler that lets agents be free — they can merge, leave it flagged off, and the human toggles it in production when ready. Removes the fear of merging unreviewed agent work.

#### 2.4 Continue Learning — Automatic Rule Extraction

Right now when an agent goes off-rails, you fix it manually. The learning doesn't feed back automatically.

**What to build:**
- A lightweight `scripts/extract-rules.ts` script: reads agent completion reports in `agents/governance/reports/`, finds documented failures and workarounds, suggests new `.cursorrules` additions
- Run it after every 3-5 agent runs: `pnpm extract-rules`
- Review suggestions and add approved ones to `.cursorrules`

**Why:** Eric's "continue learning plugin" does this automatically. Our version is semi-manual but captures the same flywheel — agent fails → rule added → next agent doesn't fail the same way. The codebase already has the report infrastructure (`agents/governance/reports/`). We just need to read it.

---

### PHASE 3 — Run the Factory
*"You're a manager now. Your job is scope, context, and reviewing outcomes — not reading code."*

#### 3.1 Shift to Outcome-Based Review

Stop reviewing code diffs. Start reviewing outcomes.

**New review ritual:**
1. Agent runs, produces screenshots + completion report
2. You open the live Vercel preview URL
3. You check: does the page look right? Does navigation work? Does content make sense?
4. If yes → merge. No reading code required.
5. If no → read the report, identify the failure, add a rule, re-run.

**What to build:**
- Update `agents/governance/REPORT-TEMPLATE.md` to require: screenshot paths, Vercel preview URL, checklist confirmation, any deviations documented
- Add to `.cursorrules`: "Your completion report must include the Vercel preview URL and screenshot paths."

#### 3.2 Weekly Factory Review Ritual

Once a week, do a manager-style review of what the factory produced:

1. Check `agents/governance/reports/` — what ran, what failed, what patterns are emerging?
2. Check `agents/governance/reviews/` — what issues were caught?
3. Run `pnpm extract-rules` — what new rules should be added?
4. Look at the backlog (`backlog.md`) — what should agents work on next?
5. Update `agents/plans/` with any new work briefs

This replaces ad-hoc task management with a structured cadence. You spend ~30 minutes/week managing the factory instead of hours writing code.

#### 3.3 Preserve Tribal Knowledge

Eric was emphatic: "Don't fully outsource understanding to agents. Preserve tribal knowledge."

**For this project, tribal knowledge includes:**
- Why certain files are frozen (layout stability, past breakages)
- Why the design system is strictly enforced (design consistency across pages)
- Why `PortfolioShell.tsx` is untouched (it's the one consistent shell — breaking it breaks everything)
- The copy rules (exact words matter for personal brand)

**Action:** Add a `docs/TRIBAL-KNOWLEDGE.md` that captures the *why* behind key decisions. Agents don't need to read it every run, but it's there when a new agent needs context on why something is structured the way it is.

---

### PHASE 4 — Scale the Factory
*"Find repetitive patterns. Automate the handoffs. Move up the abstraction level."*

#### 4.1 Automate the Backlog → Agent Pipeline

Right now: you think of something → you write a plan → you paste it into Cursor → agent runs.

**Factory version:** you add a note to `backlog.md` → an agent converts it to a structured plan → another agent executes it.

**What to build:**
- A plan-generation prompt: "Read `backlog.md`. For each item, generate a structured plan in the format of `agents/plans/PLAN-XX.md`. Save to `agents/plans/`."
- Run this weekly as part of the factory review ritual

#### 4.2 Automated Deployment Verification

After every merge to main, an automated check should verify the Vercel deployment succeeded.

**What to build:**
- Add a post-deploy check using the Vercel MCP: after deployment, fetch the live URL, check status code, screenshot key pages
- If anything fails, create a plan to fix it and add to the top of the plan queue
- Document this in `agents/governance/GOVERNANCE-AGENT.md`

#### 4.3 Agentic Code Owner Rules

Right now the frozen file list in `.cursorrules` is binary — touched or not touched. Scale this with risk levels:

- **Never touch (frozen):** `app/layout.tsx`, `GlobalChrome.tsx`, `PortfolioShell.tsx`
- **Touch with caution (flag for review):** `design-system.ts`, `styles/tailwind.css`
- **Free to modify:** everything in `lib/`, `app/[route]/page.tsx` files, `components/home/`

Add this risk classification to `.cursorrules` so agents know which files need extra care vs. which they can move fast on.

#### 4.4 Agent-to-Agent Orchestration

The end-game: one orchestrator agent that reads the backlog, picks the right plan, assigns it to the right skill file, runs it, checks the outcome, and queues the next one.

**What to build (eventually):**
- An `ORCHESTRATOR-PROMPT.md` that: reads the backlog, identifies highest-priority item, checks which plans are in-flight, spawns the right skill agent, monitors the completion report
- Start simple — just a prompt you run once a week. Over time, automate the trigger.

---

## Goal-truth / Eric gaps — phases A–E

This track **complements** the four phases above. It is ordered by **impact on outcomes that are true to the north star** in `agents/factory-goal-spec.json` (including `goal_revision` and `pnpm factory:goal-pivot` when the goal changes). Eric’s talk stresses **verifiable systems**, **clear intent**, and **safe autonomy** — these phases map those ideas onto concrete repo work.

**Already in place:** `.cursorrules` + audit + ESLint, `pnpm verify` (see `package.json` — tsc, lint, audit, build, port cleanup, `e2e:smoke`, `e2e:proof`; `verify:full` adds unit tests), **`factory-run-once` runs `pnpm verify` in the worktree after `spec.command`** (Phase **A1** — see `docs/factory/FACTORY_VERIFY_GATE.md`), **Phase B** (roadmap **traces** + `factory:plan-from-goal` validation, post-goal **workflow** in `agents/FACTORY_GOAL.md`, **`factory:evaluate-goal`** lists not-done roadmap ids), **Phase C** (**`docs/factory/FACTORY_MERGE_POLICY.md`**, **`docs/factory/DEFINITION_OF_DONE.md`** `FF_*` DoD, **`pnpm factory:preflight`** before `run-once` claims work — see `docs/factory/FACTORY_VERIFY_GATE.md`), goal spec + `factory:evaluate-goal`, **`goal_revision` + `pnpm factory:goal-pivot`** for stale-queue cancellation on goal change, git worktrees in `factory-run-once`.

**Cross-reference:** Phase **A** deepens §1.2–1.4; **B** ties roadmap/queue to the stated goal; **C–D** align with §2.3 and §1.1; **E** aligns with §2.4 / “continue learning” but scoped to **factory runs**, not product-wide transcripts.

### Phase A — Single verification gate (highest impact on goal-truth)

Eric: agents must **prove** their work (tests, especially UI); trust comes from **verifiable systems**, not vibes.

| Step | What to build | Exit criterion |
|------|----------------|----------------|
| **A1** ✅ **Done** | **`pnpm verify`** is the **pre-commit / pre-done** gate in `factory-run-once`: invoked in the worktree **after** `spec.command`, **before** `git add`/commit. Policy and exceptions: **`docs/factory/FACTORY_VERIFY_GATE.md`**. Implementation: **`scripts/agent-factory/factory-run-once.ts`**. | No shipping path skips **`pnpm verify`**; documented deltas vs `verify:full`, CI, and post-merge UAT only. |
| **A2** | Expand **`e2e/`** so every **goal-critical** route or behavior named in `factory-goal-spec.json` / roadmap DoD has a **deterministic** test (tags or file naming by roadmap id where helpful). | If the goal claims a URL or flow exists, CI-style tests fail when it does not. |
| **A3** | Add a **short goal-smoke** path for factory items that touch `app/` or `components/` (reuse `e2e:smoke` or a dedicated spec) so UI goals cannot pass without DOM-level proof. | UI-shipping items always exercise at least one smoke path. |
| **A4** | Tighten **`goal_acceptance`** in `factory-goal-spec.json`: one to three commands that **only pass** when the north star is actually true (e.g. focused Playwright, `curl` to a route, etc.). Keep them **fast** enough to run when `factory:evaluate-goal` says `met`. | “`met`” means measured, not merely “queue empty.” |

### Phase B — Traceability from goal → work (high impact)

Eric: **front-load intent**; you must see that scheduled work serves the goal.

| Step | What to build | Exit criterion |
|------|----------------|----------------|
| **B1** ✅ **Done** | **`traces_goal`** (optional) + first **`definition_of_done`** bullet on roadmap rows; **`validateRoadmapItemsTraceToGoal`** in **`lib/agent-factory/goal-spec.ts`**; **`factory:plan-from-goal`** refuses merge if a row does not trace **`statement`** (keyword overlap). | No orphan roadmap id that cannot be justified from the current `statement`. |
| **B2** ✅ **Done** | **Post–goal-change sequence** documented in **`agents/FACTORY_GOAL.md`** (pivot → plan-from-goal → plan-next; roadmap regen noted as alternative). **`factory:doctor`** remains **optional / not built** — add later if meta/roadmap/queue drift needs an automated guard. | After a pivot, documented steps realign queue to the new north star. |
| **B3** ✅ **Done** | **`factory:evaluate-goal`** writes **`roadmap_not_done`** (id, title, queue_status) to **`agents/factory-goal-state.json`** and logs **`id — title [status]`** lines. **`evaluateFactoryGoalStatus`** in **`lib/agent-factory/goal-spec.ts`** builds the list and appends to summary when active/blocked. | Faster correction when status says `active` but the goal “feels” done. |

### Phase C — Safe autonomy defaults (medium–high impact)

Eric: **feature flags**, don’t treat prod as disposable; sensitive areas need policy.

| Step | What to build | Exit criterion |
|------|----------------|----------------|
| **C1** ✅ **Done** | **`docs/factory/FACTORY_MERGE_POLICY.md`** — merge vs PR, **`FACTORY_MONEY_MOVING_PROD`**, deploy/UAT env, preflight skip policy. Linked from **`docs/GOVERNANCE.md`** and **`docs/factory/FACTORY_VERIFY_GATE.md`**. | Autonomous runs follow an explicit, documented policy. |
| **C2** ✅ **Done** | **`docs/factory/DEFINITION_OF_DONE.md`** — DoD bullet for **new user-visible** work: default **`lib/feature-flags.ts`** + **`FF_*`** or explicit waiver; **`FACTORY_MERGE_POLICY.md`** aligns. Research/goal docs point agents at the same bar. | “Ship then toggle” is documented as the default for factory UI. |
| **C3** ✅ **Done** | **`pnpm factory:preflight`** (`scripts/agent-factory/factory-preflight.ts`, **`lib/agent-factory/factory-preflight.ts`**): `git` **`origin`**, merge-strategy env checks, **`gh`** when **`FACTORY_MERGE_STRATEGY=pr`**, deploy URL when **`FACTORY_POST_MERGE_UAT=1`**. **`assertFactoryPreflight(repoRoot)`** runs at the start of **`factory-run-once`** (before claiming work). | Misconfigured workers fail fast instead of burning queue items. |

### Phase D — Environment & harness (medium impact)

Eric: agents must **start the project** and run in **isolation**.

| Step | What to build | Exit criterion |
|------|----------------|----------------|
| **D1** | Harden **`pnpm agent:start`** and **`agents/CURSOR-START.md`**: idempotent boot, health URL, “ready” signal; factory optionally calls this before implement/verify when enabled by env. | A worker can boot and hit the app without a human in the IDE. |
| **D2** | Keep **one worker ↔ one worktree**; document conflict avoidance in `PARALLEL-RUNS.md` / factory docs. | Parallelism does not routinely corrupt goal-aligned branches. |

### Phase E — Learning loop (compounding impact)

Eric: **flywheel** — failures become guardrails; store context.

| Step | What to build | Exit criterion |
|------|----------------|----------------|
| **E1** | **Trajectory log** per `factory-run-once` run: `goal_revision`, item id, verify exits, merge result, path to log under `agents/factory-logs/`. | You can audit *why* the system believed the goal was met. |
| **E2** | On a schedule or after failure streaks: summarize trajectories → propose **`agents/factory-skills/*.md`** entries or **one backlog line** (“add e2e for X”); human merges only. | Repeated false “done” becomes a test or rule, not déjà vu. |

### Phase F — Defer (Eric “scale” layer)

Cursor **cloud agents**, Linear → auto-spawn, computer-use **video** proof, PR-comment mining — high cost until **A** (esp. A2–A4) is trustworthy. **B** and **C** are closed. Revisit Phase F after **A4** (and broader **A2–A3**) exit criteria are green.

---

## Summary: The Roadmap

| Track | Work | Outcome | Effort |
|-------|------|---------|--------|
| **Phases A–E** | Verify (**A1** ✅), traceability (**B** ✅), safe autonomy (**C** ✅), env (**D**), learning (**E**) | Outcomes **true to factory-goal-spec** | **A2–A4**, D–E: see tables |
| **Phase 1** | `pnpm verify`, e2e coverage, screenshot verification | Agents can verify their own UI work | Partially done — `pnpm verify` + factory gate (**A1**); remaining: e2e breadth, screenshots per §1.4 |
| **Phase 2** | Parallel plans, MCP integrations, feature flags, rule extraction | Agents run async, pull their own context, ship safely | 3–5 days |
| **Phase 3** | Outcome review ritual, tribal knowledge doc, weekly cadence | You're managing outcomes, not code | Ongoing habit |
| **Phase 4** | Backlog pipeline, deployment verification, orchestration | Factory runs with minimal human input | Ongoing build |

---

## Where to Start Tomorrow

1. ~~**Phase A1**~~ — **Done** (`factory-run-once` → `pnpm verify`; **`docs/factory/FACTORY_VERIFY_GATE.md`**).
2. **Phase A2–A3** — extend `e2e/` for every route the **current goal** names; keep smoke fast.
3. **Execute Phase A4** — tighten `goal_acceptance` so **`met`** is falsifiable.
4. **Run the current 10 plans** where they still apply after **`pnpm factory:goal-pivot`** and goal revision hygiene.
5. **Wire up the Vercel MCP** in prompts where useful — zero new infra; see Phase 2.2.

The foundation is genuinely strong. The path to factory isn't rebuilding — it's wiring the pieces that already exist into a system that runs without you in the loop **and proves alignment to the stated goal**.
