/**
 * ESLint Rule: api-routes-require-zod
 * Source: docs/code-architecture-review.md § 1.1
 *
 * Every API route under /app/api/ must import from 'zod' and use schema validation.
 * This was a critical security fix — legacy code used unsafe type coercion.
 */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "All API routes must validate input with Zod (code-architecture-review.md § 1.1)",
    },
    messages: {
      missingZod:
        "API route is missing Zod validation. Import from 'zod' and validate all input with z.object().safeParse(). See code-architecture-review.md § 1.1.",
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename()
    if (!filename.includes("/app/api/") || !filename.endsWith("route.ts")) return {}

    let hasZodImport = false

    return {
      ImportDeclaration(node) {
        if (node.source.value === "zod") {
          hasZodImport = true
        }
      },
      "Program:exit"(node) {
        if (!hasZodImport) {
          context.report({ node, messageId: "missingZod" })
        }
      },
    }
  },
}
