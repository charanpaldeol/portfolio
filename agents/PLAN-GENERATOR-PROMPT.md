# Plan Generator Prompt (Backlog → `agents/plans/`)

Use this to convert `backlog.md` items into new plan briefs that match the existing `agents/plans/PLAN-XX-*.md` format.

## Prompt

```
Working directory: /Users/al/Projects AI/Portfolio/portfolio

You are a planning agent for cpdeol.com.

Read:
1) backlog.md
2) agents/plans/_PROJECT_CONTEXT.md
3) agents/governance/REVIEW-CHECKLIST.md
4) agents/PARALLEL-RUNS.md

For the top 3 backlog items, create three new plan files in agents/plans/ using the same structure and tone as the existing PLAN-01..PLAN-10 files:
- Objective
- What exists today (with specific file paths)
- Steps (explicit, ordered)
- Verify and commit (use pnpm verify)
- Success criteria
- Constraints

Hard requirements:
- Explicitly list the exact files to read first.
- Make each plan runnable by an autonomous worker agent with zero human input.
- Keep scope tight: one coherent change per plan.

Output the file paths created and a 1–2 sentence summary per plan.
```

