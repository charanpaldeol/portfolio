# Backlog — cpdeol.com

**Factory:** **Incremental product work** on calculator + weather + nav (`goal_revision` **`factory-calc-weather-incremental-2026-05`**). Source of truth: **`agents/factory-goal-spec.json`**, **`agents/factory-roadmap.json`**, and **`agents/FACTORY_GOAL.md`**.

Rows below marked *historical* belong to the earlier verification sprint; the **live queue** follows the seven roadmap IDs in `factory-roadmap.json` (weather location search, error UX, calc polish, a11y/keyboard, API query params, calc metadata, nav discoverability).

## Factory research intake

ARCHIVED: All research intake items removed on 2026-05-04. The factory is focused on executing the 7 roadmap items in `agents/factory-roadmap.json`:
- FACTORY_WEATHER_LOCATION_SEARCH_V1 (done)
- FACTORY_WEATHER_ERROR_UX_V1 (queued)
- FACTORY_CALC_UI_POLISH_V1 (queued)
- FACTORY_CALC_A11Y_KEYBOARD_V1 (queued)
- FACTORY_WEATHER_API_QUERY_V1 (queued)
- FACTORY_CALC_ROUTE_METADATA_V1 (queued)
- FACTORY_NAV_CALC_WEATHER_DISCOVER_V1 (queued)

To re-enable research proposals, either:
1. Set env var `FACTORY_RESEARCH_CALC_WEATHER=1` before running `factory:research:once`
2. Ensure Ollama is running locally (preferred over Claude/OpenAI for cost/speed)
3. Or set `OPENAI_API_KEY` for cloud LLM fallback

### WEATHER_API_QUERY_V2 — Add optional query params to weather API
- Priority: 850
- Command: pnpm -s factory:implement WEATHER_API_QUERY_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWTHING_V1 — Search or enter location (city text or lat/lon) and load forecast
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_R_NEWTHING_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWUX_V1 — Add missing UX feature
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_R_NEWUX_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWLOCATION_V2 — Improve search functionality for location input
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_R_NEWLOCATION_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_WEATHER_API_QUERY_V3 — Add optional query params to weather API
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_R_WEATHER_API_QUERY_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### YOUR_ID_V1 — Short imperative title
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_FIXVERIFYFAILURESV2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWTHING_V2 — Fix search or enter location functionality
- Priority: 600
- Command: pnpm -s factory:implement FACTORY_R_NEWTHING_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_FAILURES_V1 — Fix verify failures
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_VERIFY_FAILURES_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWTHING2_V1 — Improve error states
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_R_NEWTHING2_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWTHING3_V1 — Improve weather API error states
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_R_NEWTHING3_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V2 — Improve keyboard support
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V2 — Add optional query params to weather API
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V3 — Improve keyboard support for calculator
- Priority: 600
- Command: pnpm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_CALCULATOR_V14 — Fix calculator page at /calculator
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_VERIFY_CALCULATOR_V14
- Notes: LLM research (remediation (goal evaluation + repo signals))

### WEATHER_API_QUERY_V3 — Add optional query params to weather API with Open-Meteo URL
- Priority: 700
- Command: pnpm -s factory:implement WEATHER_API_QUERY_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### YOUR_ID_V2 — Short imperative title
- Priority: 500
- Command: pnpm -s factory:implement YOUR_ID_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V3 — Add optional query params to weather API with Open-Meteo URL
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V4 — Improve keyboard support for calculator
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_NEWTHING_V1 — Search or enter location (city text or lat/lon) and load forecast
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_NEWTHING_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_NEW_ROUTE_METADATA_V1 — Fix route metadata verification
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_NEW_ROUTE_METADATA_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_NEWUX_V1 — New UX Task
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_NEWUX_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V5 — Improve keyboard support for calculator
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V5
- Notes: LLM research (remediation (goal evaluation + repo signals))

