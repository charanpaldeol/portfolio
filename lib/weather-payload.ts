// Purpose: Parse /api/weather JSON into a typed WeatherSnapshot for page components.
import { weatherConditionFromCode } from "@/lib/weather-code"
import type {
  AirQualitySnapshot,
  ClimateExtremes,
  DailyForecastDay,
  HourlyForecastHour,
  MarineSnapshot,
  MoonInfo,
  PastWeekDay,
  WeatherAlert,
  WeatherSnapshot,
} from "@/lib/weather-types"

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function readBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null
}

function readAirQuality(value: unknown): AirQualitySnapshot {
  if (!value || typeof value !== "object") {
    return {
      usAqi: null,
      europeanAqi: null,
      pm25: null,
      pm10: null,
      ozone: null,
      nitrogenDioxide: null,
      carbonMonoxide: null,
      sulphurDioxide: null,
      label: "—",
    }
  }
  const record = value as Record<string, unknown>
  return {
    usAqi: readNumber(record.usAqi),
    europeanAqi: readNumber(record.europeanAqi),
    pm25: readNumber(record.pm25),
    pm10: readNumber(record.pm10),
    ozone: readNumber(record.ozone),
    nitrogenDioxide: readNumber(record.nitrogenDioxide),
    carbonMonoxide: readNumber(record.carbonMonoxide),
    sulphurDioxide: readNumber(record.sulphurDioxide),
    label: typeof record.label === "string" ? record.label : "—",
  }
}

function readDailyForecast(value: unknown): DailyForecastDay[] {
  if (!Array.isArray(value)) return []
  return value.filter((day): day is DailyForecastDay => {
    return (
      !!day &&
      typeof day === "object" &&
      typeof (day as DailyForecastDay).date === "string" &&
      typeof (day as DailyForecastDay).weekday === "string" &&
      typeof (day as DailyForecastDay).condition === "object"
    )
  })
}

function readHourlyForecast(value: unknown): HourlyForecastHour[] {
  if (!Array.isArray(value)) return []
  return value.filter((hour): hour is HourlyForecastHour => {
    return (
      !!hour &&
      typeof hour === "object" &&
      typeof (hour as HourlyForecastHour).time === "string" &&
      typeof (hour as HourlyForecastHour).condition === "object"
    )
  })
}

function readLocationSource(value: unknown): "gps" | "network" | null {
  return value === "gps" || value === "network" ? value : null
}

function readClimateNormals(value: unknown): ClimateExtremes | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  const hottest = record.hottest
  const coldest = record.coldest
  if (!hottest || !coldest || typeof hottest !== "object" || typeof coldest !== "object") return null

  const readMonth = (month: Record<string, unknown>) => ({
    month: readNumber(month.month) ?? 0,
    monthName: typeof month.monthName === "string" ? month.monthName : "—",
    meanC: readNumber(month.meanC) ?? 0,
    highC: readNumber(month.highC) ?? 0,
    lowC: readNumber(month.lowC) ?? 0,
  })

  const monthlyNormals = Array.isArray(record.monthlyNormals)
    ? record.monthlyNormals
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map(readMonth)
    : []

  const onThisDayRaw = record.onThisDay
  const onThisDay =
    onThisDayRaw && typeof onThisDayRaw === "object"
      ? {
          monthDayLabel: typeof (onThisDayRaw as Record<string, unknown>).monthDayLabel === "string"
            ? ((onThisDayRaw as Record<string, unknown>).monthDayLabel as string)
            : "Today",
          avgHighC: readNumber((onThisDayRaw as Record<string, unknown>).avgHighC) ?? 0,
          avgLowC: readNumber((onThisDayRaw as Record<string, unknown>).avgLowC) ?? 0,
          avgPrecipMm: readNumber((onThisDayRaw as Record<string, unknown>).avgPrecipMm) ?? 0,
          sampleYears: readNumber((onThisDayRaw as Record<string, unknown>).sampleYears) ?? 0,
        }
      : null

  const currentMonthRaw = record.currentMonth
  const currentMonth =
    currentMonthRaw && typeof currentMonthRaw === "object"
      ? readMonth(currentMonthRaw as Record<string, unknown>)
      : null

  return {
    periodLabel: typeof record.periodLabel === "string" ? record.periodLabel : "1991–2020",
    hottest: readMonth(hottest as Record<string, unknown>),
    coldest: readMonth(coldest as Record<string, unknown>),
    currentMonth,
    monthlyNormals,
    onThisDay,
  }
}

