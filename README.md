# portfolio

Personal portfolio — cpdeol.com

## Standards

| Document | What It Covers |
|----------|---------------|
| `docs/DESIGN.md` | Editorial Expert design system |
| `docs/code-architecture-review.md` | Architecture grades + action items |
| `docs/GOVERNANCE.md` | Enforcement rules + AI-agent development |
| `.cursorrules` § 8 | AI-agent rules (read automatically) |

## Enforcement

Rules are enforced by code, not documentation:

- **ESLint rules** — `lib/eslint-rules/` (6 custom rules)
- **Audit script** — `node scripts/audit.js` (design + architecture scanner)
- **Pre-commit hook** — `.husky/pre-commit` (blocks bad commits)

Run `node scripts/audit.js` to check compliance.

## Data Architecture

All feature data lives in `/lib/[feature]-data.ts`. Components accept props, never fetch.