### WEATHER_API_QUERY_V4 — Add optional query params to weather API with Open-Meteo URL
- Priority: 750
- Command: pnpm -s factory:implement WEATHER_API_QUERY_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### YOUR_ID_V3 — Short imperative title
- Priority: 580
- Command: pnm -s factory:implement YOUR_ID_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V6 — Improve keyboard support for calculator
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V5 — Add optional query params to weather API with Open-Meteo URL
- Priority: 950
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V5
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_NEWUX_V2 — New UX Task
- Priority: 800
- Command: pnpm -s factory:implement FACTORY_NEWUX_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V7 — Improve keyboard support for calculator
- Priority: 700
- Command: pnpm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V7
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V8 — Improve keyboard support for calculator
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V8
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWUX_V2 — New UX Task
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_R_NEWUX_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V9 — Improve keyboard support for calculator
- Priority: 600
- Command: pnpm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V9
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V6 — Add optional query params to weather API with Open-Meteo URL
- Priority: 550
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_NEW_ROUTE_METADATA_V2 — Fix route metadata verification
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_NEW_ROUTE_METADATA_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_CALC_KEYBOARD_A11Y_V2 — Calculator: keyboard support and visible focus for controls
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_R_CALC_KEYBOARD_A11Y_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_WEATHER_V3 — Verification: weather API + /weather page
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_VERIFY_WEATHER_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_UI_POLISH_V2 — Calculator: clearer layout, spacing, and control grouping on /calculator
- Priority: 580
- Command: pnm -s factory:implement FACTORY_CALC_UI_POLISH_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V4 — Add optional query params to weather API with Open-Meteo URL
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_WEATHER_API_V1 — Verify weather API works with new location query params
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_VERIFY_WEATHER_API_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V1 — Improve accessibility for weather location search
- Priority: 600
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V2 — Fix verify calculator failures in new tasks
- Priority: 700
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_CALCULATOR_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_VERIFY_ERROR_STATE_V1 — Verify error states for weather API and calculator
- Priority: 800
- Command: pnpm -s factory:implement FACTORY_Fix_WEATHER_API_QUERY_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V5 — Fix verify calculator failures in new tasks
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_FixVerificationFailuresInNewTasks
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V2 — Improve accessibility for weather location search
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V3 — Fix verify calculator failures in new tasks
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_CALCULATOR_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V4 — Fix verify calculator failures in new tasks
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_CALCULATOR_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_LOCATION_SEARCH_V2 — Weather page: search or enter location (city text or lat/lon) and load forecast
- Priority: 800
- Command: pnpm -s factory:implement FACTORY_WEATHER_LOCATION_SEARCH_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V3 — Improve accessibility for weather location search
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V4 — Improve accessibility for weather location search
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V1 — Fix verify failures in weather API and calculator implementations
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V1 — Improve accessibility of error states for weather API
- Priority: 950
- Command: pnpm -s factory:implement FACTORYImproveA11yForErrorStatesV3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V4 — Improve accessibility of error states for weather API
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_A11Y_ERROR_STATE_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_A11Y_KEYBOARD_V10 — Improve keyboard support for calculator
- Priority: 700
- Command: pnm -s factory:implement FACTORY_CALC_A11Y_KEYBOARD_V10
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V7 — Add optional query params to weather API with Open-Meteo URL
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_Fix_verify_failure_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V2 — Fix verify failures in weather API and calculator implementations
- Priority: 800
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY — fix_verify_failure_V3 — Fix verify failures in weather API and calculator implementations
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_fix_verify_failure_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V8 — Add optional query params to weather API with Open-Meteo URL
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V8
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V6 — Fix calculator page at /calculator (specific edge case)
- Priority: 600
- Command: pnpm -s factory:implement FACTORY_FIXVERIFY_CALCULATOR_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V3 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 550
- Command: pnpm -s factory:implement FACTORY_FIXVERIFY_FAILURES_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_NEWUX_V3 — New UX Task: Enhance calculator UI for better user experience
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_NEWUX_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWTHING_V4 — Improve search functionality
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_R_NEWTHING_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V5 — Enhance weather location search accessibility
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V5
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V6 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 950
- Command: pnpm -s factory:implement FACTORY_FIXVERIFY_FAILURES_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V7 — Fix calculator page at /calculator (specific edge case)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIXVERIFY_CALCULATOR_V7
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V8 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V8
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V9 — Add optional query params to weather API with Open-Meteo URL
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V7
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V6 — Enhance weather location search accessibility
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWLOCATION_V4 — Search or enter location (city text or lat/lon) and load forecast
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_R_NEWLOCATION_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V10 — Add optional query params to weather API with Open-Meteo URL
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V10
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V7 — Enhance weather location search accessibility
- Priority: 620
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V7
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V8 — Enhance accessibility for weather location search
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V8
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V9 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V9
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_UI_POLISH_V3 — Enhance calculator UI for better user experience
- Priority: 700
- Command: pnpm -s factory:implement FACTORY_CALC_UI_POLISH_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V5 — Improve accessibility of error states for weather API
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_A11Y_ERROR_STATE_V5
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V11 — Add optional query params to weather API with Open-Meteo URL
- Priority: 600
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V11
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V10 — Fix verify calculator failures in new tasks
- Priority: 800
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_CALCULATOR_V10
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V9 — Enhance weather location search accessibility
- Priority: 600
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V9
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V12 — Add optional query params to weather API with Open-Meteo URL
- Priority: 550
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V12
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_NEWUX_V4 — New UX Task: Enhance calculator UI for better user experience
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_NEWUX_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V11 — Fix verify calculator failures in new tasks
- Priority: 800
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_CALCULATOR_V11
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V6 — Improve accessibility of error states for weather API
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_A11Y_ERROR_STATE_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_WEATHER_API_LOCATION_V4 — Accept location (lat/lon or city) instead of fixed coordinates
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_R_WEATHER_API_LOCATION_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V10 — Fix verify failures
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V10
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V7 — Improve accessibility of error states
- Priority: 950
- Command: pnpm -s factory:implement FACTORY_A11Y_ERROR_STATE_V7
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V12 — Fix verify calculator failures in new tasks
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_FIXVERIFY_CALCULATOR_V12
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V10 — Enhance weather location search accessibility
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_A11Y_WEATHER_LOCATION_SEARCH_V10
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V8 — Improve error states for weather API
- Priority: 700
- Command: pnpm -s factory:implement FACTORY_A11Y_ERROR_STATE_V8
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V12 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V12
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_UI_POLISH_V5 — Enhance calculator UI for better user experience (polish)
- Priority: 950
- Command: pnpm -s factory:implement FACTORY Fix_verify_failure_V14
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_WEATHER_API_QUERY_V13 — Add optional query params to weather API with Open-Meteo URL
- Priority: 550
- Command: pnpm -s factory:implement FACTORY_WEATHER_API_QUERY_V13
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V9 — Improve accessibility of error states for weather API
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_A11Y_ERROR_STATE_V9
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V13 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 950
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V13
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V14 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V14
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V10 — Improve error states for weather API
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_Fix_verify_failure_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V15 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 950
- Command: pnpm -s factory:implement FACTORY_FIXVERIFY_FAILURES_V15
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V16 — Fix verify calculator failures in new tasks
- Priority: 600
- Command: pnpm -s factory:implement FACTORY_FIXVERIFY_CALCULATOR_V16
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V16 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V16
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V17 — Fix Verify Failures in Weather API and Calculator Implementations (Specific Issue)
- Priority: 700
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V17
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V11 — Improve Accessibility for Error States in Weather API
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_A11Y_ERROR_STATE_V11
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_CALC_UI_POLISH_V6 — Enhance Calculator UI Polish (Specific Edge Case)
- Priority: 650
- Command: pnpm -s factory:implement FACTORY_CALC_UI_POLISH_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V18 — Fix Verify Failures in Weather API and Calculator Implementations (Specific Issue)
- Priority: 750
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V18
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V17 — Fix Verify Calculator Failures in New Tasks
- Priority: 800
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_CALCULATOR_V17
- Notes: LLM research (remediation (goal evaluation + repo signals))

