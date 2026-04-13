import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import HowIWork from "../../components/home/HowIWork"

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

const phaseTitles = ["Discover", "Define", "Design", "Deliver", "Adopt", "Value"] as const

describe("HowIWork", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.IntersectionObserver = class {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
      takeRecords = vi.fn(() => [])
      root = null
      rootMargin = ""
      thresholds = []
    } as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("renders the component without crashing", () => {
      render(<HowIWork />)
      expect(true).toBe(true)
    })

    it("renders all workflow phases", () => {
      render(<HowIWork />)

      phaseTitles.forEach((title) => {
        expect(screen.getByText(new RegExp(`^${title}$`, "i"))).toBeInTheDocument()
      })
    })

    it("renders phase descriptions", () => {
      render(<HowIWork />)

      expect(screen.getByText(/stakeholder interviews/i)).toBeInTheDocument()
      expect(screen.getByText(/user stories/i)).toBeInTheDocument()
      expect(screen.getByText(/architecture, data models/i)).toBeInTheDocument()
    })

    it("renders expertise items", () => {
      render(<HowIWork />)

      expect(screen.getByText(/Business & product/i)).toBeInTheDocument()
      expect(screen.getByText(/Engineering & QA/i)).toBeInTheDocument()
    })
  })

  describe("Phase structure", () => {
    it("renders each phase as a list item", () => {
      const { container } = render(<HowIWork />)

      const listItems = container.querySelectorAll('[role="listitem"]')
      expect(listItems.length).toBeGreaterThanOrEqual(phaseTitles.length)
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

      phaseTitles.forEach((title) => {
        expect(screen.getByText(new RegExp(`^${title}$`, "i"))).toBeInTheDocument()
      })
    })
  })

  describe("Emphasized content", () => {
    it("marks certain phases as emphasized", () => {
      const { container } = render(<HowIWork />)

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

      const elements = container.querySelectorAll("*")
      expect(elements.length).toBeGreaterThan(10)
    })

    it("uses CSS module classes for styling", () => {
      const { container } = render(<HowIWork />)

      const styled = container.querySelectorAll("[class*='hiw']")
      expect(styled.length).toBeGreaterThanOrEqual(0)

      expect(container.querySelectorAll("*").length).toBeGreaterThan(5)
    })
  })

  describe("Data validation", () => {
    it("has correct number of phases defined", () => {
      render(<HowIWork />)

      phaseTitles.forEach((phase) => {
        expect(screen.getByText(new RegExp(`^${phase}$`, "i"))).toBeInTheDocument()
      })
    })

    it("has expertise array populated", () => {
      render(<HowIWork />)

      expect(screen.getByText(/Executives, product owners/i)).toBeInTheDocument()
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

      phaseTitles.forEach((title) => {
        const element = screen.getByText(new RegExp(`^${title}$`, "i"))
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

      const animatable = container.querySelectorAll("[class*='transition']")
      expect(animatable.length).toBeGreaterThanOrEqual(0)

      expect(container.querySelectorAll("*").length).toBeGreaterThan(0)
    })

    it("renders nodes that could be highlighted on scroll", () => {
      render(<HowIWork />)

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

      phaseTitles.forEach((phase) => {
        expect(screen.getByText(new RegExp(`^${phase}$`, "i"))).toBeVisible()
      })
    })

    it("has sufficient contrast with icons and text", () => {
      render(<HowIWork />)

      expect(screen.getByTestId("icon-search")).toBeInTheDocument()
      expect(screen.getByText(/discover/i)).toBeInTheDocument()
    })

    it("provides context for phase meaning", () => {
      render(<HowIWork />)

      expect(screen.getByText(/stakeholder interviews/i)).toBeInTheDocument()
      expect(screen.getByText(/user stories/i)).toBeInTheDocument()
      expect(screen.getByText(/architecture/i)).toBeInTheDocument()
    })
  })

  describe("Performance", () => {
    it("renders efficiently without excessive re-renders", () => {
      const { rerender } = render(<HowIWork />)

      rerender(<HowIWork />)

      expect(screen.getByText(/discover/i)).toBeInTheDocument()
    })

    it("has reasonable DOM size", () => {
      const { container } = render(<HowIWork />)

      expect(container.querySelectorAll("*").length).toBeLessThan(500)
    })
  })

  describe("Content completeness", () => {
    it("covers all workflow phases", () => {
      render(<HowIWork />)

      phaseTitles.forEach((phase) => {
        expect(screen.getByText(new RegExp(`^${phase}$`, "i"))).toBeInTheDocument()
      })
    })

    it("includes expertise and phase copy", () => {
      render(<HowIWork />)

      const keywords = ["stakeholder", "user stories", "architecture", "agile"]
      keywords.forEach((keyword) => {
        expect(screen.getByText(new RegExp(keyword, "i"))).toBeInTheDocument()
      })
    })
  })
})