function readAlerts(value: unknown): WeatherAlert[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is WeatherAlert => {
    return (
      !!item &&
      typeof item === "object" &&
      typeof (item as WeatherAlert).id === "string" &&
      typeof (item as WeatherAlert).event === "string"
    )
  })
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

function readPastWeek(value: unknown): PastWeekDay[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is PastWeekDay => {
    return !!item && typeof item === "object" && typeof (item as PastWeekDay).date === "string"
  })
}

function readMarine(value: unknown): MarineSnapshot | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  return {
    waveHeightM: readNumber(record.waveHeightM),
    wavePeriodSec: readNumber(record.wavePeriodSec),
    waveDirectionDeg: readNumber(record.waveDirectionDeg),
    seaSurfaceTempC: readNumber(record.seaSurfaceTempC),
  }
}

function readMoon(value: unknown): MoonInfo | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  if (typeof record.phaseLabel !== "string" || typeof record.icon !== "string") return null
  return {
    phaseLabel: record.phaseLabel,
    icon: record.icon,
    illuminationPercent: readNumber(record.illuminationPercent) ?? 0,
  }
}

export function parseWeatherPayload(data: Record<string, unknown>): WeatherSnapshot | null {
  if (typeof data.error === "string" && data.error.trim() !== "") return null
  if (typeof data.lat !== "number" || typeof data.lon !== "number") return null

  const weatherCode =
    readNumber(data.weatherCode) ??
    readNumber((data.current as { weather_code?: number } | undefined)?.weather_code) ??
    0
  const conditionFromApi = data.condition as { label?: string; icon?: string } | undefined
  const condition =
    typeof conditionFromApi?.label === "string" && typeof conditionFromApi?.icon === "string"
      ? { label: conditionFromApi.label, icon: conditionFromApi.icon }
      : weatherConditionFromCode(weatherCode)

  const isDay = readBoolean(data.isDay)
  const nightCondition =
    isDay === false && condition.icon === "☀️"
      ? { label: "Clear night", icon: "🌙" }
      : isDay === false && condition.icon === "🌤️"
        ? { label: "Mainly clear", icon: "🌙" }
        : condition

  return {
    city: typeof data.city === "string" ? data.city : "",
    lat: data.lat,
    lon: data.lon,
    temperatureC:
      readNumber(data.temperatureC) ??
      readNumber((data.current as { temperature_2m?: number } | undefined)?.temperature_2m),
    weatherCode,
    condition: nightCondition,
    feelsLikeC: readNumber(data.feelsLikeC),
    wetBulbC: readNumber(data.wetBulbC),
    humidityPercent: readNumber(data.humidityPercent),
    windSpeedKmh: readNumber(data.windSpeedKmh),
    windDirectionDeg: readNumber(data.windDirectionDeg),
    windGustKmh: readNumber(data.windGustKmh),
    dewPointC: readNumber(data.dewPointC),
    precipitationMm: readNumber(data.precipitationMm),
    precipitationSumTodayMm: readNumber(data.precipitationSumTodayMm),
    cloudCoverPercent: readNumber(data.cloudCoverPercent),
    pressureHpa: readNumber(data.pressureHpa),
    visibilityM: readNumber(data.visibilityM),
    uvIndexMax: readNumber(data.uvIndexMax),
    sunshineDurationSec: readNumber(data.sunshineDurationSec),
    daylightDurationSec: readNumber(data.daylightDurationSec),
    sunrise: typeof data.sunrise === "string" ? data.sunrise : null,
    sunset: typeof data.sunset === "string" ? data.sunset : null,
    todayHighC: readNumber(data.todayHighC),
    todayLowC: readNumber(data.todayLowC),
    elevationM: readNumber(data.elevationM),
    population: readNumber(data.population),
    locationSource: readLocationSource(data.locationSource),
    airQuality: readAirQuality(data.airQuality),
    dailyForecast: readDailyForecast(data.dailyForecast),
    hourlyForecast: readHourlyForecast(data.hourlyForecast),
    pastWeek: readPastWeek(data.pastWeek),
    alerts: readAlerts(data.alerts),
    safetyNotices: readStringArray(data.safetyNotices),
    marine: readMarine(data.marine),
    moon: readMoon(data.moon),
    observedAt: typeof data.observedAt === "string" ? data.observedAt : null,
    timezone: typeof data.timezone === "string" ? data.timezone : null,
    timezoneAbbreviation:
      typeof data.timezoneAbbreviation === "string" ? data.timezoneAbbreviation : null,
    source: typeof data.source === "string" ? data.source : "unknown",
    climateNormals: readClimateNormals(data.climateNormals),
    isDay,
    temperatureAnomalyC: readNumber(data.temperatureAnomalyC),
    isDefaultLocation: data.isDefaultLocation === true,
  }
}