### NEW_TASK_V1 — Research signal: Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults
- Priority: 850
- Command: pnpm -s factory:implement NEW_TASK_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V12 — Improve accessibility of error states for weather API
- Priority: 950
- Command: pnpm -s factory:implement FACTORY_Fix_verify_failure_in_weather_api_v1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V8 — Fix verify calculator failures in new tasks
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_Fix_verify_failure_in_calculator_v2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_CALCULATOR_V9 — Fix verify calculator failures in new tasks
- Priority: 950
- Command: pnpm -s factory:implement FACTORY_Fix_verify_failure_in_calculator_v3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_R_NEWUX_V4 — Enhance calculator UI for better user experience
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_R_NEWUX_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V19 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V19
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V20 — Fix verify failures
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V20
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V13 — Improve error states for weather API
- Priority: 500
- Command: pnpm -s factory:implement FACTORY_RESEARCH_DONE
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V21 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_FIX_VERIFY_FAILURES_V21
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V14 — Improve error states for weather API
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_Fix_verify_calculator_errors_v1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V22 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_Fix_verify_calculator_errors_v2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_FIX_VERIFY_FAILURES_V23 — Fix verify failures in weather API and calculator implementations (specific issue)
- Priority: 850
- Command: pnpm -s factory:implement FACTORY_Fix_verify_failure_v3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### NEW_TASK_V2 — Research signal: Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults
- Priority: 850
- Command: pnpm -s factory:implement NEW_TASK_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### NEW_TASK_V3 — Research signal: Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults
- Priority: 850
- Command: pnpm -s factory:implement NEW_TASK_V3
- Notes: LLM research (remediation (goal evaluation + repo signals))

