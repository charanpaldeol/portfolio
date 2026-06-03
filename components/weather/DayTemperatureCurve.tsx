"use client"

// Purpose: MSN-style 24h temperature chart — hourly dots, axis labels, high|low header.
import { useId, useMemo } from "react"

import { useWeatherUnits } from "@/components/weather/WeatherUnitsProvider"
import { cn } from "@/lib/utils"
import {
  type BuildDayCurveInput,
  buildDayCurveModel,
  DAY_CURVE_LAYOUT,
  formatCurveTempLabel,
  minuteToChartX,
} from "@/lib/weather-day-curve"
import { formatTempParts, WEATHER_TEMP_DIGITS } from "@/lib/weather-units"

const { width: WIDTH, height: HEIGHT, padLeft: PAD_LEFT, padRight: PAD_RIGHT, padTop: PAD_TOP, padBottom: PAD_BOTTOM } =
  DAY_CURVE_LAYOUT

type DayTemperatureCurveProps = BuildDayCurveInput & {
  className?: string
}

export function DayTemperatureCurve({
  className,
  hourlyForecast,
  observedAt,
  sunrise,
  sunset,
  temperatureC,
  todayLowC,
  todayHighC,
}: DayTemperatureCurveProps) {
  const { units } = useWeatherUnits()
  const fillId = useId().replace(/:/g, "")
  const model = useMemo(
    () =>
      buildDayCurveModel({
        hourlyForecast,
        observedAt,
        sunrise,
        sunset,
        temperatureC,
        todayLowC,
        todayHighC,
      }),
    [hourlyForecast, observedAt, sunrise, sunset, temperatureC, todayLowC, todayHighC]
  )

  if (!model || !model.pathD) return null

  const highParts = formatTempParts(model.highC, units, WEATHER_TEMP_DIGITS)
  const lowParts = formatTempParts(model.lowC, units, WEATHER_TEMP_DIGITS)
  const chartTop = PAD_TOP
  const chartBottom = HEIGHT - PAD_BOTTOM
  const chartRight = WIDTH - PAD_RIGHT

  const sunriseX =
    model.sunriseMinute != null ? minuteToChartX(model.sunriseMinute, WIDTH) : null
  const sunsetX =
    model.sunsetMinute != null ? minuteToChartX(model.sunsetMinute, WIDTH) : null

  return (
    <div
      className={cn("overflow-hidden rounded-lg bg-surface-container-lowest/60 ring-1 ring-outline-variant/10", className)}
      role="img"
      aria-label={model.aria}
    >
      <div className="flex items-baseline justify-between gap-2 border-b border-outline-variant/10 px-2.5 py-1.5">
        <span className="text-[11px] font-semibold text-on-surface">Today</span>
        {highParts && lowParts ? (
          <p className="font-display text-sm font-semibold tabular-nums tracking-tight">
            <span className="text-primary">
              {highParts.value}
              {highParts.unit}
            </span>
            <span className="mx-1 font-normal text-on-surface-variant/50">|</span>
            <span className="text-on-surface">
              {lowParts.value}
              {lowParts.unit}
            </span>
          </p>
        ) : null}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block h-[4.5rem] w-full text-primary"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {sunriseX != null && sunsetX != null && sunriseX < sunsetX ? (
          <rect
            x={PAD_LEFT}
            y={chartTop}
            width={sunriseX - PAD_LEFT}
            height={chartBottom - chartTop}
            className="fill-on-surface/[0.04]"
          />
        ) : null}
        {sunsetX != null ? (
          <rect
            x={sunsetX}
            y={chartTop}
            width={chartRight - sunsetX}
            height={chartBottom - chartTop}
            className="fill-on-surface/[0.04]"
          />
        ) : null}

        <line
          x1={PAD_LEFT}
          x2={chartRight}
          y1={model.yHighY}
          y2={model.yHighY}
          className="stroke-outline-variant/12"
          strokeDasharray="2 3"
        />
        <line
          x1={PAD_LEFT}
          x2={chartRight}
          y1={model.yLowY}
          y2={model.yLowY}
          className="stroke-outline-variant/12"
          strokeDasharray="2 3"
        />

        {highParts ? (
          <text
            x={PAD_LEFT - 4}
            y={model.yHighY + 3}
            textAnchor="end"
            className="fill-on-surface-variant text-[8px] font-medium tabular-nums"
          >
            {highParts.value}
            {highParts.unit}
          </text>
        ) : null}
        {lowParts ? (
          <text
            x={PAD_LEFT - 4}
            y={model.yLowY + 3}
            textAnchor="end"
            className="fill-on-surface-variant text-[8px] font-medium tabular-nums"
          >
            {lowParts.value}
            {lowParts.unit}
          </text>
        ) : null}

        {model.areaPathD ? <path d={model.areaPathD} fill={`url(#${fillId})`} /> : null}
        <path
          d={model.pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {model.hourlyMarkers.map((marker) =>
          marker.isNow ? null : (
            <circle
              key={marker.minute}
              cx={marker.x}
              cy={marker.y}
              r="2"
              className="fill-surface-container-lowest stroke-primary/70"
              strokeWidth="1"
            />
          )
        )}

        {sunriseX != null ? (
          <g>
            <line
              x1={sunriseX}
              x2={sunriseX}
              y1={chartTop}
              y2={chartBottom}
              className="stroke-tertiary/25"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
            <text
              x={sunriseX}
              y={chartBottom + 11}
              textAnchor="middle"
              className="fill-on-surface-variant text-[7px]"
            >
              ☀
            </text>
          </g>
        ) : null}

        {sunsetX != null ? (
          <g>
            <line
              x1={sunsetX}
              x2={sunsetX}
              y1={chartTop}
              y2={chartBottom}
              className="stroke-primary/20"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
            <text
              x={sunsetX}
              y={chartBottom + 11}
              textAnchor="middle"
              className="fill-on-surface-variant text-[7px]"
            >
              ☽
            </text>
          </g>
        ) : null}

        {model.nowChart ? (
          <g>
            <line
              x1={model.nowChart.x}
              x2={model.nowChart.x}
              y1={chartTop}
              y2={chartBottom}
              className="stroke-primary/50"
              strokeWidth="1.25"
            />
            <circle
              cx={model.nowChart.x}
              cy={model.nowChart.y}
              r="4.5"
              className="fill-primary stroke-surface-container-lowest"
              strokeWidth="2"
            />
            {typeof temperatureC === "number" && Number.isFinite(temperatureC) ? (
              <text
                x={model.nowChart.x}
                y={Math.max(chartTop + 8, model.nowChart.y - 8)}
                textAnchor="middle"
                className="fill-primary text-[9px] font-bold tabular-nums"
              >
                {formatCurveTempLabel(temperatureC, units)}
              </text>
            ) : null}
          </g>
        ) : null}

        {model.timeTicks.map((tick) => (
          <text
            key={tick.minute}
            x={tick.x}
            y={HEIGHT - 5}
            textAnchor="middle"
            className="fill-on-surface-variant text-[8px] font-medium"
          >
            {tick.label}
          </text>
        ))}
      </svg>

      {(model.sunriseLabel || model.sunsetLabel) && (
        <div className="flex justify-between border-t border-outline-variant/8 px-2.5 py-1 text-[9px] text-on-surface-variant">
          <span>{model.sunriseLabel ? `↑ ${model.sunriseLabel}` : ""}</span>
          <span>{model.sunsetLabel ? `↓ ${model.sunsetLabel}` : ""}</span>
        </div>
      )}
    </div>
  )
}
