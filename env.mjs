import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

/** Resend `from` accepts a plain RFC email or `Display Name <email@domain>`. */
function isResendFromAddress(value) {
  const trimmed = value.trim()
  if (z.string().email().safeParse(trimmed).success) return true
  const angle = /^[\s\S]*?<([^>]+)>$/.exec(trimmed)
  if (angle?.[1]) {
    return z.string().email().safeParse(angle[1].trim()).success
  }
  return false
}

const optionalResendFrom = z
  .string()
  .optional()
  .refine(
    (val) => val === undefined || val.trim() === "" || isResendFromAddress(val),
    "Invalid RESEND_FROM_EMAIL (plain email or Name <email>)",
  )

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    DATABASE_URL: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : val),
      z.string().min(1).optional(),
    ),
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM_EMAIL: optionalResendFrom,
    RESEND_TO_EMAIL: z.string().email().optional(),
    RESEND_AUDIENCE_ID: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_TO_EMAIL: process.env.RESEND_TO_EMAIL,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
  },
})