### NEW_TASK_V4 — Research signal: Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults
- Priority: 850
- Command: pnpm -s factory:implement NEW_TASK_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### NEW_TASK_V5 — Research signal: Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults
- Priority: 850
- Command: pnpm -s factory:implement NEW_TASK_V5
- Notes: LLM research (remediation (goal evaluation + repo signals))

### FACTORY_A11Y_ERROR_STATE_V15 — Improve accessibility for error states in weather API
- Priority: 700
- Command: pnpm -s factory:implement FACTORY_A11Y_ERROR_STATE_V15
- Notes: LLM research (remediation (goal evaluation + repo signals))

### NEW_TASK_V6 — Research signal: Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults
- Priority: 650
- Command: pnpm -s factory:implement FACTORY Fix root cause of failed queue items for weather API location input
- Notes: LLM research (remediation (goal evaluation + repo signals))

### NEW_TASK_V7 — Research signal: Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults
- Priority: 620
- Command: pnpm -s factory:implement FACTORY Fix root cause of failed queue items for weather API location input
- Notes: LLM research (remediation (goal evaluation + repo signals))

### NEW_TASK_V8 — Research signal: Open-Meteo URL uses fixed NYC coordinates; wire optional query params with safe defaults
- Priority: 910
- Command: pnpm -s factory:implement NEW_TASK_V8
- Notes: LLM research (remediation (goal evaluation + repo signals))

### WEATHER_API_QUERY_SAFE_DEFAULTS_V1 — Wire safe default query parameters for weather API
- Priority: 600
- Command: pnpm -s factory:implement WEATHER_API_QUERY_SAFE_DEFAULTS_V1
- Notes: LLM research (remediation (goal evaluation + repo signals))

### A11Y_WEATHER_ERROR_STATE_V4 — Improve accessibility of error states in weather API
- Priority: 700
- Command: pnpm -s factory:implement A11Y_WEATHER_ERROR_STATE_V4
- Notes: LLM research (remediation (goal evaluation + repo signals))

### WEATHER_API_QUERY_SAFE_DEFAULTS_V2 — Wire safe default query parameters for weather API
- Priority: 850
- Command: pnpm -s factory:implement WEATHER_API_QUERY_SAFE_DEFAULTS_V2
- Notes: LLM research (remediation (goal evaluation + repo signals))

