"use client"

// Purpose: Copy the current weather page URL to clipboard.
import { useEffect, useState } from "react"

export function CopyWeatherLink() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
      title="Copy this weather page URL"
    >
      {copied ? "Link copied" : "Copy link"}
    </button>
  )
}
