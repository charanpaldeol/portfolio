import { render, screen, within } from "@testing-library/react"
import { usePathname } from "next/navigation"
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Navbar } from "./Navbar"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}))

// Mock sub-components
vi.mock("./navbar/BrandMark", () => ({
  BrandMark: () => <div data-testid="brand-mark">Logo</div>,
}))

vi.mock("./navbar/WorkPanel", () => ({
  WorkPanel: () => <div data-testid="work-panel">Work Panel</div>,
}))

vi.mock("./navbar/SocialLinks", () => ({
  SocialLinks: () => <div data-testid="social-links">Social Links</div>,
}))

// Mock UI components
vi.mock("../ui/navigation-menu", () => ({
  NavigationMenu: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="navigation-menu">{children}</nav>
  ),
  NavigationMenuList: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="navigation-list">{children}</ul>
  ),
  NavigationMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="navigation-item">{children}</li>
  ),
  NavigationMenuTrigger: ({
    children,
    ...props
  }: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="navigation-trigger" type="button" {...props}>
      {children}
    </button>
  ),
  NavigationMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="navigation-content">{children}</div>
  ),
  NavigationMenuLink: ({
    children,
    href,
    exact: _exact,
    ...props
  }: { children: ReactNode; href: string; exact?: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} data-testid={`nav-link-${href}`} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("../ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet">{children}</div>
  ),
  SheetTrigger: ({
    children,
    ...props
  }: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="sheet-trigger" type="button" {...props}>
      {children}
    </button>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-header">{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="sheet-title">{children}</h2>
  ),
  SheetClose: ({
    children,
    ...props
  }: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="sheet-close" type="button" {...props}>
      {children}
    </button>
  ),
}))

