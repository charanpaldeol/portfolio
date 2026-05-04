import { describe, expect, it } from "vitest"

import { isExplicitResearchDone, parseResearchBlocksFromLlm } from "@/lib/agent-factory/research-goal-llm"

describe("isExplicitResearchDone", () => {
  it("detects sentinel", () => {
    expect(isExplicitResearchDone("FACTORY_RESEARCH_DONE")).toBe(true)
    expect(isExplicitResearchDone("\nFACTORY_RESEARCH_DONE\n")).toBe(true)
  })

  it("false for tasks", () => {
    expect(isExplicitResearchDone("### CHAT_V1 — Build\n- Priority: 800\n- Command: pnpm x")).toBe(false)
  })
})

describe("parseResearchBlocksFromLlm", () => {
  it("parses blocks and skips duplicates", () => {
    const existing = new Set<string>(["OLD_V1"])
    const md = [
      "### CHAT_UI_V1 — Minimal chat layout",
      "- Priority: 820",
      "- Command: pnpm -s factory:implement CHAT_UI_V1",
      "### OLD_V1 — Skip me",
      "- Priority: 800",
      "- Command: pnpm -s factory:implement OLD_V1",
    ].join("\n")
    const warns: string[] = []
    const out = parseResearchBlocksFromLlm(md, existing, (m) => warns.push(m))
    expect(out.blocks.map((b) => b.id)).toEqual(["CHAT_UI_V1"])
    expect(out.duplicateSkips).toBe(1)
    expect(out.invalidSkips).toBe(0)
    expect(warns.some((w) => w.includes("OLD_V1"))).toBe(true)
  })
})
