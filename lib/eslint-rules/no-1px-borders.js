/**
 * ESLint Rule: no-1px-borders
 * Source: docs/DESIGN.md § 2 — The "No-Line" Rule
 *
 * "Designers are prohibited from using 1px solid borders for sectioning
 *  or layout containment." Use surface-container color shifts instead.
 *
 * Catches: className="border", style={{ border: '1px ...' }},
 *          and Tailwind border-* utility classes used for visible lines.
 */
const BORDER_CLASSES = /\bborder\b(?!-radius|-collapse|-spacing|-separate|-none)/
const INLINE_BORDER = /1px\s+solid/

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: 'Disallow visible 1px borders; use surface color shifts (docs/DESIGN.md § 2 "No-Line" Rule)',
    },
    messages: {
      noBorder:
        'Visible border violates docs/DESIGN.md "No-Line" Rule. Use background color shifts (bg-surface-container-low on bg-surface) instead of borders for layout containment.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename()
    // Only check component/page files
    if (!filename.match(/\.(tsx|jsx)$/)) return {}

    return {
      // Catch className="border ..." or cn('border', ...)
      Literal(node) {
        if (typeof node.value !== "string") return

        // Catch inline style borders
        if (INLINE_BORDER.test(node.value)) {
          context.report({ node, messageId: "noBorder" })
          return
        }
      },

      // Catch JSX className with border utilities
      JSXAttribute(node) {
        if (node.name.name !== "className") return
        if (!node.value) return

        // String literal className
        if (node.value.type === "Literal" && typeof node.value.value === "string") {
          if (BORDER_CLASSES.test(node.value.value)) {
            context.report({ node: node.value, messageId: "noBorder" })
          }
        }
      },
    }
  },
}
