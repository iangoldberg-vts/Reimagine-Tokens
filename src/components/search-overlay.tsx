import { useState, type ReactNode } from "react"
import { Building2, FileText, Search, Users, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type Category = "Assets" | "Deals" | "Tenants" | "Brokers"
type Filter = "All" | Category

interface AssetResult {
  id: string
  name: string
  address: string
}

interface DealResult {
  id: string
  name: string
  sf?: number
  stage: string
  buildingName: string
  buildingAddress: string
  suites?: string[]
}

interface DirectoryResult {
  id: string
  name: string
  subtitle: string
}

const ASSETS: AssetResult[] = [
  { id: "ut-physicians", name: "UT Physicians", address: "1141 Ave of the Americas, Houston, TX" },
  { id: "the-chase", name: "The Chase", address: "10 Temperance St, Toronto, ON" },
  { id: "the-troutman", name: "The Troutman", address: "288 Troutman St, Brooklyn, NY" },
  { id: "the-meridian-grove", name: "The Meridian Grove", address: "10000 Santa Monica Blvd, Los Angeles, CA" },
]

const DEALS: DealResult[] = [
  {
    id: "the-well",
    name: "The Well",
    sf: 500,
    stage: "Inquiry",
    buildingName: "Houston Towers",
    buildingAddress: "JPMorgan Chase Tower, 600 Travis Street",
    suites: ["1000 A"],
  },
  {
    id: "the-zone",
    name: "The Zone",
    sf: 61011,
    stage: "Lease Exec.",
    buildingName: "Charles Borromeo",
    buildingAddress: "23 Sidney Place",
    suites: ["401", "300", "215", "305"],
  },
  {
    id: "the-wendys-company",
    name: "The Wendy's Company",
    stage: "Inquiry",
    buildingName: "1100 Lonsdale",
    buildingAddress: "1100 Lonsdale",
  },
  {
    id: "the-unilever-group",
    name: "The Unilever Group",
    sf: 3333,
    stage: "Inquiry",
    buildingName: "NorthPark Center",
    buildingAddress: "8687 North Central Expressway",
    suites: ["510"],
  },
  {
    id: "the-stutz-company",
    name: "The STUTZ Company",
    stage: "Prospect",
    buildingName: "",
    buildingAddress: "",
  },
]

const TENANTS: DirectoryResult[] = [
  { id: "starbucks", name: "Starbucks Corporation", subtitle: "NorthPark Center, 8687 North Central Expressway" },
  { id: "apple", name: "Apple Inc.", subtitle: "1100 Lonsdale, 1100 Lonsdale" },
  { id: "taco", name: "Taco", subtitle: "1100 Lonsdale, 1100 Lonsdale" },
]

const BROKERS: DirectoryResult[] = [
  { id: "jill-segal", name: "Jill Segal", subtitle: "Leasing broker" },
  { id: "penny-marble", name: "Penny Marble", subtitle: "Leasing broker" },
  { id: "marcus-lin", name: "Marcus Lin", subtitle: "Leasing broker" },
]

const FILTERS: Filter[] = ["All", "Assets", "Deals", "Tenants", "Brokers"]

function matches(query: string, ...fields: Array<string | undefined>) {
  const q = query.toLowerCase()
  return fields.some((field) => field?.toLowerCase().includes(q))
}

function highlight(text: string, query: string): ReactNode {
  if (!query || !text) return text
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  const parts: ReactNode[] = []
  let i = 0
  while (i < text.length) {
    const idx = lower.indexOf(q, i)
    if (idx === -1) {
      parts.push(text.slice(i))
      break
    }
    if (idx > i) parts.push(text.slice(i, idx))
    parts.push(
      <span key={idx} className="font-semibold text-foreground">
        {text.slice(idx, idx + q.length)}
      </span>
    )
    i = idx + q.length
  }
  return parts
}

function ResultAvatar({ icon: Icon }: { icon: typeof Building2 }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
      <Icon className="size-4" />
    </span>
  )
}

function ResultsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <p className="px-4 pb-2 text-sm font-semibold text-foreground">{title}</p>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("All")

  function handleOpenChange(next: boolean) {
    if (!next) {
      setQuery("")
      setFilter("All")
    }
    onOpenChange(next)
  }

  const showAssets = filter === "All" || filter === "Assets"
  const showDeals = filter === "All" || filter === "Deals"
  const showTenants = filter === "All" || filter === "Tenants"
  const showBrokers = filter === "All" || filter === "Brokers"

  const matchedAssets = showAssets ? ASSETS.filter((a) => matches(query, a.name, a.address)) : []
  const matchedDeals = showDeals
    ? DEALS.filter((d) => matches(query, d.name, d.buildingName, d.buildingAddress, d.stage))
    : []
  const matchedTenants = showTenants ? TENANTS.filter((t) => matches(query, t.name, t.subtitle)) : []
  const matchedBrokers = showBrokers ? BROKERS.filter((b) => matches(query, b.name, b.subtitle)) : []

  const hasQuery = query.trim().length > 0
  const hasResults =
    matchedAssets.length > 0 || matchedDeals.length > 0 || matchedTenants.length > 0 || matchedBrokers.length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          // Both breakpoints share the same surface — a page-background panel
          // holding a floating white pill. Below md it's a full-screen
          // takeover with a corner close chip; from md up it's a centered,
          // bordered card.
          "top-0 left-0 flex h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col gap-4 rounded-none border-0 bg-background p-0 pt-[46px] pb-4 ring-0 md:top-36 md:left-1/2 md:h-auto md:max-h-[32rem] md:w-[448px] md:max-w-[448px] md:-translate-x-1/2 md:rounded-xl md:border md:border-border md:pt-4 md:shadow-md",
          // The entrance transition's data-starting-style attribute doesn't
          // always clear, leaving the dialog stuck invisible — neutralize
          // only the *entrance* so it renders at rest regardless. The exit
          // transition (fade-out-0/zoom-out-95, from DialogContent's own
          // defaults) must stay: those target hidden, so don't touch them —
          // overriding them to "100" would target "still fully visible",
          // leaving the dialog stuck open after it's dismissed.
          "data-open:fade-in-100 data-open:zoom-in-100"
        )}
      >
        {/* Mobile only — the same corner affordance the filters view uses. */}
        <button
          type="button"
          aria-label="Close search"
          onClick={() => handleOpenChange(false)}
          className="absolute top-2 right-4 flex size-[30px] cursor-pointer items-center justify-center rounded-full bg-popover text-foreground shadow-sm md:hidden"
        >
          <X className="size-3.5" />
        </button>

        {/* The field floats as a white pill on the panel at every breakpoint. */}
        <div className="mx-4 rounded-full bg-popover p-2.5 shadow-md">
          <InputGroup className="h-auto min-w-0 border-0 px-2 ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
            <InputGroupAddon className="pl-0">
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              autoFocus
              placeholder="Search for anything"
              className="text-base font-medium"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {hasQuery && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => setQuery("")}>
                  <X className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4">
          {FILTERS.map((item) => (
            <Button
              key={item}
              variant={filter === item ? "default" : "outline"}
              size="xs"
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        {hasQuery && (
          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] md:h-80 md:flex-none [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-4">
              {!hasResults && (
                <p className="px-4 text-sm text-muted-foreground">No results for "{query}"</p>
              )}

              {matchedAssets.length > 0 && (
                <ResultsSection title="Assets">
                  {matchedAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center gap-3 px-4 py-2">
                      <ResultAvatar icon={Building2} />
                      <div className="flex min-w-0 flex-col">
                        <p className="truncate text-sm text-foreground">{highlight(asset.name, query)}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {highlight(asset.address, query)}
                        </p>
                      </div>
                    </div>
                  ))}
                </ResultsSection>
              )}

              {matchedDeals.length > 0 && (
                <ResultsSection title="Deals">
                  {matchedDeals.map((deal) => (
                    <div key={deal.id} className="flex items-start gap-3 px-4 py-2">
                      <ResultAvatar icon={FileText} />
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="truncate text-sm text-foreground">{highlight(deal.name, query)}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {deal.sf ? `${deal.sf.toLocaleString()} sf | ` : ""}
                          {highlight(deal.stage, query)}
                        </p>
                        {deal.buildingName && (
                          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <Building2 className="size-3 shrink-0" />
                            {highlight(deal.buildingName, query)}
                          </p>
                        )}
                        {deal.buildingAddress && (
                          <p className="truncate text-xs text-muted-foreground">
                            {highlight(deal.buildingAddress, query)}
                          </p>
                        )}
                        {deal.suites && deal.suites.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {deal.suites.map((suite) => (
                              <Badge key={suite} variant="secondary">
                                {suite}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ResultsSection>
              )}

              {matchedTenants.length > 0 && (
                <ResultsSection title="Tenants">
                  {matchedTenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center gap-3 px-4 py-2">
                      <ResultAvatar icon={Users} />
                      <div className="flex min-w-0 flex-col">
                        <p className="truncate text-sm text-foreground">{highlight(tenant.name, query)}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {highlight(tenant.subtitle, query)}
                        </p>
                      </div>
                    </div>
                  ))}
                </ResultsSection>
              )}

              {matchedBrokers.length > 0 && (
                <ResultsSection title="Brokers">
                  {matchedBrokers.map((broker) => (
                    <div key={broker.id} className="flex items-center gap-3 px-4 py-2">
                      <ResultAvatar icon={Users} />
                      <div className="flex min-w-0 flex-col">
                        <p className="truncate text-sm text-foreground">{highlight(broker.name, query)}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {highlight(broker.subtitle, query)}
                        </p>
                      </div>
                    </div>
                  ))}
                </ResultsSection>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
