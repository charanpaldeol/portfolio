/**
 * Client-side helper for experience page email gate (fetch lives in /lib for ESLint).
 */

export async function submitExperienceUnlock(email: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/portfolio/experience-unlock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  const data = (await res.json().catch(() => ({}))) as { error?: string }
  if (!res.ok) {
    return { ok: false, error: data.error ?? "Something went wrong. Please try again." }
  }
  return { ok: true }
}
