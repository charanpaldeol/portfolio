// Purpose: Build 24h temperature curve geometry for the weather hero (hourly + sun times).
import { formatClockTime } from "@/lib/weather-format"
import type { HourlyForecastHour } from "@/lib/weather-types"
import { celsiusToFahrenheit } from "@/lib/weather-units"

const DAY_MINUTES = 24 * 60

/** Shared with DayTemperatureCurve SVG viewBox — keep in sync. */
export const DAY_CURVE_LAYOUT = {
  width: 360,
  height: 72,
  padLeft: 26,
  padRight: 8,
  padTop: 10,
  padBottom: 20,
} as const

const MSN_TIME_TICKS = [
  { minute: 0, label: "12 AM" },
  { minute: 360, label: "6 AM" },
  { minute: 720, label: "12 PM" },
  { minute: 1080, label: "6 PM" },
] as const

export type DayCurvePoint = {
  /** Minutes from local midnight (0–1440). */
  minute: number
  tempC: number
}

export type DayCurveChartPoint = {
  x: number
  y: number
}

export type DayCurveHourlyMarker = {
  minute: number
  tempC: number
  x: number
  y: number
  isNow: boolean
}

export type DayCurveTimeTick = {
  minute: number
  label: string
  x: number
}

export type DayCurveModel = {
  points: DayCurvePoint[]
  chartPoints: DayCurveChartPoint[]
  hourlyMarkers: DayCurveHourlyMarker[]
  timeTicks: DayCurveTimeTick[]
  pathD: string
  areaPathD: string
  minC: number
  maxC: number
  yHighY: number
  yLowY: number
  sunriseMinute: number | null
  sunsetMinute: number | null
  sunriseLabel: string | null
  sunsetLabel: string | null
  nowMinute: number | null
  nowChart: DayCurveChartPoint | null
  lowC: number
  highC: number
  aria: string
}

export function isoDatePart(isoLocal: string): string {
  return isoLocal.slice(0, 10)
}

export function isoMinutesFromMidnight(isoLocal: string): number | null {
  const match = isoLocal.match(/T(\d{2}):(\d{2})/)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

function tempAtMinute(points: DayCurvePoint[], minute: number): number | null {
  if (points.length === 0) return null
  const sorted = [...points].sort((a, b) => a.minute - b.minute)
  if (minute <= sorted[0]!.minute) return sorted[0]!.tempC
  if (minute >= sorted[sorted.length - 1]!.minute) return sorted[sorted.length - 1]!.tempC

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!
    const b = sorted[i + 1]!
    if (minute >= a.minute && minute <= b.minute) {
      const span = b.minute - a.minute
      if (span <= 0) return a.tempC
      const t = (minute - a.minute) / span
      return a.tempC + (b.tempC - a.tempC) * t
    }
  }
  return sorted[sorted.length - 1]!.tempC
}

function collectHourlyForDay(
  hourly: HourlyForecastHour[],
  dayKey: string
): DayCurvePoint[] {
  const out: DayCurvePoint[] = []
  for (const hour of hourly) {
    if (!hour.time.startsWith(dayKey)) continue
    if (typeof hour.temperatureC !== "number" || !Number.isFinite(hour.temperatureC)) continue
    const minute = isoMinutesFromMidnight(hour.time)
    if (minute == null) continue
    out.push({ minute, tempC: hour.temperatureC })
  }
  return out.sort((a, b) => a.minute - b.minute)
}

function synthesizeDayCurve(
  lowC: number,
  highC: number,
  currentC: number | null,
  sunriseMinute: number | null,
  sunsetMinute: number | null,
  nowMinute: number | null
): DayCurvePoint[] {
  const rise = sunriseMinute ?? 6 * 60
  const set = sunsetMinute ?? 20 * 60
  const midday = Math.round((rise + set) / 2)
  const nightLow = lowC
  const dayHigh = highC

  const anchors: DayCurvePoint[] = [
    { minute: 0, tempC: nightLow },
    { minute: Math.max(0, rise - 60), tempC: nightLow },
    { minute: rise, tempC: nightLow + (dayHigh - nightLow) * 0.2 },
    { minute: midday, tempC: dayHigh },
    { minute: set, tempC: nightLow + (dayHigh - nightLow) * 0.25 },
    { minute: Math.min(DAY_MINUTES, set + 90), tempC: nightLow },
    { minute: DAY_MINUTES, tempC: nightLow },
  ]

  if (nowMinute != null && typeof currentC === "number" && Number.isFinite(currentC)) {
    anchors.push({ minute: nowMinute, tempC: currentC })
  }

  const byMinute = new Map<number, number>()
  for (const p of anchors) {
    byMinute.set(p.minute, p.tempC)
  }
  const sorted: DayCurvePoint[] = []
  byMinute.forEach((tempC, minute) => sorted.push({ minute, tempC }))
  return sorted.sort((a, b) => a.minute - b.minute)
}

