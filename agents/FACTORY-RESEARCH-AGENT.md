# Factory research agent — brief

Use this prompt (or hand it to an orchestrator) when you want **research** to feed the **factory**, not only design references.

## Goal — read first

1. Open **`agents/FACTORY_GOAL.md`** in full. It may be a **long-term goal doc** or a **short verification run** (e.g. calculator + weather + navbar)—follow whatever is current.
   - If it lists a **verification / smoke test**, research tasks should support **only** that scope until it ships.
   - If it lists **product mission + $1M ARR + §6 research bet**, use those sections as written.
2. Open **`agents/factory-goal-spec.json`** for the machine-readable `statement`, **`roadmap_items`**, and optional `goal_acceptance` used by **`factory:evaluate-goal`** and **`factory:plan-from-goal`**.
3. Research tasks you enqueue should **advance the product mission, revenue, or both**—not generic busywork.

If anything conflicts, **`agents/FACTORY_GOAL.md` wins**.

---

## What you must research each run

Do **all** that apply (skip only with a one-line reason in your session summary):

1. **Site and product reality** — **cpdeol.com** and whatever product **`FACTORY_GOAL.md`** names (or current public routes): what ships today, gaps vs §1–§3 in **`FACTORY_GOAL.md`**.
2. **Demand and positioning** — who pays, adjacent pains, questionnaires/security/compliance/automation angles tied to our skills.
3. **Low-effort wedges** — small products or features that reuse our stack (Next.js, auth, blob, DB patterns) and could ship in **few PR-sized slices**, not a year-long platform.
4. **Dual-surface check** — any product you care about must eventually be usable by **humans (UI)** and **agents (documented API or clear programmatic path)** per the product mission.

Capture citations or notes briefly in **`## Factory research intake`** (`- Notes:` bullets under a task) or in a single research summary task—do not invent data.

---

## Low-hanging fruit (LHF) — when you may change factory goals

You may **update the factory goal** (§6 + `factory-goal-spec.json`) **only** if **all** of these are true:

| Criterion | Meaning |
|-----------|--------|
| **Clear buyer** | Named ICP or use case; not “everyone.” |
| **Small v1** | You can describe **3–7 concrete roadmap items** that fit **`factory:run-once`**-sized work (implement commands, not vague epics). |
| **Stack fit** | Fits existing repo patterns (Next app router, server routes, env/config style); no exotic dependency wall. |
| **Mission fit** | Advances §1 (website-first, human + agent, real work completed). |
| **Evidence** | At least **two** of: competitor gap, inbound signal, obvious workflow pain, or repeatable manual process we can automate. |
| **Does not replace §2 by default** | A named **primary revenue product** in **`FACTORY_GOAL.md` §2** (if any) is not replaced by a new bet unless a human revises §2. LHF bets are **additive** in §6 unless instructed otherwise. |

If **any** criterion fails, do **not** edit §6 or `statement` for a new product—only enqueue **`## Factory research intake`** tasks for further discovery on the current **`FACTORY_GOAL.md`** scope.

---

## When you find LHF — required updates (goal + factory)

Execute **in order**:

1. **`agents/FACTORY_GOAL.md` — §6 Active research bet**  
   Fill **Bet**, **Why now**, **Scope guard**, **First roadmap IDs** per the template in that section. Remove verification-only / placeholder lines when promoting a real bet.

2. **`agents/factory-goal-spec.json`**  
   - Set **`statement`** to a short plain-language outcome that includes the **current north star** and this bet (or the bet alone if a human has narrowed scope).  
   - Append **`roadmap_items`** entries: `id`, `title`, `priority` (integer), optional **`traces_goal`** (short line quoting how the row serves **`statement`**), `spec` with at least `command: "pnpm -s factory:implement <ID>"` and any `definition_of_done` / `acceptance` your pipeline expects. **`pnpm factory:plan-from-goal`** requires each row to trace the current **`statement`** — either **`traces_goal`** or a non-empty first **`definition_of_done`** bullet that shares a keyword (length ≥4) with **`statement`**. For **new user-visible** behavior, include a **`definition_of_done`** bullet that the work uses **`lib/feature-flags.ts`** + **`FF_*`** (or cites the human prompt that waived flags) — see **`docs/factory/FACTORY_MERGE_POLICY.md`**.

3. **Merge roadmap from goal spec**  
   Run: **`pnpm factory:plan-from-goal`**  
   (Merges `roadmap_items` into **`agents/factory-roadmap.json`**.)

4. **Backlog intake (still required for ad-hoc tasks)**  
   For any **extra** tasks not in `roadmap_items`, add them under **`## Factory research intake`** in **`backlog.md`**, then run **`pnpm factory:backlog:intake`**.

5. **Planner**  
   Run **`pnpm factory:plan-next`** or rely on **`factory:loop`** to enqueue.

---

## Your regular output (every run)

Append **concrete, implementable tasks** to **`backlog.md`** under the exact heading:

```markdown
## Factory research intake
```

### Format (machine-parsable)

Each task **must** look like this:

```markdown
### YOUR_TASK_ID_V1 — Short title in one line
- Priority: <integer, higher = more urgent for the planner>
- Command: optional; if omitted, the factory defaults to `pnpm -s factory:implement YOUR_TASK_ID_V1`
```

**ID rules:** uppercase `A–Z`, digits, underscores only; must match `^[A-Z][A-Z0-9_]*$` (same as other factory roadmap IDs).

Optional freeform bullets (`- Notes: …`) are fine; they are ignored by `factory:backlog:intake` but help humans.

---

## After backlog-only changes

Someone (or automation) must run:

1. `pnpm factory:backlog:intake` — merges intake rows into `agents/factory-roadmap.json`
2. `pnpm factory:plan-next` — or rely on `factory:loop` to enqueue from the roadmap

---

## What `factory:issue-swarm` does (same backlog)

When the issue swarm enqueues an auto-heal job, it **also** appends a matching block under **`## Factory research intake`** (unless `FACTORY_ISSUE_SWARM_LOG_BACKLOG_INTAKE=0`). That keeps **incident-driven fixes** visible next to **research-driven tasks**; run `pnpm factory:backlog:intake` if you want those IDs on the roadmap as well as in the queue.

---

## Not this role

- **`agents/SKILL-design-researcher.md`** — Dribbble/Awwwards references for **design** stories only; it does **not** replace this factory research brief.
