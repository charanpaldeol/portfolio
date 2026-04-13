/**
 * Client-side helper for newsletter signup (fetch lives here so /components/ stay ESLint-clean).
 */

export interface NewsletterSubscribePayload {
  email: string
}

export async function subscribeToNewsletter(email: string): Promise<boolean> {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  return res.ok
}
