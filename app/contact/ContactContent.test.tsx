import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import ContactContent from "./ContactContent"

// Mock the fetch API
global.fetch = vi.fn()

// Mock BlurFade component
vi.mock("@/components/magicui/blur-fade", () => ({
  BlurFade: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock RainbowButton component
vi.mock("@/registry/magicui/rainbow-button", () => ({
  RainbowButton: ({
    children,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))

describe("ContactContent", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("renders the contact form with all fields", () => {
      render(<ContactContent />)

      expect(screen.getByText(/let's start a conversation/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/project details/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument()
    })

    it("renders hero section with correct text", () => {
      render(<ContactContent />)

      expect(screen.getByText(/let's start a conversation/i)).toBeInTheDocument()
      expect(screen.getByText(/Share a bit about your product/i)).toBeInTheDocument()
      expect(screen.getByText(/cpdeol@outlook.com/i)).toBeInTheDocument()
    })

    it("renders info cards describing engagements and availability", () => {
      render(<ContactContent />)

      expect(screen.getByText(/typical engagements/i)).toBeInTheDocument()
      expect(screen.getByText(/product strategy/i)).toBeInTheDocument()
      expect(screen.getByText(/availability/i)).toBeInTheDocument()
      expect(screen.getByText(/2026/i)).toBeInTheDocument()
    })

    it("renders testimonial quote", () => {
      render(<ContactContent />)

      expect(screen.getByText(/Clear framing, honest timelines/i)).toBeInTheDocument()
    })
  })

  describe("Form submission", () => {
    it("submits form with valid data", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "email-id-123" }),
      })
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      const messageInput = screen.getByLabelText(/project details/i) as HTMLTextAreaElement
      const submitButton = screen.getByRole("button", { name: /send message/i })

      await user.type(nameInput, "John Doe")
      await user.type(emailInput, "john@example.com")
      await user.type(messageInput, "I need help with my project")
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "John Doe",
            email: "john@example.com",
            message: "I need help with my project",
          }),
        })
      })
    })

    it("shows success message after successful submission", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "email-id-456" }),
      })
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      await user.type(screen.getByLabelText(/name/i), "Jane Doe")
      await user.type(screen.getByLabelText(/email/i), "jane@example.com")
      await user.type(screen.getByLabelText(/project details/i), "Test project")
      await user.click(screen.getByRole("button", { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByRole("status")).toHaveTextContent(/message sent/i)
      })
    })

    it("shows error message on failed submission", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Email service failed" }),
      })
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      await user.type(screen.getByLabelText(/name/i), "Error Test")
      await user.type(screen.getByLabelText(/email/i), "error@example.com")
      await user.type(screen.getByLabelText(/project details/i), "This will fail")
      await user.click(screen.getByRole("button", { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(/email service failed/i)
      })
    })

    it("shows generic error message when server response is invalid JSON", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON")
        },
      })
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      await user.type(screen.getByLabelText(/name/i), "Bad JSON Test")
      await user.type(screen.getByLabelText(/email/i), "badjson@example.com")
      await user.type(screen.getByLabelText(/project details/i), "JSON parsing error")
      await user.click(screen.getByRole("button", { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /something went wrong|please try again/i
        )
      })
    })
  })

  describe("Form reset", () => {
    it("clears form fields after successful submission", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "email-id-789" }),
      })
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      const messageInput = screen.getByLabelText(/project details/i) as HTMLTextAreaElement

      await user.type(nameInput, "Reset Test")
      await user.type(emailInput, "reset@example.com")
      await user.type(messageInput, "Testing form reset")
      await user.click(screen.getByRole("button", { name: /send message/i }))

      await waitFor(() => {
        expect(nameInput.value).toBe("")
        expect(emailInput.value).toBe("")
        expect(messageInput.value).toBe("")
      })
    })
  })

  describe("Button states", () => {
    it("disables submit button while submitting", async () => {
      let resolveSubmit: (() => void) | null = null
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve
      })

      const mockFetch = vi.fn(() => submitPromise.then(() => ({
        ok: true,
        json: async () => ({ id: "email-id" }),
      })))
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      await user.type(screen.getByLabelText(/name/i), "Disable Test")
      await user.type(screen.getByLabelText(/email/i), "disable@example.com")
      await user.type(screen.getByLabelText(/project details/i), "Testing disabled state")

      const submitButton = screen.getByRole("button", { name: /send message/i })
      expect(submitButton).not.toBeDisabled()

      await user.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })

      if (resolveSubmit) resolveSubmit()

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })

    it("shows 'Sending...' text while submitting", async () => {
      let resolveSubmit: (() => void) | null = null
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve
      })

      const mockFetch = vi.fn(() => submitPromise.then(() => ({
        ok: true,
        json: async () => ({ id: "email-id" }),
      })))
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      await user.type(screen.getByLabelText(/name/i), "Sending Test")
      await user.type(screen.getByLabelText(/email/i), "sending@example.com")
      await user.type(screen.getByLabelText(/project details/i), "Testing sending state")

      const submitButton = screen.getByRole("button", { name: /send message/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toHaveTextContent(/sending/i)
      })

      if (resolveSubmit) resolveSubmit()

      await waitFor(() => {
        expect(submitButton).toHaveTextContent(/send message/i)
      })
    })
  })

  describe("Error handling", () => {
    it("clears error message when form is submitted again", async () => {
      let callCount = 0
      const mockFetch = vi.fn().mockImplementation(() => {
        callCount++
        return Promise.resolve({
          ok: callCount === 2, // First call fails, second succeeds
          json: async () => (callCount === 2 ? { id: "email-id" } : { error: "Failed" }),
        })
      })
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      // First submission - fails
      await user.type(screen.getByLabelText(/name/i), "Error Test")
      await user.type(screen.getByLabelText(/email/i), "error@example.com")
      await user.type(screen.getByLabelText(/project details/i), "First attempt")
      await user.click(screen.getByRole("button", { name: /send message/i }))

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument()
      })

      // Clear form and try again
      await user.clear(screen.getByLabelText(/project details/i))
      await user.type(screen.getByLabelText(/project details/i), "Second attempt")
      await user.click(screen.getByRole("button", { name: /send message/i }))

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument()
      })
    })

    it("prevents submission with empty form fields", async () => {
      const mockFetch = vi.fn()
      global.fetch = mockFetch

      render(<ContactContent />)

      // Try to submit without filling form (HTML validation should prevent)
      // This test documents the behavior with required fields
      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
      expect(nameInput.required).toBe(true)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe("Accessibility", () => {
    it("uses proper form structure and labels", () => {
      render(<ContactContent />)

      const form = screen.getByRole("button", { name: /send message/i }).closest("form")
      expect(form).toBeInTheDocument()

      expect(screen.getByLabelText(/name/i)).toHaveAttribute("id", "name")
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("id", "email")
      expect(screen.getByLabelText(/project details/i)).toHaveAttribute("id", "message")
    })

    it("marks required fields correctly", () => {
      render(<ContactContent />)

      expect(screen.getByLabelText(/name/i)).toHaveAttribute("required")
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("required")
      expect(screen.getByLabelText(/project details/i)).toHaveAttribute("required")
    })

    it("uses proper ARIA roles for messages", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "email-id" }),
      })
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      await user.type(screen.getByLabelText(/name/i), "A11y Test")
      await user.type(screen.getByLabelText(/email/i), "a11y@example.com")
      await user.type(screen.getByLabelText(/project details/i), "Testing accessibility")
      await user.click(screen.getByRole("button", { name: /send message/i }))

      await waitFor(() => {
        const statusMessage = screen.getByRole("status")
        expect(statusMessage).toBeInTheDocument()
      })
    })

    it("uses role='alert' for error messages", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Something failed" }),
      })
      global.fetch = mockFetch

      const user = userEvent.setup()
      render(<ContactContent />)

      await user.type(screen.getByLabelText(/name/i), "Alert Test")
      await user.type(screen.getByLabelText(/email/i), "alert@example.com")
      await user.type(screen.getByLabelText(/project details/i), "Testing alert role")
      await user.click(screen.getByRole("button", { name: /send message/i }))

      await waitFor(() => {
        const alertMessage = screen.getByRole("alert")
        expect(alertMessage).toBeInTheDocument()
      })
    })
  })
})
