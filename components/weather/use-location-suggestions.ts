// Purpose: Debounced location autocomplete fetch for weather search fields.
"use client"

import { useEffect, useState } from "react"

import type { LocationSuggestion } from "@/lib/weather-geocode"

type LocationsResponse = {
  results?: LocationSuggestion[]
}

export function useLocationSuggestions(query: string, enabled = true) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")

  useEffect(() => {
    if (!enabled || query.trim().length < 2) {
      setSuggestions([])
      setIsLoading(false)
      setFetchError("")
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsLoading(true)
      setFetchError("")
      try {
        const params = new URLSearchParams({ q: query.trim() })
        const res = await fetch(`/api/weather/locations?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          setSuggestions([])
          setFetchError("Could not search locations. Try again in a moment.")
          return
        }
        const data = (await res.json()) as LocationsResponse
        setSuggestions(data.results ?? [])
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setSuggestions([])
        setFetchError("Could not search locations. Check your connection and try again.")
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 300)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [enabled, query])

  return { suggestions, isLoading, fetchError, setFetchError }
}
