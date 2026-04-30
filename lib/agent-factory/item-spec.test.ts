import { describe, expect, it } from "vitest"

import { parseFactoryItemSpec } from "./item-spec"

describe("parseFactoryItemSpec", () => {
  it("parses command, acceptance array, require_diff", () => {
    expect(
      parseFactoryItemSpec({
        command: " echo ok ",
        acceptance: ["pnpm -s tsc", "  true  "],
        require_diff: true,
      }),
    ).toEqual({
      command: "echo ok",
      acceptanceCommands: ["pnpm -s tsc", "true"],
      requireDiff: true,
    })
  })

  it("parses string acceptance", () => {
    expect(parseFactoryItemSpec({ acceptance: "pnpm -s vitest --run lib/foo.test.ts" })).toEqual({
      command: null,
      acceptanceCommands: ["pnpm -s vitest --run lib/foo.test.ts"],
      requireDiff: false,
    })
  })

  it("returns empty for non-object", () => {
    expect(parseFactoryItemSpec(null)).toEqual({
      command: null,
      acceptanceCommands: [],
      requireDiff: false,
    })
  })
})
