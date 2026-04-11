/**
 * Custom ESLint rules enforcing:
 *   - docs/DESIGN.md (Editorial Expert design system)
 *   - docs/code-architecture-review.md (architecture standards)
 *
 * These are REAL rules that block commits. Not documentation.
 */
module.exports = {
  rules: {
    "no-hardcoded-colors": require("./no-hardcoded-colors"),
    "no-1px-borders": require("./no-1px-borders"),
    "enforce-cn-utility": require("./enforce-cn-utility"),
    "component-size-limit": require("./component-size-limit"),
    "no-fetch-in-components": require("./no-fetch-in-components"),
    "api-routes-require-zod": require("./api-routes-require-zod"),
  },
}
