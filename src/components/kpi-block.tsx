import { Fragment } from "react"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface KpiMetric {
  id: string
  label: string
  value: number | string
}

const KPI_METRICS: KpiMetric[] = [
  { id: "projects", label: "Projects", value: 75 },
  { id: "overdue", label: "Overdue", value: 23 },
  { id: "upcoming", label: "Upcoming", value: 0 },
  { id: "rent-started", label: "Rent started", value: 16 },
]

export function KpiBlock() {
  return (
    <ToggleGroup
      aria-label="Filter by KPI"
      spacing={0}
      className="flex w-full items-stretch rounded-xl border border-transparent bg-card"
    >
      {KPI_METRICS.map((metric, index) => (
        <Fragment key={metric.id}>
          {index > 0 && <Separator orientation="vertical" />}
          <ToggleGroupItem
            value={metric.id}
            className="flex h-auto flex-1 flex-col items-start gap-1 rounded-lg border border-transparent px-6 py-4 text-left transition-all hover:bg-popover hover:shadow-md hover:ring-1 hover:ring-foreground/10 aria-pressed:border-border aria-pressed:bg-card aria-pressed:shadow-none aria-pressed:ring-0 aria-pressed:hover:shadow-none aria-pressed:hover:ring-0"
          >
            <span className="text-xs font-semibold text-muted-foreground">
              {metric.label}
            </span>
            <span className="text-2xl font-semibold text-foreground group-aria-pressed/toggle:text-primary">
              {metric.value}
            </span>
          </ToggleGroupItem>
        </Fragment>
      ))}
    </ToggleGroup>
  )
}
