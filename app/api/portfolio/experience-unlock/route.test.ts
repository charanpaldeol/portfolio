/** @vitest-environment node */
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/db", () => ({
  getDb: vi.fn(),
}))

import { getDb } from "@/lib/db"

import { POST } from "./route"

const mockGetDb = vi.mocked(getDb)

describe("POST /api/portfolio/experience-unlock", () => {
  beforeEach(() => {
    mockGetDb.mockReset()
  })

  it("returns 400 for invalid email", async () => {
    mockGetDb.mockReturnValue(null)
    const request = new Request("http://localhost/api/portfolio/experience-unlock", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 503 when database is not configured", async () => {
    mockGetDb.mockReturnValue(null)
    const request = new Request("http://localhost/api/portfolio/experience-unlock", {
      method: "POST",
      body: JSON.stringify({ email: "hello@example.com" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(503)
  })
})