function densifyPoints(points: DayCurvePoint[], steps = 120): DayCurvePoint[] {
  if (points.length < 2) return points
  const sorted = [...points].sort((a, b) => a.minute - b.minute)
  const dense: DayCurvePoint[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!
    const b = sorted[i + 1]!
    const segments = Math.max(4, Math.round((steps * (b.minute - a.minute)) / DAY_MINUTES))
    for (let s = 0; s <= segments; s++) {
      const t = s / segments
      dense.push({
        minute: a.minute + (b.minute - a.minute) * t,
        tempC: a.tempC + (b.tempC - a.tempC) * t,
      })
    }
  }
  return dense
}

/** Light moving-average pass — keeps endpoints, softens hourly zig-zags. */
export function smoothDayCurvePoints(points: DayCurvePoint[], passes = 2): DayCurvePoint[] {
  if (points.length < 4) return points
  let current = [...points].sort((a, b) => a.minute - b.minute)

  for (let pass = 0; pass < passes; pass++) {
    const next: DayCurvePoint[] = current.map((p, i) => {
      if (i === 0 || i === current.length - 1) return p
      const a = current[i - 1]!
      const b = current[i + 1]!
      return {
        minute: p.minute,
        tempC: a.tempC * 0.22 + p.tempC * 0.56 + b.tempC * 0.22,
      }
    })
    current = next
  }
  return current
}

function chartInner(
  width: number,
  height: number,
  padLeft: number,
  padRight: number,
  padTop: number,
  padBottom: number
) {
  return {
    innerW: width - padLeft - padRight,
    innerH: height - padTop - padBottom,
    padLeft,
    padTop,
    padBottom,
    chartBottom: height - padBottom,
  }
}

function minuteToX(minute: number, innerW: number, padLeft: number): number {
  return padLeft + (minute / DAY_MINUTES) * innerW
}

function tempToY(tempC: number, minC: number, maxC: number, innerH: number, padTop: number): number {
  const span = Math.max(maxC - minC, 1)
  return padTop + (1 - (tempC - minC) / span) * innerH
}

function toChartPoints(
  points: DayCurvePoint[],
  minC: number,
  maxC: number,
  width: number,
  height: number,
  padLeft: number,
  padRight: number,
  padTop: number,
  padBottom: number
): DayCurveChartPoint[] {
  const { innerW, innerH, padTop: top } = chartInner(width, height, padLeft, padRight, padTop, padBottom)
  return points.map((p) => ({
    x: minuteToX(p.minute, innerW, padLeft),
    y: tempToY(p.tempC, minC, maxC, innerH, top),
  }))
}

