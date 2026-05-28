# Portfolio — Claude Code instructions

cpdeol.com Next.js portfolio. Read `.claude/rules/` for scoped policy; use `.claude/skills/` for workflows.

## Architecture

Single layout stack: `app/layout.tsx` → `GlobalChrome` → `PortfolioShell` → page content. Homepage sections: `components/home/*`.

## Always apply

- Only edit files named in the task; no drive-by refactors.
- Do not change copy unless exact replacement text is provided.
- Before commit: `pnpm tsc --noEmit`, `pnpm lint`, `node scripts/audit.js` (or `pnpm verify`).
- Feature data in `/lib/[feature]-data.ts`; components receive props (no fetch in `/components`).
- New UI behind `lib/feature-flags.ts` when appropriate.

## Agent layout

| Path | Purpose |
|------|---------|
| `.claude/rules/` | Project rules (markdown) |
| `.claude/skills/` | Skills (`SKILL.md` per folder) |
| `.claude/agents/` | Subagent prompts |
| `.claude/hooks/` | Shell hooks (optional / IDE-specific) |

See `docs/GOVERNANCE.md`, `docs/DESIGN.md`, `docs/code-architecture-review.md`.
