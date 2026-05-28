# Design system enforcement

Applies when editing `app/**` or `components/**` source files.

## Tokens (never hardcode)

- Do: `import { DS } from '@/design-system'` and use DS tokens for UI styling.
- Do not introduce:
  - hardcoded hex colors (e.g. `#EEEDFE`)
  - inline styles with literal colors
  - Tailwind color names as substitutes for tokens

## Animation library (opt-in only)

- Never auto-import these components; only use them when explicitly requested:
  - `components/magicui/animated-gradient-text.tsx`
  - `components/magicui/blur-fade.tsx`
  - `components/magicui/marquee.tsx`
  - `components/magicui/number-ticker.tsx`
  - `components/magicui/shimmer-button.tsx`