/** Catmull–Rom → cubic Bézier; lower tension = smoother, less overshoot at peaks. */
export function catmullRomPath(points: DayCurveChartPoint[], tension = 0.42): string {
  if (points.length === 0) return ""
  if (points.length === 1) return `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`

  const t = tension
  let d = `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p3 = points[Math.min(points.length - 1, i + 2)]!
    const cp1x = p1.x + ((p2.x - p0.x) / 6) * t
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * t
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * t
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * t
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

function areaPath(linePath: string, last: DayCurveChartPoint, first: DayCurveChartPoint, baselineY: number): string {
  return `${linePath} L ${last.x.toFixed(1)} ${baselineY.toFixed(1)} L ${first.x.toFixed(1)} ${baselineY.toFixed(1)} Z`
}

export type BuildDayCurveInput = {
  hourlyForecast: HourlyForecastHour[]
  observedAt: string | null
  sunrise: string | null
  sunset: string | null
  temperatureC: number | null
  todayLowC: number | null
  todayHighC: number | null
}

export function buildDayCurveModel(input: BuildDayCurveInput): DayCurveModel | null {
  const {
    hourlyForecast,
    observedAt,
    sunrise,
    sunset,
    temperatureC,
    todayLowC,
    todayHighC,
  } = input

  if (typeof todayLowC !== "number" || !Number.isFinite(todayLowC)) return null
  if (typeof todayHighC !== "number" || !Number.isFinite(todayHighC)) return null

  const dayKey =
    (observedAt && isoDatePart(observedAt)) ||
    (hourlyForecast[0]?.time && isoDatePart(hourlyForecast[0].time)) ||
    null
  if (!dayKey) return null

  let points = collectHourlyForDay(hourlyForecast, dayKey)
  const sunriseMinute = sunrise ? isoMinutesFromMidnight(sunrise) : null
  const sunsetMinute = sunset ? isoMinutesFromMidnight(sunset) : null
  const nowMinute = observedAt ? isoMinutesFromMidnight(observedAt) : null

  if (points.length < 6) {
    points = synthesizeDayCurve(
      todayLowC,
      todayHighC,
      temperatureC,
      sunriseMinute,
      sunsetMinute,
      nowMinute
    )
  } else if (nowMinute != null && typeof temperatureC === "number" && Number.isFinite(temperatureC)) {
    const hasNow = points.some((p) => Math.abs(p.minute - nowMinute) < 25)
    if (!hasNow) points.push({ minute: nowMinute, tempC: temperatureC })
    points.sort((a, b) => a.minute - b.minute)
  }

  const curveSource =
    points.length >= 12 ? smoothDayCurvePoints(points, 1) : smoothDayCurvePoints(densifyPoints(points), 1)
  const temps = curveSource.map((p) => p.tempC)
  const minC = Math.min(todayLowC, todayHighC, ...temps, temperatureC ?? todayLowC) - 1
  const maxC = Math.max(todayLowC, todayHighC, ...temps, temperatureC ?? todayHighC) + 1

  const { width, height, padLeft, padRight, padTop, padBottom } = DAY_CURVE_LAYOUT
  const inner = chartInner(width, height, padLeft, padRight, padTop, padBottom)
  const baselineY = inner.chartBottom

  const chartPoints = toChartPoints(
    curveSource,
    minC,
    maxC,
    width,
    height,
    padLeft,
    padRight,
    padTop,
    padBottom
  )
  const pathD = catmullRomPath(chartPoints, 0.5)
  const areaPathD =
    chartPoints.length > 0 ? areaPath(pathD, chartPoints[chartPoints.length - 1]!, chartPoints[0]!, baselineY) : ""

  const yHighY = tempToY(todayHighC, minC, maxC, inner.innerH, inner.padTop)
  const yLowY = tempToY(todayLowC, minC, maxC, inner.innerH, inner.padTop)

  const hourlyMarkers: DayCurveHourlyMarker[] = points.map((p) => ({
    minute: p.minute,
    tempC: p.tempC,
    x: minuteToX(p.minute, inner.innerW, padLeft),
    y: tempToY(p.tempC, minC, maxC, inner.innerH, inner.padTop),
    isNow: nowMinute != null && Math.abs(p.minute - nowMinute) < 35,
  }))

  const timeTicks: DayCurveTimeTick[] = MSN_TIME_TICKS.map((tick) => ({
    minute: tick.minute,
    label: tick.label,
    x: minuteToX(tick.minute, inner.innerW, padLeft),
  }))

  let nowChart: DayCurveChartPoint | null = null
  if (nowMinute != null) {
    const nowTemp = tempAtMinute(points, nowMinute)
    if (nowTemp != null) {
      nowChart = {
        x: minuteToX(nowMinute, inner.innerW, padLeft),
        y: tempToY(nowTemp, minC, maxC, inner.innerH, inner.padTop),
      }
    }
  }

  const sunriseLabel = formatClockTime(sunrise)
  const sunsetLabel = formatClockTime(sunset)

  return {
    points: curveSource,
    chartPoints,
    hourlyMarkers,
    timeTicks,
    pathD,
    areaPathD,
    minC,
    maxC,
    yHighY,
    yLowY,
    sunriseMinute,
    sunsetMinute,
    sunriseLabel,
    sunsetLabel,
    nowMinute,
    nowChart,
    lowC: todayLowC,
    highC: todayHighC,
    aria: `24 hour temperature curve. Low ${Math.round(todayLowC)}, high ${Math.round(todayHighC)}.${sunriseLabel ? ` Sunrise ${sunriseLabel}.` : ""}${sunsetLabel ? ` Sunset ${sunsetLabel}.` : ""}`,
  }
}

export function formatCurveTempLabel(celsius: number, units: "c" | "f"): string {
  if (units === "f") return `${Math.round(celsiusToFahrenheit(celsius))}°`
  return `${Math.round(celsius)}°`
}

export function minuteToChartX(
  minute: number,
  width: number,
  padLeft: number = DAY_CURVE_LAYOUT.padLeft
): number {
  const padRight = DAY_CURVE_LAYOUT.padRight
  const innerW = width - padLeft - padRight
  return minuteToX(minute, innerW, padLeft)
}
