// Purpose: Show hottest and coldest months from 1991–2020 climate normals.
import { formatClimateMonthSummary } from "@/lib/weather-climate"
import type { ClimateExtremes } from "@/lib/weather-types"

type WeatherClimateNormalsProps = {
  climate: ClimateExtremes
  layout?: "default" | "header"
}

function MonthTile({
  title,
  monthName,
  summary,
  compact = false,
}: {
  title: string
  monthName: string
  summary: string
  compact?: boolean
}) {
  return (
    <article className="rounded-xl bg-surface-container-lowest/90 px-3 py-2.5 ring-1 ring-outline-variant/10 sm:px-4 sm:py-3">
      <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">{title}</h3>
      <p
        className={
          compact
            ? "mt-0.5 text-base font-semibold text-on-surface"
            : "mt-1 text-lg font-semibold text-on-surface"
        }
      >
        {monthName}
      </p>
      <p className="mt-0.5 text-xs text-on-surface-variant">{summary}</p>
    </article>
  )
}

export function WeatherClimateNormals({ climate, layout = "default" }: WeatherClimateNormalsProps) {
  const compact = layout === "header"

  if (compact) {
    return (
      <section aria-label="Climate normals" className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-on-surface">Typical year</h2>
          <p className="text-[11px] text-on-surface-variant">{climate.periodLabel} · ERA5</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MonthTile
            title="Hottest"
            monthName={climate.hottest.monthName}
            summary={formatClimateMonthSummary(climate.hottest)}
            compact
          />
          <MonthTile
            title="Coldest"
            monthName={climate.coldest.monthName}
            summary={formatClimateMonthSummary(climate.coldest)}
            compact
          />
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Climate normals" className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">Typical year</h2>
        <p className="text-xs text-on-surface-variant/80">{climate.periodLabel} · ERA5</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <MonthTile
          title="Hottest month"
          monthName={climate.hottest.monthName}
          summary={formatClimateMonthSummary(climate.hottest)}
        />
        <MonthTile
          title="Coldest month"
          monthName={climate.coldest.monthName}
          summary={formatClimateMonthSummary(climate.coldest)}
        />
      </div>
    </section>
  )
}