### A11Y_WEATHER_ERROR_STATE_V5 — Improve accessibility of error states in weather API
- Priority: 900
- Command: pnpm -s factory:implement A11Y_WEATHER_ERROR_STATE_V5
- Notes: LLM research (remediation (goal evaluation + repo signals))

### A11Y_WEATHER_ERROR_STATE_V6 — Improve accessibility of error states in weather API
- Priority: 700
- Command: pnpm -s factory:implement A11Y_WEATHER_ERROR_STATE_V6
- Notes: LLM research (remediation (goal evaluation + repo signals))

### A11Y_WEATHER_ERROR_STATE_V7 — Improve accessibility of error states in weather API
- Priority: 600
- Command: pnpm -s factory:implement A11Y_WEATHER_ERROR_STATE_V7
- Notes: LLM research (remediation (goal evaluation + repo signals))

## Manual / later

### Planner inputs
- **Roadmap**: `agents/factory-roadmap.json` (curated, deterministic list of tasks)
- **Queue**: `agents/factory-queue.json`
- **Runs**: `agents/factory-runs.json`
- **Notes**: `backlog.md` is read by `factory:plan-next` for deterministic “repo state” (no LLM calls)

### Troubleshooting
- **Run logs**: `agents/factory-logs/<run_id>.log`
- **If a task/run is stale**: run `pnpm factory:reclaim`. Configure thresholds with:
  - `FACTORY_STALE_CLAIM_MS` (default 15m)
  - `FACTORY_STALE_RUN_MS` (default 60m)


### Factory dashboard (EvidencePack app)
- [ ] Seed the data files (checked into repo):
  - [ ] `agents/factory-queue.json`
  - [ ] `agents/factory-runs.json`
- [ ] Use the protected UI at `/evidencepack/app/factory` to:
  - [ ] Add tasks, set `in_progress`, mark `done`
  - [ ] Append a run log entry (minimal fields)
- [ ] If you need direct API access (requires EvidencePack auth + access):
  - [ ] `GET /api/evidencepack/factory/state?limitRuns=25`
  - [ ] `POST /api/evidencepack/factory/tasks` (title, priority, spec)
  - [ ] `PATCH /api/evidencepack/factory/tasks/:id/status` (status)
  - [ ] `POST /api/evidencepack/factory/runs` (item_id, branch, worktree_path, status, ...)

### Swarm runner (multi-worker)
- [ ] Start a local swarm (N workers):
  - [ ] `FACTORY_WORKERS=5 pnpm -s factory:swarm`
  - [ ] Optional tuning: `FACTORY_INTERVAL_MS=60000`, `FACTORY_QUEUE_LOW_WATERMARK=20`, `FACTORY_QUEUE_TARGET_SIZE=100`
- [ ] Confirm worker heartbeats appear:
  - [ ] Files written to `agents/factory-logs/heartbeats/<worker_id>.json`
  - [ ] Dashboard shows a “Workers” panel; stale if heartbeat is older than ~15s
- [ ] Concurrency safety notes:
  - [ ] Queue claims use `claimed_by` + `claimed_at` and an on-disk lock file (`agents/factory-queue.json.lock`)
  - [ ] Runs writes are guarded by `agents/factory-runs.json.lock`
  - [ ] If a process dies mid-write, locks auto-break after ~30s (stale lock TTL)


## EvidencePack — build roadmap expansions

### EP_REVENUE_PRICING_PAGE_V1 — Revenue loop: pricing page v1 (EvidencePack)

- Priority: 1000
- Added: 2026-04-29T20:44:29.507Z

**Definition of done**
- [ ] Pricing page exists with one clear plan and CTA into EvidencePack
- [ ] CTA leads to login/signup entrypoint
- [ ] No placeholder links or dead ends

**Implementation notes**
- [ ] (Agent) Break into smaller PR-sized tasks
- [ ] (Agent) Identify required env vars / manual setup and record here

