/**
 * ESLint Rule: component-size-limit
 * Source: docs/code-architecture-review.md § 2.2
 *
 * Components in /components/ must be ≤ 300 lines.
 * If over limit, split into sub-components.
 *
 * Navbar was refactored from 391 → 120 lines as the reference pattern.
 */
const MAX_LINES = 300

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce max " + MAX_LINES + " lines per component (code-architecture-review.md § 2.2)",
    },
    messages: {
      tooLarge:
        "Component is {{lines}} lines (max {{max}}). Split into sub-components per code-architecture-review.md § 2.2. Reference: Navbar refactor (391 → 120 lines).",
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename()
    if (!filename.includes("/components/")) return {}

    return {
      Program(node) {
        const lines = node.loc.end.line
        if (lines > MAX_LINES) {
          context.report({
            node,
            messageId: "tooLarge",
            data: { lines: String(lines), max: String(MAX_LINES) },
          })
        }
      },
    }
  },
}