export function mergeClimateIntoSnapshot(
  snapshot: WeatherSnapshot,
  climateNormals: ClimateExtremes | null,
  temperatureAnomalyC: number | null
): WeatherSnapshot {
  return {
    ...snapshot,
    climateNormals,
    temperatureAnomalyC,
  }
}

export function buildWeatherApiQuery(sp: Record<string, string | string[] | undefined>): string {
  const qs = new URLSearchParams()
  for (const [key, val] of Object.entries(sp)) {
    if (key === "compare" || key === "units") continue
    if (typeof val === "string" && val.trim() !== "") qs.set(key, val)
    else if (Array.isArray(val) && typeof val[0] === "string" && val[0].trim() !== "") qs.set(key, val[0])
  }
  const s = qs.toString()
  return s ? `?${s}` : ""
}

function readSearchParamValue(
  sp: Record<string, string | string[] | undefined>,
  key: string
): string | null {
  const val = sp[key]
  if (typeof val === "string" && val.trim() !== "") return val
  if (Array.isArray(val) && typeof val[0] === "string" && val[0].trim() !== "") return val[0]
  return null
}

export function compareWeatherQueryFromSearchParams(
  sp: Record<string, string | string[] | undefined>,
  slot: "a" | "b"
) {
  if (slot === "a") {
    return {
      lat: readSearchParamValue(sp, "lat") ?? readSearchParamValue(sp, "latitude") ?? undefined,
      lon: readSearchParamValue(sp, "lon") ?? readSearchParamValue(sp, "longitude") ?? undefined,
      city: readSearchParamValue(sp, "city") ?? readSearchParamValue(sp, "q") ?? undefined,
      approx: readSearchParamValue(sp, "approx") ?? undefined,
    }
  }

  return {
    lat: readSearchParamValue(sp, "lat2") ?? readSearchParamValue(sp, "latitude2") ?? undefined,
    lon: readSearchParamValue(sp, "lon2") ?? readSearchParamValue(sp, "longitude2") ?? undefined,
    city: readSearchParamValue(sp, "city2") ?? readSearchParamValue(sp, "q2") ?? undefined,
  }
}

export function buildCompareLocationQuery(
  sp: Record<string, string | string[] | undefined>,
  slot: "a" | "b"
): string {
  const qs = new URLSearchParams()
  const query = compareWeatherQueryFromSearchParams(sp, slot)
  if (query.lat) qs.set("lat", query.lat)
  if (query.lon) qs.set("lon", query.lon)
  if (query.city) qs.set("city", query.city)
  if (slot === "a" && query.approx === "1") qs.set("approx", "1")

  const s = qs.toString()
  return s ? `?${s}` : ""
}

