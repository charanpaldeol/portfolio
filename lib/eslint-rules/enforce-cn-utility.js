/**
 * ESLint Rule: enforce-cn-utility
 * Source: docs/code-architecture-review.md § 6.2
 *
 * All class construction must use cn() from @/lib/utils.
 * Blocks: twMerge(), clsx(), classnames(), .join(' ') for classes,
 *         and template literals in className.
 */
const BANNED_FUNCTIONS = ["twMerge", "clsx", "classnames", "classNames"]

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce cn() utility for all class construction (code-architecture-review.md § 6.2)",
    },
    messages: {
      useCn: 'Use cn() from @/lib/utils instead of {{fn}}(). All class construction must use cn() for consistency.',
      noTemplateLiteralClassName:
        "Use cn() instead of template literals for className. Example: cn('flex', condition && 'text-primary')",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const name = node.callee.name || (node.callee.property && node.callee.property.name)
        if (BANNED_FUNCTIONS.includes(name)) {
          context.report({ node, messageId: "useCn", data: { fn: name } })
        }
      },

      // Catch className={`flex ${dynamic}`}
      JSXAttribute(node) {
        if (node.name.name !== "className") return
        if (
          node.value &&
          node.value.type === "JSXExpressionContainer" &&
          node.value.expression.type === "TemplateLiteral" &&
          node.value.expression.expressions.length > 0
        ) {
          context.report({ node: node.value, messageId: "noTemplateLiteralClassName" })
        }
      },
    }
  },
}
