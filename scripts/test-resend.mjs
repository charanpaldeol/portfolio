#!/usr/bin/env node
/**
 * Quick Resend API test. Run: node scripts/test-resend.mjs
 * Requires RESEND_API_KEY in .env.local (loaded via dotenv or set manually)
 */
import { Resend } from "resend"
import { readFileSync } from "fs"
import { resolve } from "path"

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local")
try {
  const content = readFileSync(envPath, "utf8")
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^["']|["']$/g, "")
      if (!process.env[key]) process.env[key] = val
    }
  }
} catch {
  console.error("Could not read .env.local")
  process.exit(1)
}

const apiKey = process.env.RESEND_API_KEY
if (!apiKey || apiKey === "re_xxxxxxxxx") {
  console.error("Set RESEND_API_KEY in .env.local (replace re_xxxxxxxxx with your key)")
  process.exit(1)
}

const resend = new Resend(apiKey)

const { data, error } = await resend.emails.send({
  from: "Contact <onboarding@resend.dev>",
  to: ["alexraynove@gmail.com"],
  subject: "Contact form test from cpdeol.com",
  html: "<p>This is a test email from your contact form.</p>",
})

if (error) {
  console.error("Resend error:", error.message)
  process.exit(1)
}

console.log("Email sent successfully. ID:", data?.id)
