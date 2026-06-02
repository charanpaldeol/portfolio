// Purpose: Derive 1991–2020 monthly climate normals from Open-Meteo archive daily data.
import type { ClimateExtremes, MonthlyClimateNormal } from "@/lib/weather-types"

export const CLIMATE_NORMALS_PERIOD = "1991–2020"

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

type ArchiveDaily = {
  time?: string[]
  temperature_2m_mean?: number[]
  temperature_2m_max?: number[]
  temperature_2m_min?: number[]
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  const sum = values.reduce((total, value) => total + value, 0)
  return sum / values.length
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

export function buildClimateArchiveUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: "1991-01-01",
    end_date: "2020-12-31",
    daily: "temperature_2m_mean,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
  })
  return `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`
}

export function computeMonthlyNormals(daily: ArchiveDaily): MonthlyClimateNormal[] {
  const times = daily.time ?? []
  const means = daily.temperature_2m_mean ?? []
  const highs = daily.temperature_2m_max ?? []
  const lows = daily.temperature_2m_min ?? []

  const buckets = Array.from({ length: 12 }, () => ({
    mean: [] as number[],
    high: [] as number[],
    low: [] as number[],
  }))

  for (let index = 0; index < times.length; index += 1) {
    const date = times[index]
    const month = Number.parseInt(date?.slice(5, 7) ?? "", 10)
    if (!Number.isFinite(month) || month < 1 || month > 12) continue

    const mean = means[index]
    const high = highs[index]
    const low = lows[index]
    const bucket = buckets[month - 1]
    if (typeof mean === "number" && Number.isFinite(mean)) bucket.mean.push(mean)
    if (typeof high === "number" && Number.isFinite(high)) bucket.high.push(high)
    if (typeof low === "number" && Number.isFinite(low)) bucket.low.push(low)
  }

  return buckets.map((bucket, index) => {
    const meanC = average(bucket.mean)
    const highC = average(bucket.high)
    const lowC = average(bucket.low)
    return {
      month: index + 1,
      monthName: MONTH_NAMES[index] ?? "—",
      meanC: meanC != null ? round1(meanC) : 0,
      highC: highC != null ? round1(highC) : 0,
      lowC: lowC != null ? round1(lowC) : 0,
    }
  })
}

export function findClimateExtremes(months: MonthlyClimateNormal[]): ClimateExtremes | null {
  const valid = months.filter(
    (month) => Number.isFinite(month.meanC) && Number.isFinite(month.highC) && Number.isFinite(month.lowC)
  )
  if (valid.length === 0) return null

  let hottest = valid[0]
  let coldest = valid[0]

  for (const month of valid.slice(1)) {
    if (month.meanC > hottest.meanC) hottest = month
    if (month.meanC < coldest.meanC) coldest = month
  }

  return {
    periodLabel: CLIMATE_NORMALS_PERIOD,
    hottest,
    coldest,
  }
}

export function parseClimateExtremes(body: { daily?: ArchiveDaily }): ClimateExtremes | null {
  const daily = body.daily
  if (!daily?.time?.length) return null
  return findClimateExtremes(computeMonthlyNormals(daily))
}

export function formatClimateMonthSummary(month: MonthlyClimateNormal): string {
  return `${month.meanC.toFixed(1)}° avg · high ${month.highC.toFixed(1)}° · low ${month.lowC.toFixed(1)}°`
}
