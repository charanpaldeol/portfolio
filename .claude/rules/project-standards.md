# Project standards (always apply)

## Scope discipline

- Only change files explicitly listed under “Files to edit” in the prompt.
- If a required change touches a frozen file, stop and ask for explicit approval.

## Copy discipline

- Do not rephrase, rewrite, shorten, or “improve” any copy unless exact replacement text is provided.

## Verification bar (before committing)

- Run `pnpm verify` and ensure it passes (see CLAUDE.md → Verify for what it covers).

## Agent-safe development defaults

- Prefer shipping new user-visible features behind a server-side flag (see `lib/feature-flags.ts`).
- All feature data should live in `/lib/[feature]-data.ts` and be passed into components as props (components should not fetch internally).
