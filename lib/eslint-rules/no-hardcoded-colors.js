/**
 * ESLint Rule: no-hardcoded-colors
 * Source: docs/DESIGN.md § 2 — Colors & Surface Philosophy
 *
 * Blocks hex color literals (#rrggbb, #rgb) in TSX/TS files.
 * All colors must come from design tokens in /styles/tailwind.css.
 */
const HEX_RE = /^#(?:[0-9a-fA-F]{3}){1,2}$/

// Tokens that are allowed (they're part of the design system, used in config only)
const ALLOWED_FILES = [
  "tailwind.config",
  "tailwind.css",
  "styles/",
  "DESIGN.md",
  "globals.css",
]

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded hex colors; use design tokens instead (docs/DESIGN.md § 2)",
    },
    messages: {
      noHardcodedColor:
        'Hardcoded color "{{color}}" violates docs/DESIGN.md. Use a design token class instead (e.g. text-primary, bg-surface-container-low).',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename()
    if (ALLOWED_FILES.some((f) => filename.includes(f))) return {}

    return {
      Literal(node) {
        if (typeof node.value === "string" && HEX_RE.test(node.value)) {
          context.report({ node, messageId: "noHardcodedColor", data: { color: node.value } })
        }
      },
      TemplateElement(node) {
        const raw = node.value.raw || ""
        const matches = raw.match(/#(?:[0-9a-fA-F]{3}){1,2}/g)
        if (matches) {
          matches.forEach((color) => {
            context.report({ node, messageId: "noHardcodedColor", data: { color } })
          })
        }
      },
    }
  },
}
