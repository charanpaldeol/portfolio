/**
 * ESLint Rule: no-fetch-in-components
 * Source: docs/code-architecture-review.md § 2.5 (Separation of Concerns)
 *         + AI-agent governance (props-based components)
 *
 * Components must receive data as props; they must not fetch their own data.
 * Fetch/query calls belong in page-level server components or /lib/ helpers.
 */
const BANNED_CALLS = ["fetch", "axios", "useQuery", "useSWR"]

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Components must accept data as props, not fetch internally (code-architecture-review.md § 2.5)",
    },
    messages: {
      noFetchInComponent:
        "{{fn}}() in a component violates separation of concerns. Pass data as props from a parent page/layout instead.",
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename()
    if (!filename.includes("/components/")) return {}

    return {
      CallExpression(node) {
        const name = node.callee.name || (node.callee.property && node.callee.property.name)
        if (name && BANNED_CALLS.includes(name)) {
          context.report({ node, messageId: "noFetchInComponent", data: { fn: name } })
        }
      },
    }
  },
}
