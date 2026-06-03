"use client"

// Purpose: Client shell for /weather — units preference and other client-only page context.
import { type ReactNode, Suspense } from "react"

import { WeatherUnitsProvider } from "@/components/weather/WeatherUnitsProvider"

function WeatherUnitsFallback() {
  return <div className="h-8 w-24 animate-pulse rounded-xl bg-surface-container-low" />
}

export function WeatherClientShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<WeatherUnitsFallback />}>
      <WeatherUnitsProvider>{children}</WeatherUnitsProvider>
    </Suspense>
  )
}