### EVIDENCEPACK_R19_REVENUE_PRICING_PAGE_V1 — EvidencePack: pricing page v1

- Priority: 1000
- Added: 2026-04-30T03:13:17.450Z

**Definition of done**
- [ ] Pricing page exists with one clear plan and CTA
- [ ] CTA leads to login/signup entrypoint
- [ ] No placeholder links or dead ends

**Implementation notes**
- [ ] (Agent) Break into smaller PR-sized tasks
- [ ] (Agent) Identify required env vars / manual setup and record here

### EVIDENCEPACK_R24_REVENUE_AUTH_MAGIC_LINK_V1 — EvidencePack: magic-link auth v1

- Priority: 990
- Added: 2026-04-30T03:27:07.017Z

**Definition of done**
- [ ] User can request a magic link and establish a session cookie
- [ ] After login, user is redirected into the app
- [ ] Auth failure states are handled

**Implementation notes**
- [ ] (Agent) Break into smaller PR-sized tasks
- [ ] (Agent) Identify required env vars / manual setup and record here

## Factory research intake

### FACTORY_WEATHER_LOCATION_PERSIST_V1 — Weather: persist user location choice
- Priority: 920
- Command: pnpm -s factory:implement FACTORY_WEATHER_LOCATION_PERSIST_V1
- Notes: LLM research (Claude) — enhancement proposal
- Definition of Done:
  - Persist last queried location to localStorage
  - Load it on page visit
  - Allow quick re-query of last location
  - pnpm verify passes

### FACTORY_CALC_HISTORY_V1 — Calculator: show calculation history
- Priority: 910
- Command: pnpm -s factory:implement FACTORY_CALC_HISTORY_V1
- Notes: LLM research (Claude) — enhancement proposal
- Definition of Done:
  - Display last 5 calculations in a collapsible history panel
  - Click history item to restore it to calculator
  - Clear history button
  - Responsive on mobile/desktop
  - pnpm verify passes

### FACTORY_WEATHER_FORECAST_V1 — Weather: show 3-day forecast
- Priority: 900
- Command: pnpm -s factory:implement FACTORY_WEATHER_FORECAST_V1
- Notes: LLM research (Claude) — enhancement proposal
- Definition of Done:
  - Extend /api/weather to return forecast for 3 days (or get from API)
  - Display daily forecast with temperature, condition, precipitation
  - Use weather icons/visual indicators
  - pnpm verify passes

### FACTORY_CALC_MEMORY_V1 — Calculator: M+, M-, MR (memory buttons)
- Priority: 890
- Command: pnpm -s factory:implement FACTORY_CALC_MEMORY_V1
- Notes: LLM research (Claude) — enhancement proposal
- Definition of Done:
  - Add Memory+ (M+), Memory- (M-), Memory Recall (MR), Memory Clear (MC) buttons
  - Display current memory value on calculator
  - Keyboard shortcuts for memory functions
  - pnpm verify passes

### FACTORY_WEATHER_WIDGET_V1 — Weather: embeddable weather widget
- Priority: 880
- Command: pnpm -s factory:implement FACTORY_WEATHER_WIDGET_V1
- Notes: LLM research (Claude) — enhancement proposal
- Definition of Done:
  - Create compact weather widget component (e.g. for homepage sidebar)
  - Show current location, temp, condition, quick location toggle
  - Responsive and accessible
  - pnpm verify passes

### FACTORY_CALC_SCIENTIFIC_V1 — Calculator: scientific mode (sin, cos, log, sqrt)
- Priority: 870
- Command: pnpm -s factory:implement FACTORY_CALC_SCIENTIFIC_V1
- Notes: LLM research (Claude) — enhancement proposal
- Definition of Done:
  - Toggle between standard and scientific calculator modes
  - Scientific mode adds: sin, cos, tan, log, ln, sqrt, power, factorial, pi
  - Keyboard shortcuts for scientific functions
  - pnpm verify passes