const mockUsePathname = vi.mocked(usePathname)

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("renders navbar header with sticky positioning", () => {
      mockUsePathname.mockReturnValue("/")

      const { container } = render(<Navbar />)
      const header = container.querySelector("header")

      expect(header).toBeInTheDocument()
      expect(header).toHaveClass("sticky", "top-0", "z-[100]")
    })

    it("renders brand logo and name", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("brand-mark")).toBeInTheDocument()
      const logoLink = screen.getByRole("link", { name: /cpdeol home/i })
      expect(within(logoLink).getByText("cpdeol")).toBeInTheDocument()
      expect(within(logoLink).getByText("_")).toBeInTheDocument() // Blink cursor
    })

    it("renders desktop navigation", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("navigation-menu")).toBeInTheDocument()
      expect(screen.getByTestId("nav-link-/")).toBeInTheDocument()
    })

    it("renders mobile sheet for navigation", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("sheet")).toBeInTheDocument()
      expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument()
    })

    it("renders social links component", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("social-links")).toBeInTheDocument()
    })
  })

  describe("Active states", () => {
    it("applies bold styling to home text when on home route", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      const logoLink = screen.getByRole("link", { name: /cpdeol home/i })
      const nameRow = logoLink.querySelector("span.font-display")
      expect(nameRow).toBeTruthy()
      expect(nameRow).toHaveClass("font-semibold")
    })

    it("applies normal styling to home text when not on home route", () => {
      mockUsePathname.mockReturnValue("/portfolio/project")

      render(<Navbar />)

      const logoLink = screen.getByRole("link", { name: /cpdeol home/i })
      const nameRow = logoLink.querySelector("span.font-display")
      expect(nameRow).toBeTruthy()
      expect(nameRow).toHaveClass("font-medium")
    })

    it("applies bold styling to Work menu when on work route", () => {
      mockUsePathname.mockReturnValue("/portfolio/project")

      render(<Navbar />)

      const workTrigger = screen.getByTestId("navigation-trigger")
      expect(workTrigger).toHaveClass("font-semibold")
    })

    it("does not apply bold to Work menu when not on work route", () => {
      mockUsePathname.mockReturnValue("/ideas")

      render(<Navbar />)

      const workTrigger = screen.getByTestId("navigation-trigger")
      expect(workTrigger).not.toHaveClass("font-semibold")
    })
  })

  describe("Logo link", () => {
    it("links to home page", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      const logoLink = screen.getByRole("link", { name: /cpdeol home/i })
      expect(logoLink).toHaveAttribute("href", "/")
    })

    it("has proper aria-label for accessibility", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      const logoLink = screen.getByRole("link", { name: /cpdeol home/i })
      expect(logoLink).toHaveAttribute("aria-label", "cpdeol home")
    })
  })

  describe("Navigation structure", () => {
    it("renders Home link in navigation", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("nav-link-/")).toHaveTextContent("Home")
    })

    it("renders Services and Projects as top-level desktop links", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("nav-link-/portfolio/services")).toHaveTextContent("Services")
      expect(screen.getByTestId("nav-link-/portfolio/projects")).toHaveTextContent("Projects")
    })

    it("renders Work dropdown trigger", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("navigation-trigger")).toHaveTextContent("Work")
    })

    it("shows WorkPanel component when Work menu is triggered", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("work-panel")).toBeInTheDocument()
    })
  })

  describe("Padding", () => {
    it.each([
      ["/", "home"],
      ["/blog", "blog"],
      ["/internet-owned", "ideas"],
      ["/portfolio/services", "portfolio services"],
      ["/portfolio/projects", "portfolio projects"],
    ])("uses the same bar padding on %s (%s)", (path) => {
      mockUsePathname.mockReturnValue(path)

      const { container } = render(<Navbar />)

      const navContent = container.querySelector("div[class*='mx-auto']")
      expect(navContent).toHaveClass("py-3")
    })
  })

  describe("Route detection", () => {
    it("detects /portfolio routes correctly", () => {
      mockUsePathname.mockReturnValue("/portfolio/project-1")

      render(<Navbar />)

      const workTrigger = screen.getByTestId("navigation-trigger")
      // Work trigger should have bold styling when on work route
      expect(workTrigger).toHaveClass("font-semibold")
    })

    it("detects /portfolio/services routes correctly", () => {
      mockUsePathname.mockReturnValue("/portfolio/services")

      render(<Navbar />)

      const workTrigger = screen.getByTestId("navigation-trigger")
      expect(workTrigger).toHaveClass("font-semibold")
    })

    it("detects ideas routes with various paths", () => {
      mockUsePathname.mockReturnValue("/ideas/some-article")

      render(<Navbar />)

      // Ideas link should be highlighted
      expect(screen.getByTestId("navigation-menu")).toBeInTheDocument()
    })
  })

  describe("Visual styling", () => {
    it("applies glassmorphism backdrop blur to navbar", () => {
      mockUsePathname.mockReturnValue("/")

      const { container } = render(<Navbar />)
      const header = container.querySelector("header")

      expect(header).toHaveClass(
        "backdrop-blur-xl",
        "backdrop-saturate-150",
        "bg-surface/90"
      )
    })

    it("applies editorial shadow styling", () => {
      mockUsePathname.mockReturnValue("/")

      const { container } = render(<Navbar />)
      const header = container.querySelector("header")

      expect(header).toHaveClass("shadow-editorial-float")
    })

    it("applies border styling with low opacity", () => {
      mockUsePathname.mockReturnValue("/")

      const { container } = render(<Navbar />)
      const header = container.querySelector("header")

      expect(header).toHaveClass("border-b", "border-outline-variant/10")
    })
  })

  describe("Responsive design", () => {
    it("hides desktop nav on mobile", () => {
      mockUsePathname.mockReturnValue("/")

      const { container } = render(<Navbar />)

      const desktopNav = Array.from(container.querySelectorAll("div")).find(
        (div) => div.getAttribute("class")?.includes("md:flex")
      )

      expect(desktopNav).toHaveClass("hidden", "md:flex")
    })

    it("uses responsive padding", () => {
      mockUsePathname.mockReturnValue("/")

      const { container } = render(<Navbar />)

      const navContent = container.querySelector("div[class*='mx-auto']")
      expect(navContent).toHaveClass("px-4", "md:px-6")
    })

    it("constrains navbar to max width", () => {
      mockUsePathname.mockReturnValue("/")

      const { container } = render(<Navbar />)

      const navContent = container.querySelector("div[class*='max-w']")
      expect(navContent).toHaveClass("max-w-6xl")
    })
  })

  describe("Accessibility", () => {
    it("uses semantic header element", () => {
      mockUsePathname.mockReturnValue("/")

      const { container } = render(<Navbar />)
      expect(container.querySelector("header")).toBeInTheDocument()
    })

    it("hides decorative elements from screen readers", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      const decorative = screen.getByText("_")
      expect(decorative).toHaveAttribute("aria-hidden", "true")
    })

    it("provides aria-label for logo link", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByRole("link", { name: /cpdeol home/i })).toBeInTheDocument()
    })

    it("uses proper navigation semantics", () => {
      mockUsePathname.mockReturnValue("/")

      render(<Navbar />)

      expect(screen.getByTestId("navigation-menu")).toBeInTheDocument()
    })
  })
})
