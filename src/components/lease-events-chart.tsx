import { Fragment } from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface LeaseRecord {
  tenant: string
  building: string
  sf: number
  date: string
}

interface YearData {
  year: string
  expiring: number
  terminating: number
  expiringLeases: LeaseRecord[]
}

const chartConfig = {
  expiring: {
    label: "Expiring",
    color: "var(--chart-1)",
  },
  terminating: {
    label: "Terminating",
    color: "var(--border)",
  },
} satisfies ChartConfig

const data: YearData[] = [
  {
    year: "2026",
    expiring: 100_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Berenzweig", building: "Savannah Building", sf: 100_000, date: "03/15/26" },
    ],
  },
  {
    year: "2027",
    expiring: 320_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Harlow Textiles", building: "Riverside Tower", sf: 210_000, date: "06/30/27" },
      { tenant: "Joe's Pizza", building: "Woodland Plaza - 100 W.", sf: 110_000, date: "08/01/27" },
    ],
  },
  {
    year: "2028",
    expiring: 255_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Berenzweig", building: "Savannah Building", sf: 8_299, date: "01/31/28" },
      { tenant: "Berenzweig", building: "Savannah Building", sf: 0, date: "01/31/28" },
      { tenant: "Joe's Pizza", building: "Woodland Plaza - 100 W.", sf: 1_500, date: "02/01/28" },
      { tenant: "Orenthal Logistics", building: "Harbor Point", sf: 245_201, date: "04/12/28" },
    ],
  },
  {
    year: "2029",
    expiring: 70_000,
    terminating: 30_000,
    expiringLeases: [
      { tenant: "Fenwick & Co.", building: "Riverside Tower", sf: 70_000, date: "09/30/29" },
    ],
  },
  {
    year: "2030",
    expiring: 125_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Marlowe Studios", building: "Harbor Point", sf: 125_000, date: "05/20/30" },
    ],
  },
  {
    year: "2031",
    expiring: 55_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Dunmore Supply", building: "Woodland Plaza - 100 W.", sf: 55_000, date: "11/01/31" },
    ],
  },
  {
    year: "2032",
    expiring: 510_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Orenthal Logistics", building: "Harbor Point", sf: 300_000, date: "02/28/32" },
      { tenant: "Harlow Textiles", building: "Riverside Tower", sf: 210_000, date: "07/15/32" },
    ],
  },
  {
    year: "2033",
    expiring: 75_000,
    terminating: 220_000,
    expiringLeases: [
      { tenant: "Fenwick & Co.", building: "Riverside Tower", sf: 75_000, date: "10/31/33" },
    ],
  },
  {
    year: "2034",
    expiring: 80_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Dunmore Supply", building: "Woodland Plaza - 100 W.", sf: 80_000, date: "03/01/34" },
    ],
  },
  {
    year: "2035",
    expiring: 200_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Marlowe Studios", building: "Harbor Point", sf: 200_000, date: "06/12/35" },
    ],
  },
  {
    year: "2036",
    expiring: 245_000,
    terminating: 0,
    expiringLeases: [
      { tenant: "Berenzweig", building: "Savannah Building", sf: 245_000, date: "09/01/36" },
    ],
  },
]

function formatSf(value: number) {
  return value === 0 ? "0" : `${value / 1000}K`
}

interface LeaseEventsTooltipProps {
  active?: boolean
  payload?: Array<{ payload: YearData }>
}

function LeaseEventsTooltip({ active, payload }: LeaseEventsTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const { year, expiring, expiringLeases } = payload[0].payload

  return (
    <div className="w-80 overflow-hidden rounded-lg border border-border/50 bg-background shadow-xl">
      <div className="flex items-center justify-between px-4 pt-3 text-xs text-muted-foreground">
        <span>sf Expiring</span>
        <span>year</span>
      </div>
      <div className="flex items-end justify-between px-4 pb-3">
        <span className="text-3xl font-bold text-chart-1">{formatSf(expiring)}</span>
        <span className="text-lg font-bold text-foreground">{year}</span>
      </div>
      <Separator />
      <ScrollArea className="h-32">
        <div className="flex flex-col px-4">
          {expiringLeases.map((lease, index) => (
            <Fragment key={`${lease.tenant}-${index}`}>
              {index > 0 && <Separator />}
              <div className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-3 py-2 text-sm">
                <span className="truncate font-medium text-foreground">{lease.tenant}</span>
                <span className="truncate text-muted-foreground">{lease.building}</span>
                <span className="text-foreground">{lease.sf.toLocaleString()} sf</span>
                <span className="text-muted-foreground">{lease.date}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function LeaseEventsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lease events</CardTitle>
        <CardAction>
          <div className="flex flex-col items-end gap-1 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-border" />
              Terminating
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-chart-1" />
              Expiring
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <BarChart data={data}>
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              ticks={[0, 200_000, 400_000, 600_000]}
              domain={[0, 600_000]}
              tickFormatter={formatSf}
              label={{
                value: "SF",
                angle: -90,
                position: "insideLeft",
                className: "fill-muted-foreground text-xs",
              }}
            />
            <ChartTooltip content={<LeaseEventsTooltip />} cursor={false} />
            <Bar
              dataKey="expiring"
              stackId="events"
              fill="var(--color-expiring)"
              activeBar={{ fillOpacity: 0.5 }}
              isAnimationActive={false}
            />
            <Bar
              dataKey="terminating"
              stackId="events"
              fill="var(--color-terminating)"
              activeBar={{ fillOpacity: 0.5 }}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
