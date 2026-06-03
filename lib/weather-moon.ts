// Purpose: Moon phase labels and icons from calendar date (no external API).
import type { MoonInfo } from "@/lib/weather-types"

function synodicMonthPhase(date: Date): number {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const c = Math.floor(365.25 * year)
  const e = Math.floor(30.6 * month)
  const jd = c + e + day - 694039.09
  return jd / 29.530588853
}

export function moonInfoForDate(date = new Date()): MoonInfo {
  const phase = synodicMonthPhase(date) % 1
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50)

  if (phase < 0.03 || phase > 0.97) {
    return { phaseLabel: "New moon", icon: "🌑", illuminationPercent: illumination }
  }
  if (phase < 0.22) {
    return { phaseLabel: "Waxing crescent", icon: "🌒", illuminationPercent: illumination }
  }
  if (phase < 0.28) {
    return { phaseLabel: "First quarter", icon: "🌓", illuminationPercent: illumination }
  }
  if (phase < 0.47) {
    return { phaseLabel: "Waxing gibbous", icon: "🌔", illuminationPercent: illumination }
  }
  if (phase < 0.53) {
    return { phaseLabel: "Full moon", icon: "🌕", illuminationPercent: illumination }
  }
  if (phase < 0.72) {
    return { phaseLabel: "Waning gibbous", icon: "🌖", illuminationPercent: illumination }
  }
  if (phase < 0.78) {
    return { phaseLabel: "Last quarter", icon: "🌗", illuminationPercent: illumination }
  }
  return { phaseLabel: "Waning crescent", icon: "🌘", illuminationPercent: illumination }
}
