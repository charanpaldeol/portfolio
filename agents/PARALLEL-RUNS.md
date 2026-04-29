# Parallel Runs — Safe Concurrency Map (cpdeol.com)

This file documents which plan briefs can be executed at the same time without stepping on the same files.

## Default rule

- One plan = one isolated branch (or git worktree) if you are running more than 1 worker at once.
- Avoid running two workers that touch the same “chokepoint” files (common examples: `config/navigation.tsx`, blog routing files, global layout).

## Known chokepoints (high conflict risk)

- `config/navigation.tsx` (multiple plans add nav links)
- `app/blog/[slug]/page.tsx` and `app/blog/page.tsx` (blog infra)
- `components/layout/*` (site-wide shell)

## Safe parallel batches (from `_LAUNCH.md`)

### Batch A (fully parallel, minimal conflicts)

- PLAN-01
- PLAN-02
- PLAN-04
- PLAN-06
- PLAN-08
- PLAN-09

### Batch B (run after Batch A is merged)

- PLAN-03 (touches `config/navigation.tsx`)
- PLAN-05 (touches `config/navigation.tsx`)
- PLAN-07 (touches blog + footer)
- PLAN-10 (touches blog routing)

## When in doubt

- Prefer **sequencing** over fighting merge conflicts.
- If two plans overlap, split them by file ownership (or run the higher-risk plan last).

