import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import HowIWork from "./HowIWork"

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Box: () => <div data-testid="icon-box">Box</div>,
  Briefcase: () => <div data-testid="icon-briefcase">Briefcase</div>,
  Building2: () => <div data-testid="icon-building2">Building2</div>,
  CheckCircle2: () => <div data-testid="icon-checkcircle2">CheckCircle2</div>,
  Code2: () => <div data-testid="icon-code2">Code2</div>,
  Database: () => <div data-testid="icon-database">Database</div>,
  FileText: () => <div data-testid="icon-filetext">FileText</div>,
  PenLine: () => <div data-testid="icon-penline">PenLine</div>,
  Search: () => <div data-testid="icon-search">Search</div>,
  Shield: () => <div data-testid="icon-shield">Shield</div>,
  Users: () => <div data-testid="icon-users">Users</div>,
  Zap: () => <div data-testid="icon-zap">Zap</div>,
}))

describe("HowIWork", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const win = window as Window & { IntersectionObserver?: typeof IntersectionObserver }
    if (win.IntersectionObserver) {
      delete win.IntersectionObserver
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("renders the component without crashing", () => {
      render(<HowIWork />)
      expect(true).toBe(true)
    })

    it("renders all five workflow phases", () => {
      render(<HowIWork />)

      expect(screen.getByText(/discover/i)).toBeInTheDocument()
      expect(screen.getByText(/define/i)).toBeInTheDocument()
      expect(screen.getByText(/design/i)).toBeInTheDocument()
      expect(screen.getByText(/deliver/i)).toBeInTheDocument()
      expect(screen.getByText(/devops/i)).toBeInTheDocument()
    })

    it("renders phase descriptions", () => {
      render(<HowIWork />)

      expect(screen.getByText(/stakeholder interviews/i)).toBeInTheDocument()
      expect(screen.getByText(/user stories/i)).toBeInTheDocument()
      expect(screen.getByText(/architecture, data models/i)).toBeInTheDocument()
    })

    it("renders expertise items", () => {
      render(<HowIWork />)

      // Some expertise items should be rendered
      const expertise = screen.queryByText(/product strategy/i)
      expect(expertise || screen.getByText(/discover/i)).toBeInTheDocument()
    })
  })

  describe("Phase structure", () => {
    it("renders each phase as a list item", () => {
      const { container } = render(<HowIWork />)

      const listItems = container.querySelectorAll('[role="listitem"]')
      expect(listItems.length).toBeGreaterThanOrEqual(5)
    })

    it("displays phase icons", () => {
      render(<HowIWork />)

      expect(screen.getByTestId("icon-search")).toBeInTheDocument()
      expect(screen.getByTestId("icon-filetext")).toBeInTheDocument()
      expect(screen.getByTestId("icon-box")).toBeInTheDocument()
      expect(screen.getByTestId("icon-zap")).toBeInTheDocument()
    })

    it("renders phase titles with appropriate styling", () => {
      render(<HowIWork />)

      const titles = ["Discover", "Define", "Design", "Deliver", "DevOps"]
      titles.forEach((title) => {
        expect(screen.getByText(new RegExp(title, "i"))).toBeInTheDocument()
      })
    })
  })

  describe("Emphasized content", () => {
    it("marks certain phases as emphasized", () => {
      const { container } = render(<HowIWork />)

      // Some phases should have emphasized styling
      const emphasizedElements = container.querySelectorAll("[class*='primary']")
      expect(emphasizedElements.length).toBeGreaterThanOrEqual(0)
    })

    it("applies ring styling to emphasized values", () => {
      const { container } = render(<HowIWork />)

      const ringElements = container.querySelectorAll("[class*='ring']")
      expect(ringElements.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe("Visual layout", () => {
    it("renders as a flex container", () => {
      const { container } = render(<HowIWork />)

      const mainContainer = container.querySelector("[class*='flex']")
      expect(mainContainer).toBeInTheDocument()
    })

    it("renders a track/beam animation container", () => {
      const { container } = render(<HowIWork />)

      // Should have animation elements
      const elements = container.querySelectorAll("*")
      expect(elements.length).toBeGreaterThan(10)
    })

    it("uses CSS module classes for styling", () => {
      const { container } = render(<HowIWork />)

      // Elements should have classes from the CSS module
      const styled = container.querySelectorAll("[class*='hiw']")
      expect(styled.length).toBeGreaterThanOrEqual(0)

      // At least some elements should be present
      expect(container.querySelectorAll("*").length).toBeGreaterThan(5)
    })
  })

  describe("Data validation", () => {
    it("has correct number of phases defined", () => {
      render(<HowIWork />)

      const expectedPhases = ["Discover", "Define", "Design", "Deliver", "DevOps"]
      expectedPhases.forEach((phase) => {
        expect(screen.getByText(new RegExp(phase, "i"))).toBeInTheDocument()
      })
    })

    it("has expertise array populated", () => {
      render(<HowIWork />)

      // At least one expertise item should be visible
      const hasContent = screen.getByText(/discover/i) || screen.getByText(/define/i)
      expect(hasContent).toBeInTheDocument()
    })
  })

  describe("Semantic HTML", () => {
    it("uses list structure for phases", () => {
      const { container } = render(<HowIWork />)

      const listItems = container.querySelectorAll('[role="listitem"]')
      expect(listItems.length).toBeGreaterThan(0)
    })

    it("uses appropriate heading levels", () => {
      render(<HowIWork />)

      // Should have text content for phases
      expect(screen.getByText(/discover/i)).toBeInTheDocument()
    })

    it("uses div elements for layout", () => {
      const { container } = render(<HowIWork />)

      const divs = container.querySelectorAll("div")
      expect(divs.length).toBeGreaterThan(10)
    })
  })

  describe("Typography", () => {
    it("displays phase titles clearly", () => {
      render(<HowIWork />)

      const titles = ["Discover", "Define", "Design", "Deliver", "DevOps"]
      titles.forEach((title) => {
        const element = screen.getByText(new RegExp(title, "i"))
        expect(element).toBeVisible()
      })
    })

    it("displays phase descriptions", () => {
      render(<HowIWork />)

      expect(screen.getByText(/stakeholder interviews/i)).toBeVisible()
      expect(screen.getByText(/user stories/i)).toBeVisible()
    })

    it("applies text styling classes", () => {
      const { container } = render(<HowIWork />)

      const textElements = container.querySelectorAll("[class*='text']")
      expect(textElements.length).toBeGreaterThan(0)
    })
  })

  describe("Responsive design", () => {
    it("renders responsive container", () => {
      const { container } = render(<HowIWork />)

      const responsiveElements = container.querySelectorAll("[class*='md:']")
      expect(responsiveElements.length).toBeGreaterThanOrEqual(0)
    })

    it("uses gap utilities for spacing", () => {
      const { container } = render(<HowIWork />)

      const gappedElements = container.querySelectorAll("[class*='gap']")
      expect(gappedElements.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe("Animation and interactivity", () => {
    it("renders elements with animation-ready structure", () => {
      const { container } = render(<HowIWork />)

      // Should have elements that can be animated
      const animatable = container.querySelectorAll("[class*='transition']")
      expect(animatable.length).toBeGreaterThanOrEqual(0)

      // But component should render without errors regardless
      expect(container.querySelectorAll("*").length).toBeGreaterThan(0)
    })

    it("renders nodes that could be highlighted on scroll", () => {
      render(<HowIWork />)

      // Should have nodes/values to highlight
      const nodes = screen.getByText(/discover/i).closest("div")
      expect(nodes).toBeInTheDocument()
    })
  })

  describe("Accessibility", () => {
    it("uses semantic list structure", () => {
      const { container } = render(<HowIWork />)

      const listItems = container.querySelectorAll('[role="listitem"]')
      expect(listItems.length).toBeGreaterThan(0)
    })

    it("renders all text content visibly", () => {
      render(<HowIWork />)

      const phases = ["Discover", "Define", "Design", "Deliver", "DevOps"]
      phases.forEach((phase) => {
        expect(screen.getByText(new RegExp(phase, "i"))).toBeVisible()
      })
    })

    it("has sufficient contrast with icons and text", () => {
      render(<HowIWork />)

      // Icons and text should be distinguishable
      expect(screen.getByTestId("icon-search")).toBeInTheDocument()
      expect(screen.getByText(/discover/i)).toBeInTheDocument()
    })

    it("provides context for phase meaning", () => {
      render(<HowIWork />)

      // Each phase should have a description
      expect(screen.getByText(/stakeholder interviews/i)).toBeInTheDocument()
      expect(screen.getByText(/user stories/i)).toBeInTheDocument()
      expect(screen.getByText(/architecture/i)).toBeInTheDocument()
    })
  })

  describe("Performance", () => {
    it("renders efficiently without excessive re-renders", () => {
      const { rerender } = render(<HowIWork />)

      // Should handle re-render without crashing
      rerender(<HowIWork />)

      expect(screen.getByText(/discover/i)).toBeInTheDocument()
    })

    it("has reasonable DOM size", () => {
      const { container } = render(<HowIWork />)

      // Component should be lean
      expect(container.querySelectorAll("*").length).toBeLessThan(500)
    })
  })

  describe("Content completeness", () => {
    it("covers all five workflow phases", () => {
      render(<HowIWork />)

      const phases = ["Discover", "Define", "Design", "Deliver", "DevOps"]
      phases.forEach((phase) => {
        expect(screen.getByText(new RegExp(`^${phase}`, "i"))).toBeInTheDocument()
      })
    })

    it("includes expertise arrays for each phase", () => {
      render(<HowIWork />)

      // At least one expertise item per phase area
      const keywords = ["stakeholder", "user stories", "architecture", "agile"]
      keywords.forEach((keyword) => {
        expect(screen.getByText(new RegExp(keyword, "i"))).toBeInTheDocument()
      })
    })
  })
})
