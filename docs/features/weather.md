# Weather feature (`/weather`)

> **Purpose:** Human-readable overview of routes, APIs, search UX, and where agent policy lives for the weather page on cpdeol.com.

## Routes

| URL | What users see |
|-----|----------------|
| `/weather` | Default location (from query or site default) + search bar |
| `/weather?lat=…&lon=…&city=…` | Forecast for coordinates; `city` improves labels and bookmarks |
| `/weather?city=Toronto` | Resolve by place name (server geocode) |
| `/weather?compare=1` | Pick two locations side by side |
| `/weather?compare=1&lat=…&lon=…&lat2=…&lon2=…` | Side-by-side comparison |

Page is **noindex** (tool page, not SEO landing).

## APIs (Route Handlers)

| Endpoint | Use |
|----------|-----|
| `GET /api/weather` | Current conditions + forecast JSON (`lat`/`lon` or `city`) |
| `GET /api/weather/locations?q=` | Autocomplete for the search dropdown (Open-Meteo geocoding) |
| `GET /api/weather/climate` | Monthly normals (loaded client-side for climate section) |

**Server rendering:** `app/weather/page.tsx` calls `getWeatherData()` in `lib/weather-service.ts` directly — it does **not** fetch these handlers over HTTP (avoids dev self-fetch bugs).

**Client:** Autocomplete and refresh use `fetch('/api/weather…')` from `"use client"` components.

## Search UX (single location)

The bar is one **compound control**:

1. **Place | Coords** toggle on the left (same pill style as **°C | °F** in the toolbar).
2. **Search field** on the right (icon, autocomplete dropdown).
3. **Recent** chips under the bar (localStorage, up to 5).

**How to search (no Submit button):**

- Type and click a suggestion, or press **Enter** (uses top match when available).
- Open the dropdown (focus) for **Use my current location** or recent places when the field is empty.
- Recents in the dropdown hide while typing; up to three show when empty.
- **Coords** mode: enter lat/lon and press **Enter** in either field.

Compare mode (`/weather?compare=1`) uses two labeled fields and a **Compare** button — see `WeatherCompareSearch`.

## Key files

| Area | Path |
|------|------|
| Page | `app/weather/page.tsx` |
| Search bar | `components/weather/WeatherSearch.tsx` |
| Shared combobox | `components/weather/LocationSearchField.tsx` |
| Styles | `components/weather/weather-search-ui.ts` |
| Server loader | `lib/weather-service.ts` |
| URL helpers | `lib/weather-payload.ts` |
| Recents | `lib/weather-recent.ts` |

## Agent / contributor policy

Canonical guardrails (do-not-regress list, URL sync pitfall, tests):

- **`.claude/rules/weather-search.md`**
- Summaries also in `docs/GOVERNANCE.md` and `CLAUDE.md` (read-when-relevant table)

## Tests

```bash
# Unit (search + recents + payload helpers)
pnpm exec vitest run components/weather/WeatherSearch.test.tsx lib/weather-recent.test.ts lib/weather-payload.test.ts

# E2E smoke (includes /weather search flows)
pnpm e2e:smoke
# or full verify bar:
pnpm verify
```

## Data source

Forecast data via [Open-Meteo](https://open-meteo.com/) (attribution link on page). Mock mode: `WEATHER_USE_MOCK=1` in env for local/testing.
