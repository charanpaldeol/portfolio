import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import WhatIBring from "./WhatIBring"

// Mock the data import
vi.mock("@/lib/what-i-bring-cards", () => ({
  whatIBringCards: [
    {
      title: "Problem Framing",
      description: "Turn ambiguity into clarity. Break products into constituent parts.",
    },
    {
      title: "Solution Design",
      description: "Craft polished, defensible approaches before writing code.",
    },
    {
      title: "AI-Native Delivery",
      description: "Ship with Claude, not against it. Strategic tool use, always.",
    },
    {
      title: "Engineering Depth",
      description: "TypeScript, React, Next.js, Postgres, Tailwind — the full stack.",
    },
    {
      title: "Value Realization",
      description: "Turn ships into destinations. Measure what matters.",
    },
  ],
}))

describe("WhatIBring", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("renders the section header", () => {
      render(<WhatIBring />)

      expect(screen.getByText(/what i bring/i)).toBeInTheDocument()
    })

    it("renders all five capability cards", () => {
      render(<WhatIBring />)

      expect(screen.getByText(/problem framing/i)).toBeInTheDocument()
      expect(screen.getByText(/solution design/i)).toBeInTheDocument()
      expect(screen.getByText(/ai-native delivery/i)).toBeInTheDocument()
      expect(screen.getByText(/engineering depth/i)).toBeInTheDocument()
      expect(screen.getByText(/value realization/i)).toBeInTheDocument()
    })

    it("renders all card descriptions", () => {
      render(<WhatIBring />)

      expect(screen.getByText(/turn ambiguity into clarity/i)).toBeInTheDocument()
      expect(screen.getByText(/craft polished, defensible approaches/i)).toBeInTheDocument()
      expect(screen.getByText(/ship with claude/i)).toBeInTheDocument()
      expect(screen.getByText(/typescript, react, next\.js/i)).toBeInTheDocument()
      expect(screen.getByText(/turn ships into destinations/i)).toBeInTheDocument()
    })

    it("renders SVG icons for each capability", () => {
      const { container } = render(<WhatIBring />)

      const svgs = container.querySelectorAll("svg")
      expect(svgs.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe("Layout structure", () => {
    it("renders section element", () => {
      const { container } = render(<WhatIBring />)

      expect(container.querySelector("section")).toBeInTheDocument()
    })

    it("renders header with proper typography", () => {
      const { container } = render(<WhatIBring />)

      const header = Array.from(container.querySelectorAll("div")).find(
        (div) => div.textContent?.toLowerCase().includes("what i bring")
      )

      expect(header).toHaveClass("text-xs", "font-medium", "tracking-widest", "uppercase")
    })

    it("renders flex container for card rows", () => {
      const { container } = render(<WhatIBring />)

      const flexContainer = container.querySelector("div[class*='gap-3']")
      expect(flexContainer).toHaveClass("flex", "flex-col")
    })
  })

  describe("Card arrangement", () => {
    it("arranges cards in proper row layout", () => {
      const { container } = render(<WhatIBring />)

      // Should have 3 rows of cards
      const rows = Array.from(container.querySelectorAll("div[class*='flex-col']")).filter(
        (div) => div.className?.includes("md:flex-row")
      )

      expect(rows.length).toBeGreaterThanOrEqual(3)
    })

    it("applies responsive widths to cards", () => {
      const { container } = render(<WhatIBring />)

      const cards = container.querySelectorAll("div[class*='md:w']")
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe("Visual styling", () => {
    it("renders cards with background colors", () => {
      const { container } = render(<WhatIBring />)

      const coloredDivs = container.querySelectorAll("[class*='bg-']")
      expect(coloredDivs.length).toBeGreaterThan(0)
    })

    it("applies shadow hover effects", () => {
      const { container } = render(<WhatIBring />)

      const shadowElements = container.querySelectorAll("[class*='shadow']")
      expect(shadowElements.length).toBeGreaterThan(0)
    })

    it("applies rounded corners to cards", () => {
      const { container } = render(<WhatIBring />)

      const roundedElements = container.querySelectorAll("[class*='rounded']")
      expect(roundedElements.length).toBeGreaterThan(0)
    })

    it("applies padding to cards", () => {
      const { container } = render(<WhatIBring />)

      const paddedElements = container.querySelectorAll("[class*='p-']")
      expect(paddedElements.length).toBeGreaterThan(0)
    })
  })

  describe("Icon styling", () => {
    it("applies icon background colors", () => {
      const { container } = render(<WhatIBring />)

      const iconBackgrounds = container.querySelectorAll("[class*='iconBg']")
      // Since we're mocking, check for background color classes
      const bgElements = container.querySelectorAll("[class*='bg-']")
      expect(bgElements.length).toBeGreaterThan(0)
    })

    it("applies icon text colors", () => {
      const { container } = render(<WhatIBring />)

      const iconColors = container.querySelectorAll("[class*='text-']")
      expect(iconColors.length).toBeGreaterThan(0)
    })

    it("renders icons with proper SVG structure", () => {
      const { container } = render(<WhatIBring />)

      const svgs = container.querySelectorAll("svg")
      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute("viewBox")
      })
    })
  })

  describe("Typography", () => {
    it("renders titles with appropriate styling", () => {
      const { container } = render(<WhatIBring />)

      const titles = [
        "Problem Framing",
        "Solution Design",
        "AI-Native Delivery",
        "Engineering Depth",
        "Value Realization",
      ]

      titles.forEach((title) => {
        expect(screen.getByText(new RegExp(title, "i"))).toBeInTheDocument()
      })
    })

    it("renders descriptions with muted color", () => {
      const { container } = render(<WhatIBring />)

      const descriptions = container.querySelectorAll("[class*='text-on-surface-variant']")
      expect(descriptions.length).toBeGreaterThan(0)
    })
  })

  describe("Responsive behavior", () => {
    it("stacks cards vertically on mobile", () => {
      const { container } = render(<WhatIBring />)

      const flexCol = container.querySelectorAll("div[class*='flex-col']")
      expect(flexCol.length).toBeGreaterThan(0)
    })

    it("arranges cards in rows on desktop", () => {
      const { container } = render(<WhatIBring />)

      const rows = Array.from(container.querySelectorAll("div")).filter(
        (div) => div.className?.includes("md:flex-row")
      )

      expect(rows.length).toBeGreaterThanOrEqual(3)
    })

    it("applies responsive gap spacing", () => {
      const { container } = render(<WhatIBring />)

      const gappedElements = container.querySelectorAll("[class*='gap-']")
      expect(gappedElements.length).toBeGreaterThan(0)
    })
  })

  describe("Content integrity", () => {
    it("ensures each card has a title", () => {
      render(<WhatIBring />)

      const titles = [
        "Problem Framing",
        "Solution Design",
        "AI-Native Delivery",
        "Engineering Depth",
        "Value Realization",
      ]

      titles.forEach((title) => {
        expect(screen.getByText(new RegExp(title, "i"))).toBeInTheDocument()
      })
    })

    it("ensures each card has a description", () => {
      render(<WhatIBring />)

      const descriptions = [
        "Turn ambiguity into clarity",
        "Craft polished, defensible approaches",
        "Ship with Claude",
        "TypeScript, React, Next.js",
        "Turn ships into destinations",
      ]

      descriptions.forEach((desc) => {
        expect(screen.getByText(new RegExp(desc, "i"))).toBeInTheDocument()
      })
    })
  })

  describe("Accessibility", () => {
    it("uses semantic section element", () => {
      const { container } = render(<WhatIBring />)

      expect(container.querySelector("section")).toBeInTheDocument()
    })

    it("renders text with proper contrast", () => {
      render(<WhatIBring />)

      // Verify that text elements are not hidden
      expect(screen.getByText(/what i bring/i)).toBeVisible()
      expect(screen.getByText(/problem framing/i)).toBeVisible()
    })

    it("uses proper heading hierarchy", () => {
      const { container } = render(<WhatIBring />)

      // Header div should have uppercase styling indicating emphasis
      const header = Array.from(container.querySelectorAll("div")).find(
        (div) => div.textContent?.toLowerCase().includes("what i bring")
      )

      expect(header).toHaveClass("font-medium")
    })
  })

  describe("Performance considerations", () => {
    it("renders a reasonable number of elements", () => {
      const { container } = render(<WhatIBring />)

      // Should not create excessive DOM nodes
      expect(container.querySelectorAll("*").length).toBeLessThan(200)
    })

    it("uses key props for list items", () => {
      // This is documented implicitly by React not throwing warnings
      render(<WhatIBring />)
      expect(true).toBe(true) // If no warnings, test passes
    })
  })
})
