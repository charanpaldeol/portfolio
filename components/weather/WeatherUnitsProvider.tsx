"use client"

// Purpose: Celsius/Fahrenheit preference via URL param and localStorage.
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import {
  parseWeatherUnits,
  WEATHER_UNITS_STORAGE_KEY,
  type WeatherUnits,
} from "@/lib/weather-units"

type WeatherUnitsContextValue = {
  units: WeatherUnits
  setUnits: (units: WeatherUnits) => void
}

const WeatherUnitsContext = createContext<WeatherUnitsContextValue | null>(null)

export function WeatherUnitsProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramUnits = parseWeatherUnits(searchParams.get("units"))
  const [units, setUnitsState] = useState<WeatherUnits>(paramUnits)

  useEffect(() => {
    if (searchParams.get("units")) {
      setUnitsState(paramUnits)
      return
    }
    try {
      const stored = window.localStorage.getItem(WEATHER_UNITS_STORAGE_KEY)
      if (stored === "c" || stored === "f") setUnitsState(stored)
    } catch {
      // ignore
    }
  }, [paramUnits, searchParams])

  const setUnits = useCallback(
    (next: WeatherUnits) => {
      setUnitsState(next)
      try {
        window.localStorage.setItem(WEATHER_UNITS_STORAGE_KEY, next)
      } catch {
        // ignore
      }
      const params = new URLSearchParams(searchParams.toString())
      if (next === "c") params.delete("units")
      else params.set("units", next)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const value = useMemo(() => ({ units, setUnits }), [units, setUnits])

  return <WeatherUnitsContext.Provider value={value}>{children}</WeatherUnitsContext.Provider>
}

export function useWeatherUnits(): WeatherUnitsContextValue {
  const ctx = useContext(WeatherUnitsContext)
  if (!ctx) {
    return {
      units: "c",
      setUnits: () => undefined,
    }
  }
  return ctx
}

export function WeatherUnitsToggle({ className }: { className?: string }) {
  const { units, setUnits } = useWeatherUnits()

  return (
    <div
      className={cn(
        "inline-flex rounded-xl bg-surface-container-low p-0.5 ring-1 ring-outline-variant/15",
        className
      )}
      role="group"
      aria-label="Temperature units"
    >
      {(["c", "f"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={units === value}
          onClick={() => setUnits(value)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
            units === value
              ? "bg-surface-container-high text-on-surface"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          °{value.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
