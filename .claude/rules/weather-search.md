# Weather search (`/weather`)

> **Purpose:** Architecture and guardrails for the single-location search bar, compare search, and related client hooks — read when editing `components/weather/*Search*` or `/weather` lookup UX.

**Human overview:** `docs/features/weather.md`. **Cursor:** `.cursor/rules/weather-search.mdc` points here (do not edit the `.mdc` copy; change this file).

## Data loading (server)

- **Do not** HTTP-fetch `/api/weather` from `app/weather/page.tsx`. Use `getWeatherData` in `lib/weather-service.ts` (see `nextjs-pitfalls.md`).
- **Do** use `fetch('/api/weather/locations')` and `fetch('/api/weather')` from **client** components only (autocomplete, live refresh).

## Component map

| Piece | Role |
|-------|------|
| `WeatherSearch` | Single-location bar: compound field + recents chips |
| `WeatherCompareSearch` | Compare setup (two `LocationSearchField`s; still has **Compare** submit) |
| `WeatherSearchModeToggle` | **Place \| Coords** — attached left on single bar; standalone style matches `WeatherUnitsToggle` |
| `LocationSearchField` | Shared combobox (autocomplete, keyboard, optional leading icon) |
| `use-location-suggestions.ts` | Debounced `/api/weather/locations` + API error text |
| `WeatherSearchSuggestions` | Dropdown listbox (sections, lucide icons) |
| `weather-search-ui.ts` | Shared Tailwind classes for bar, input, dropdown, options |
| `WeatherRecentChips` | Recents row **under** the search bar |
| `WeatherPageToolbar` | Refresh, **°C \| °F** (`WeatherUnitsToggle`), copy link — **no** recents here |
| `lib/weather-recent.ts` | `recentForLocationDropdown()` — hide recents while typing; cap at 3 in dropdown |
| `lib/weather-payload.ts` | `navigateToWeatherCoords`, `parseWeatherCoords`, `weatherSearchParamsKey` |

## Single-location search UX (do not regress)

1. **No Search submit button** — Google-style: pick a suggestion, or **Enter** (top match, then city-only fallback via `onCommitSearch`).
2. **Navigation** — Prefer `navigateToWeatherCoords(router, lat, lon, { city })` whenever a label is known (suggestions, recents, geolocation).
3. **URL ↔ input sync** — Initialize from `useSearchParams()`, then sync in `useEffect` keyed on **`weatherSearchParamsKey(searchParams)`** only. Do **not** put `searchParams` in the dependency array (new object identity each render resets typed text).
4. **Dropdown recents** — Only when query is empty; use `recentForLocationDropdown(recent, query)`.
5. **Geolocation** — One control in the dropdown (“Use my current location”). No duplicate “My location” button beside the field.
6. **Layout** — `Place \| Coords` is **attached** on the left of the compound bar (shared border/focus ring with the input). Compare link stays in the header row, not inside the bar.
7. **Styling** — Design tokens only (`design-system.md`). Main bar uses `showLeadingIcon` (lucide `Search` / `Loader2`). No hardcoded hex.

## Compare mode

- Reuses `LocationSearchField` with visible labels; does not use the attached mode toggle or `weather-search-ui` compound bar.
- Submit: **Compare** button (explicit two-location commit).

## Tests

| Scope | File |
|-------|------|
| Unit | `components/weather/WeatherSearch.test.tsx`, `lib/weather-recent.test.ts`, `lib/weather-payload.test.ts` |
| E2E | `e2e/goal-smoke.spec.ts` (`/weather`, compare, search + Enter flow) |

After search UX changes: `pnpm exec vitest run components/weather/WeatherSearch.test.tsx lib/weather-recent.test.ts` and relevant e2e smoke lines.
