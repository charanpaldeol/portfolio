import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import HowIWork from "../../components/home/HowIWork"

// Mock a subset of Lucide icons used by HowIWork, but preserve other exports
// because other lib modules reference additional icons (e.g. HowIThink principles).
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>()
  return {
    ...actual,
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
  }
})

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

  it("renders without crashing", () => {
    render(<HowIWork />)
    expect(true).toBe(true)
  })

  it("renders all workflow phases", () => {
    render(<HowIWork />)
    for (const title of phaseTitles) {
      expect(screen.getByText(new RegExp(`^${title}$`, "i"))).toBeInTheDocument()
    }
  })

  it("renders a list of phases", () => {
    const { container } = render(<HowIWork />)
    expect(container.querySelectorAll('[role=\"listitem\"]').length).toBeGreaterThanOrEqual(phaseTitles.length)
  })

  it("renders phase icons", () => {
    render(<HowIWork />)
    expect(screen.getByTestId("icon-search")).toBeInTheDocument()
    expect(screen.getByTestId("icon-filetext")).toBeInTheDocument()
    expect(screen.getByTestId("icon-box")).toBeInTheDocument()
    expect(screen.getByTestId("icon-zap")).toBeInTheDocument()
  })
})
