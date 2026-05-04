import { describe, expect, it } from "vitest"

import {
  hasMeaningfulShippingPath,
  isNonShippingPath,
  onlyNonShippingChanges,
} from "./require-diff-guards"

describe("require-diff-guards", () => {
  it("treats .gitignore and agents/ as non-shipping", () => {
    expect(isNonShippingPath(".gitignore")).toBe(true)
    expect(isNonShippingPath("agents/factory-queue.json")).toBe(true)
    expect(isNonShippingPath("docs/foo.md")).toBe(true)
    expect(isNonShippingPath("app/page.tsx")).toBe(false)
  })

  it("onlyNonShippingChanges", () => {
    expect(onlyNonShippingChanges([".gitignore"])).toBe(true)
    expect(onlyNonShippingChanges([".gitignore", "agents/x.json"])).toBe(true)
    expect(onlyNonShippingChanges(["app/a.tsx", ".gitignore"])).toBe(false)
    expect(onlyNonShippingChanges([])).toBe(false)
  })

  it("hasMeaningfulShippingPath uses default prefixes", () => {
    const prefixes = ["app/", "components/", "lib/", "config/", "scripts/", "e2e/", "public/"] as const
    expect(hasMeaningfulShippingPath(["app/calculator/page.tsx"], prefixes)).toBe(true)
    expect(hasMeaningfulShippingPath(["lib/foo.ts"], prefixes)).toBe(true)
    expect(hasMeaningfulShippingPath(["scripts/agent-factory/x.ts"], prefixes)).toBe(true)
    expect(hasMeaningfulShippingPath(["e2e/smoke.spec.ts"], prefixes)).toBe(true)
    expect(hasMeaningfulShippingPath(["public/icon.png"], prefixes)).toBe(true)
    expect(hasMeaningfulShippingPath([".gitignore"], prefixes)).toBe(false)
    expect(hasMeaningfulShippingPath(["middleware.ts"], prefixes)).toBe(false)
    expect(hasMeaningfulShippingPath(["next.config.ts"], prefixes)).toBe(false)
  })

  it("hasMeaningfulShippingPath allows extra exact file roots", () => {
    expect(hasMeaningfulShippingPath(["middleware.ts"], ["middleware.ts/"])).toBe(true)
    expect(hasMeaningfulShippingPath(["src/x.ts"], ["middleware.ts/"])).toBe(false)
  })
})
