import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import WhatIBring from "./WhatIBring"

// Mock the data import
vi.mock("@/lib/what-i-bring-cards", () => ({
  whatIBringCards: [
    {
      slug: "problem-framing",
      badge: "Discovery",
      badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
      title: "Problem Framing",
      body: "Turn ambiguity into clarity. Break products into constituent parts.",
      sections: [],
    },
    {
      slug: "solution-design",
      badge: "Design",
      badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
      title: "Solution Design",
      body: "Craft polished, defensible approaches before writing code.",
      sections: [],
    },
    {
      slug: "ai-native-delivery",
      badge: "Delivery",
      badgeClass: "bg-primary-fixed text-on-primary-fixed",
      title: "AI-Native Delivery",
      body: "Ship with Claude, not against it. Strategic tool use, always.",
      sections: [],
    },
    {
      slug: "engineering-depth",
      badge: "Engineering",
      badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
      title: "Engineering Depth",
      body: "TypeScript, React, Next.js, Postgres, Tailwind — the full stack.",
      sections: [],
    },
    {
      slug: "value-realization",
      badge: "Adoption",
      badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
      title: "Value Realization",
      body: "Turn ships into destinations. Measure what matters.",
      sections: [],
    },
  ],
}))

describe("WhatIBring", () => {
  it("renders the section shell", () => {
    const { container } = render(<WhatIBring />)
    expect(container.querySelector("section#what-i-bring")).toBeInTheDocument()
    expect(screen.getByText(/what i bring/i)).toBeInTheDocument()
  })

  it("renders exactly five link cards", () => {
    render(<WhatIBring />)
    const cards = screen.getAllByRole("link", { name: /^read:/i })
    expect(cards).toHaveLength(5)
  })

  it("renders each card title as an accessible link name", () => {
    render(<WhatIBring />)
    expect(screen.getByRole("link", { name: /read: problem framing/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /read: solution design/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /read: ai-native delivery/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /read: engineering depth/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /read: value realization/i })).toBeInTheDocument()
  })

  it("renders at least one SVG icon per card", () => {
    const { container } = render(<WhatIBring />)
    const cards = container.querySelectorAll("a[aria-label^='Read:']")
    expect(cards.length).toBe(5)
    for (const card of Array.from(cards)) {
      expect(card.querySelector("svg")).toBeTruthy()
    }
  })
})
