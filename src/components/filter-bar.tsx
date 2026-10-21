import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterSelectConfig {
  id: string
  label: string
  options: string[]
}

const FILTER_SELECTS: FilterSelectConfig[] = [
  {
    id: "lease-status",
    label: "Lease status",
    options: ["Active", "Pending", "Expired", "Terminated"],
  },
  {
    id: "asset-type",
    label: "Asset type",
    options: ["Office", "Retail", "Industrial", "Mixed use"],
  },
  {
    id: "size-range",
    label: "Size range",
    options: [
      "Under 5,000 sf",
      "5,000–10,000 sf",
      "10,000–25,000 sf",
      "25,000+ sf",
    ],
  },
]

export function FilterBar() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <div className="flex min-w-40 flex-1 flex-col gap-2">
        <Input placeholder="Keyword filter" />
      </div>

      {FILTER_SELECTS.map((filter) => (
        <div key={filter.id} className="flex min-w-40 flex-1 flex-col gap-2">
          <Label htmlFor={filter.id} className="text-xs font-semibold text-muted-foreground">
            {filter.label}
          </Label>
          <Select>
            <SelectTrigger id={filter.id} className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {filter.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <Button variant="outline" className="shrink-0">
        All filters
      </Button>
    </div>
  )
}
