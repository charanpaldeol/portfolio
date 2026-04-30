import { describe, expect, it } from "vitest"

import { evaluateFactoryGoalStatus, parseGoalAcceptanceCommands } from "./goal-spec"

describe("parseGoalAcceptanceCommands", () => {
  it("flattens string and arrays", () => {
    expect(
      parseGoalAcceptanceCommands({
        version: 1,
        statement: "x",
        goal_acceptance: ["pnpm -s tsc", " true "],
        roadmap_items: [],
      }),
    ).toEqual(["pnpm -s tsc", "true"])
  })
})

describe("evaluateFactoryGoalStatus", () => {
  it("blocked when any linked item failed", () => {
    const r = evaluateFactoryGoalStatus({
      statement: "Ship feature",
      roadmapItemIds: ["A", "B"],
      queue: {
        byId: new Map([
          ["A", { status: "done" }],
          ["B", { status: "failed" }],
        ]),
      },
    })
    expect(r.status).toBe("blocked")
  })

  it("met when all done", () => {
    const r = evaluateFactoryGoalStatus({
      statement: "Ship feature",
      roadmapItemIds: ["A"],
      queue: { byId: new Map([["A", { status: "done" }]]) },
    })
    expect(r.status).toBe("met")
  })

  it("active when roadmap item not in queue", () => {
    const r = evaluateFactoryGoalStatus({
      statement: "Ship feature",
      roadmapItemIds: ["A", "B"],
      queue: { byId: new Map([["A", { status: "done" }]]) },
    })
    expect(r.status).toBe("active")
  })
})
