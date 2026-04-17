/**
 * Client-side helper for newsletter signup (fetch lives here so /components/ stay ESLint-clean).
 */

export type NewsletterSubscribeSource = "footer" | "inline"

export interface NewsletterSubscribePayload {
  email: string
  source?: NewsletterSubscribeSource
}

export async function subscribeToNewsletter(
  email: string,
  options?: { source?: NewsletterSubscribeSource },
): Promise<boolean> {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      source: options?.source ?? "inline",
    } satisfies NewsletterSubscribePayload),
  })
  return res.ok
}
