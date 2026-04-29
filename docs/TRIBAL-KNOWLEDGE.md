# Tribal Knowledge (Why things are the way they are)

This document captures the non-obvious reasoning behind a few “house rules” so new agents (and future-you) do not accidentally optimize the wrong thing.

## Layout is intentionally boring (and stable)

The site uses a single, consistent shell stack across routes. Breaking the shell breaks everything:
- Navigation consistency
- Spacing rhythm
- Editorial surface + card container behavior

That is why the “layout” files are treated as frozen by default.

## Copy is sacred (brand > polish)

This is a portfolio and a funnel. Copy changes are not “refactors” — they change positioning.
Agents should never rewrite headings, claims, metrics, or CTAs unless the prompt provides exact replacement text.

## Design system enforcement is a factory enabler

Hard rules like “no hex colors” and “no 1px borders” exist because:
- They keep the visual language coherent across many small, parallel edits.
- They are machine-checkable (ESLint + `scripts/audit.js`), which makes agent output verifiable.

## Tests are proof artifacts, not just regression checks

Playwright is used for:
- Fast smoke validation (`pnpm e2e:smoke`)
- Visual proof generation (screenshots under `agents/governance/screenshots/[PLAN_ID]/`)

The goal is to review outcomes quickly without reading diffs.

