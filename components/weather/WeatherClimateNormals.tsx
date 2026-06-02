// Purpose: Show hottest and coldest months from 1991–2020 climate normals.
import { formatClimateMonthSummary } from "@/lib/weather-climate"
import type { ClimateExtremes } from "@/lib/weather-types"

type WeatherClimateNormalsProps = {
  climate: ClimateExtremes
}

function MonthTile({
  title,
  monthName,
  summary,
}: {
  title: string
  monthName: string
  summary: string
}) {
  return (
    <article className="rounded-xl bg-surface-container-lowest/90 px-4 py-3 ring-1 ring-outline-variant/10">
      <h3 className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">{title}</h3>
      <p className="mt-1 text-lg font-semibold text-on-surface">{monthName}</p>
      <p className="mt-0.5 text-xs text-on-surface-variant">{summary}</p>
    </article>
  )
}

export function WeatherClimateNormals({ climate }: WeatherClimateNormalsProps) {
  return (
    <section aria-label="Climate normals" className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">Typical year</h2>
        <p className="text-xs text-on-surface-variant/80">{climate.periodLabel} monthly averages (ERA5)</p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
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