export function buildCompareSwapHref(sp: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams()
  params.set("compare", "1")

  const latA = readSearchParamValue(sp, "lat") ?? readSearchParamValue(sp, "latitude")
  const lonA = readSearchParamValue(sp, "lon") ?? readSearchParamValue(sp, "longitude")
  const cityA = readSearchParamValue(sp, "city") ?? readSearchParamValue(sp, "q")
  const latB = readSearchParamValue(sp, "lat2") ?? readSearchParamValue(sp, "latitude2")
  const lonB = readSearchParamValue(sp, "lon2") ?? readSearchParamValue(sp, "longitude2")
  const cityB = readSearchParamValue(sp, "city2") ?? readSearchParamValue(sp, "q2")
  const approx = readSearchParamValue(sp, "approx")

  if (latB) params.set("lat", latB)
  if (lonB) params.set("lon", lonB)
  if (cityB) params.set("city", cityB)
  if (latA) params.set("lat2", latA)
  if (lonA) params.set("lon2", lonA)
  if (cityA) params.set("city2", cityA)
  if (approx === "1") params.set("approx", "1")

  return `/weather?${params.toString()}`
}

export function isCompareMode(sp: Record<string, string | string[] | undefined>): boolean {
  if (readParam(sp, "compare") === "1") return true
  const lat2 = readParam(sp, "lat2") ?? readParam(sp, "latitude2")
  const lon2 = readParam(sp, "lon2") ?? readParam(sp, "longitude2")
  const city2 = readParam(sp, "city2") ?? readParam(sp, "q2")
  return (!!lat2 && !!lon2) || !!city2
}

function readParam(sp: Record<string, string | string[] | undefined>, key: string): string | null {
  return readSearchParamValue(sp, key)
}

export function hasCompareLocations(sp: Record<string, string | string[] | undefined>): boolean {
  const aLat = readParam(sp, "lat") ?? readParam(sp, "latitude")
  const aLon = readParam(sp, "lon") ?? readParam(sp, "longitude")
  const aCity = readParam(sp, "city") ?? readParam(sp, "q")
  const bLat = readParam(sp, "lat2") ?? readParam(sp, "latitude2")
  const bLon = readParam(sp, "lon2") ?? readParam(sp, "longitude2")
  const bCity = readParam(sp, "city2") ?? readParam(sp, "q2")

  const hasA = (!!aLat && !!aLon) || !!aCity
  const hasB = (!!bLat && !!bLon) || !!bCity
  return hasA && hasB
}

export function buildCompareHrefFromSingle(lat: number, lon: number, city?: string): string {
  const params = new URLSearchParams()
  params.set("compare", "1")
  params.set("lat", lat.toFixed(4))
  params.set("lon", lon.toFixed(4))
  if (city?.trim()) params.set("city", city.trim())
  return `/weather?${params.toString()}`
}

export function buildCompareHrefFromSearchParams(sp: URLSearchParams, fallback = "/weather?compare=1"): string {
  const params = new URLSearchParams()
  params.set("compare", "1")
  const lat = sp.get("lat") ?? sp.get("latitude")
  const lon = sp.get("lon") ?? sp.get("longitude")
  const city = sp.get("city") ?? sp.get("q")
  if (lat && lon) {
    params.set("lat", lat)
    params.set("lon", lon)
    if (city) params.set("city", city)
    return `/weather?${params.toString()}`
  }
  return fallback
}

export function navigateToWeatherCoords(
  router: { push: (href: string) => void },
  lat: number,
  lon: number,
  options?: { approximate?: boolean }
): void {
  const params = new URLSearchParams()
  params.set("lat", lat.toFixed(4))
  params.set("lon", lon.toFixed(4))
  if (options?.approximate) params.set("approx", "1")
  router.push(`/weather?${params.toString()}`)
}

export function weatherPageTitle(snapshot: WeatherSnapshot | null): string {
  if (!snapshot?.city.trim()) return "Weather"
  const temp =
    typeof snapshot.temperatureC === "number" && Number.isFinite(snapshot.temperatureC)
      ? `${Math.round(snapshot.temperatureC)}°C`
      : null
  const city = snapshot.city.split(",")[0]?.trim() || snapshot.city
  return temp ? `${city} — ${temp}` : city
}
