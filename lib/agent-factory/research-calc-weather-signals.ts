export type CalcWeatherResearchSignal = {
  id: string
  title: string
  priority: number
  command: string
  extraLines?: string[]
}

/**
 * Deterministic, code-only “research” for `/calculator` + `/weather` + `/api/weather`.
 * No network calls; safe to run in CI. Extend with new checks as the app grows.
 */
export function collectCalcWeatherSignals(input: {
  calculatorPageSource: string
  weatherPageSource: string
  weatherRouteSource: string
  calculatorHasServerLayout: boolean
}): CalcWeatherResearchSignal[] {
  const out: CalcWeatherResearchSignal[] = []
  const calc = input.calculatorPageSource
  const wx = input.weatherPageSource
  const api = input.weatherRouteSource

  if (!input.calculatorHasServerLayout && !/\bmetadata\b/.test(calc)) {
    out.push({
      id: "FACTORY_R_CALC_ROUTE_METADATA_V1",
      title: "Calculator: route metadata (title/description) for /calculator",
      priority: 620,
      command: "pnpm -s factory:implement FACTORY_R_CALC_ROUTE_METADATA_V1",
      extraLines: [
        "- Notes: Research signal — page is client-only; add `app/calculator/layout.tsx` with `export const metadata` (tokens only).",
      ],
    })
  }

  if (!/\b(onKeyDown|onKeyUp|keydown)\b/i.test(calc)) {
    out.push({
      id: "FACTORY_R_CALC_KEYBOARD_A11Y_V1",
      title: "Calculator: keyboard support and visible focus for controls",
      priority: 580,
      command: "pnpm -s factory:implement FACTORY_R_CALC_KEYBOARD_A11Y_V1",
      extraLines: [
        "- Notes: Research signal — no key handlers found; add digits/operators via keyboard where reasonable (DS tokens, a11y).",
      ],
    })
  }

  if (/40\.7128/.test(api) && /-74\.006/.test(api)) {
    out.push({
      id: "FACTORY_R_WEATHER_API_LOCATION_V1",
      title: "Weather API: accept location (lat/lon or city) instead of fixed coordinates",
      priority: 640,
      command: "pnpm -s factory:implement FACTORY_R_WEATHER_API_LOCATION_V1",
      extraLines: [
        "- Notes: Research signal — Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults.",
      ],
    })
  }

  const wxPageBody = wx.split("export default async function WeatherPage")[1] ?? ""
  if (wxPageBody && !/\bdata\.error\b/.test(wxPageBody) && !/'error'\s+in\s+data/.test(wxPageBody)) {
    out.push({
      id: "FACTORY_R_WEATHER_ERROR_STATE_V1",
      title: "Weather page: user-visible error when /api/weather fails or returns an error field",
      priority: 570,
      command: "pnpm -s factory:implement FACTORY_R_WEATHER_ERROR_STATE_V1",
      extraLines: [
        "- Notes: Research signal — `loadWeatherJson` can return `{ error: ... }` but the page body never branches on it; add clear error UI (DS tokens).",
      ],
    })
  }

  return out
}
