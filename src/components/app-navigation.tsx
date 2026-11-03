import * as React from "react"
import {
  Activity,
  Archive,
  BarChart3,
  Bell,
  Building2,
  Calculator,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  ClipboardList,
  FileText,
  GitBranch,
  Grid2x2,
  Handshake,
  Layers,
  LayoutGrid,
  ListChecks,
  Menu,
  Plus,
  Scale,
  ShieldCheck,
  Sparkle,
  UsersRound,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ActivityFeed } from "@/components/activity-feed"
import { MobileFullPage } from "@/components/mobile-full-page"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { VtsLogo } from "@/components/vts-logo"

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface AppNavSubItem {
  label: string
  icon: LucideIcon
  href?: string
}

export interface AppNavItem {
  label: string
  icon: LucideIcon
  href?: string
  items?: AppNavSubItem[]
  /** Renders the item in the primary accent — reserved for Ask VTS. */
  accent?: boolean
}

export type AppNavVariant = "sidebar" | "floating" | "inset"

export interface AppNavProperty {
  name: string
  address: string
  /** "Built {year} · {floors} floors · {type}" — shown as the page header eyebrow. */
  details?: string
}

export interface AppNavPortfolio {
  name: string
  propertyCount: number
  /** Property names in this portfolio. Only set for portfolios created in the UI. */
  properties?: string[]
}

/* ── Default VTS data ───────────────────────────────────────────────────── */

export const VTS_NAV_ITEMS: AppNavItem[] = [
  { label: "Overview", icon: LayoutGrid, href: "#" },
  {
    label: "Stacking plan",
    icon: Layers,
    items: [{ label: "Spaces", icon: Grid2x2, href: "#" }],
  },
  {
    label: "Deals",
    icon: Handshake,
    items: [
      { label: "Deal tasks", icon: ClipboardList, href: "#" },
      { label: "Tenant coordination", icon: UsersRound, href: "#" },
    ],
  },
  {
    label: "Leases",
    icon: FileText,
    items: [
      { label: "Critical dates", icon: Calendar, href: "#" },
      { label: "Options & rights", icon: ShieldCheck, href: "#" },
    ],
  },
  { label: "Tenants", icon: UsersRound, href: "#" },
  { label: "Requirements", icon: ListChecks, href: "#" },
  {
    label: "Planning",
    icon: Calculator,
    items: [
      { label: "Budgets", icon: Wallet, href: "#" },
      { label: "Appraisals", icon: Scale, href: "#" },
      { label: "Comps", icon: BarChart3, href: "#" },
    ],
  },
  {
    label: "Doc vault",
    icon: Archive,
    items: [{ label: "Abstraction", icon: GitBranch, href: "#" }],
  },
  { label: "Ask VTS", icon: Sparkle, href: "#", accent: true },
]

export const VTS_NAV_FOOTER_ITEMS: AppNavItem[] = [
  { label: "Activity feed", icon: Activity, href: "#" },
  { label: "Reminders", icon: Bell, href: "#" },
  { label: "Profile", icon: CircleUser, href: "#" },
]

export const VTS_PORTFOLIOS: AppNavPortfolio[] = [
  {
    name: "Northeast Corridor",
    propertyCount: 5,
    properties: [
      "VTS Tower Headquarters",
      "One Financial Plaza",
      "Empire State Building",
      "Salesforce Tower",
      "200 Berkeley Street",
    ],
  },
  {
    name: "West Coast Portfolio",
    propertyCount: 3,
    properties: ["Salesforce Tower", "VTS Tower Headquarters", "Empire State Building"],
  },
  {
    name: "Midwest Holdings",
    propertyCount: 3,
    properties: ["Willis Tower", "One Financial Plaza", "200 Berkeley Street"],
  },
]

export const VTS_PROPERTIES: AppNavProperty[] = [
  {
    name: "VTS Tower Headquarters",
    address: "114 West 41st Street, New York, NY 10036",
    details: "Built 2017 · 52 floors · Office",
  },
  {
    name: "One Financial Plaza",
    address: "1 Financial Plaza, Providence, RI 02903",
    details: "Built 1928 · 26 floors · Office",
  },
  {
    name: "Empire State Building",
    address: "350 5th Ave, New York, NY 10118",
    details: "Built 1931 · 102 floors · Office",
  },
  {
    name: "Salesforce Tower",
    address: "415 Mission St, San Francisco, CA 94105",
    details: "Built 2018 · 61 floors · Office",
  },
  {
    name: "200 Berkeley Street",
    address: "200 Berkeley St, Boston, MA 02116",
    details: "Built 1947 · 36 floors · Office",
  },
  {
    name: "Willis Tower",
    address: "233 S Wacker Dr, Chicago, IL 60606",
    details: "Built 1973 · 108 floors · Office",
  },
]

/**
 * Remaps the popover/menu token family onto the `sidebar-*` family so surfaces
 * that float off the sidebar stay dark in both themes, without hardcoding color.
 * Works because the theme is declared with `@theme inline`, so utilities resolve
 * `var(--popover)` at the element rather than at `:root`.
 */
const SIDEBAR_SURFACE_VARS = {
  "--popover": "var(--sidebar)",
  "--popover-foreground": "var(--sidebar-foreground)",
  "--foreground": "var(--sidebar-accent-foreground)",
  "--muted": "var(--sidebar-accent)",
  "--muted-foreground": "color-mix(in oklch, var(--sidebar-foreground) 65%, transparent)",
  "--border": "var(--sidebar-border)",
  "--input": "var(--sidebar-border)",
  "--ring": "var(--sidebar-ring)",
} as React.CSSProperties

/**
 * Keeps a scroll container's scrollbar hidden at rest, revealing it only
 * while the user is actively scrolling (see the `.scrollbar-overlay` rules
 * in index.css). Spread the returned props onto the scrollable element.
 */
function useScrollbarReveal() {
  const [scrolling, setScrolling] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const onScroll = () => {
    setScrolling(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setScrolling(false), 800)
  }

  React.useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return { className: cn("scrollbar-overlay", scrolling && "is-scrolling"), onScroll }
}

/* ── Create portfolio ──────────────────────────────────────────────────── */

function CreatePortfolioView({
  properties,
  onCancel,
  onCreate,
}: {
  properties: AppNavProperty[]
  onCancel: () => void
  onCreate: (name: string, propertyNames: string[]) => void
}) {
  const [name, setName] = React.useState("")
  const [selected, setSelected] = React.useState<string[]>([])
  const scrollbarReveal = useScrollbarReveal()

  const toggle = (propertyName: string) => {
    setSelected((current) =>
      current.includes(propertyName)
        ? current.filter((existing) => existing !== propertyName)
        : [...current, propertyName]
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-sidebar-border p-4">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Back to properties"
          onClick={onCancel}
          className="-ml-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="font-semibold text-sidebar-foreground">New portfolio</p>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 p-4">
        <label htmlFor="new-portfolio-name" className="text-xs font-medium text-muted-foreground">
          Portfolio name
        </label>
        <Input
          id="new-portfolio-name"
          autoFocus
          placeholder="e.g. Northeast Corridor"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <Command className="min-h-0 flex-1">
        <CommandInput placeholder="Search assets..." />
        <CommandList
          onScroll={scrollbarReveal.onScroll}
          className={cn("min-h-0 flex-1 pt-2 md:max-h-72 md:flex-none", scrollbarReveal.className)}
        >
          <CommandEmpty>No properties found.</CommandEmpty>
          <CommandGroup heading="Assets">
            {properties.map((property) => (
              <CommandItem
                key={property.name}
                value={`${property.name} ${property.address}`}
                onSelect={() => toggle(property.name)}
                data-checked={selected.includes(property.name) ? "true" : undefined}
              >
                <Building2 className="size-4 shrink-0 opacity-70" aria-hidden="true" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{property.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {property.address}
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>

      <div className="shrink-0 border-t border-sidebar-border p-4">
        <Button
          className="w-full"
          disabled={name.trim().length === 0}
          onClick={() => onCreate(name.trim(), selected)}
        >
          Create portfolio{selected.length > 0 ? ` (${selected.length})` : ""}
        </Button>
      </div>
    </div>
  )
}

/* ── Property switcher ──────────────────────────────────────────────────── */

interface PropertySwitcherProps {
  values: string[]
  onValuesChange: (values: string[]) => void
  portfolios: AppNavPortfolio[]
  properties: AppNavProperty[]
  onCreatePortfolio: (name: string, propertyNames: string[]) => void
}

function PropertySwitcher({
  values,
  onValuesChange,
  portfolios,
  properties,
  onCreatePortfolio,
}: PropertySwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [creatingPortfolio, setCreatingPortfolio] = React.useState(false)
  const [multiSelect, setMultiSelect] = React.useState(false)
  const scrollbarReveal = useScrollbarReveal()
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile

  const toggle = (next: string) => {
    if (next === "All assets") {
      onValuesChange([])
      return
    }
    onValuesChange(
      values.includes(next) ? values.filter((name) => name !== next) : [...values, next]
    )
  }

  const selectProperty = (name: string) => {
    if (multiSelect) {
      toggle(name)
      return
    }
    onValuesChange([name])
    setOpen(false)
  }

  // Portfolios are always a single selection — picking one already implies
  // every property in it, so stacking portfolios together doesn't make sense.
  const selectPortfolio = (name: string) => {
    onValuesChange([name])
    setOpen(false)
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setCreatingPortfolio(false)
  }

  const handleCreatePortfolio = (name: string, propertyNames: string[]) => {
    onCreatePortfolio(name, propertyNames)
    setCreatingPortfolio(false)
  }

  const triggerLabel =
    values.length === 0
      ? "All assets"
      : values.length === 1
        ? values[0]
        : `Multiple selected (${values.length})`

  const triggerChildren = (
    <>
      <Building2 className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate font-medium leading-snug">{triggerLabel}</span>
          <ChevronDown
            className="size-4 shrink-0 opacity-60 transition-transform duration-200 in-data-popup-open:rotate-180"
            aria-hidden="true"
          />
        </>
      )}
    </>
  )

  const triggerClassName = cn(
    "flex h-auto min-h-12 w-full items-center justify-start gap-2 rounded-lg bg-sidebar-accent px-2 py-4 text-left text-sm font-normal text-sidebar-foreground ring-sidebar-ring transition-colors",
    "ring-1 ring-sidebar-border hover:brightness-125 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring aria-expanded:text-sidebar-foreground data-popup-open:text-sidebar-foreground",
    collapsed && "min-h-0 justify-center"
  )

  const commandContent = (
    <Command>
      <CommandInput placeholder="Search properties..." />
      <CommandList
        onScroll={scrollbarReveal.onScroll}
        className={cn("min-h-0 flex-1 pt-2 md:max-h-80 md:flex-none", scrollbarReveal.className)}
      >
        <CommandEmpty>No properties found.</CommandEmpty>

        <CommandGroup>
          <CommandItem
            value="All assets"
            onSelect={() => toggle("All assets")}
            data-checked={values.length === 0 ? "true" : undefined}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent">
              <Layers className="size-4 text-sidebar-primary" aria-hidden="true" />
            </span>
            <span className="font-medium">All assets</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup
          heading={
            <div className="flex items-center justify-between">
              <span>Portfolios</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Create portfolio"
                onClick={() => setCreatingPortfolio(true)}
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          }
        >
          {portfolios.map((portfolio) => (
            <CommandItem
              key={portfolio.name}
              value={portfolio.name}
              onSelect={() => selectPortfolio(portfolio.name)}
              data-checked={values.includes(portfolio.name) ? "true" : undefined}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent">
                <Layers className="size-4 text-sidebar-primary" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{portfolio.name}</span>
                <span className="text-xs text-muted-foreground">
                  {portfolio.propertyCount} properties
                </span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup
          heading={
            <div className="flex items-center justify-between">
              <span>Assets</span>
              <FieldLabel className="w-fit gap-1.5 text-xs font-normal normal-case tracking-normal text-muted-foreground">
                Multi-select
                <Switch size="sm" checked={multiSelect} onCheckedChange={setMultiSelect} />
              </FieldLabel>
            </div>
          }
        >
          {properties.map((property) => (
            <CommandItem
              key={property.name}
              value={`${property.name} ${property.address}`}
              onSelect={() => selectProperty(property.name)}
              data-checked={values.includes(property.name) ? "true" : undefined}
            >
              <Building2 className="size-4 shrink-0 opacity-70" aria-hidden="true" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{property.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {property.address}
                </span>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  if (isMobile) {
    return (
      <MobileFullPage
        trigger={
          <Button
            type="button"
            variant="ghost"
            aria-label={`Switch properties — currently ${triggerLabel}`}
            className={triggerClassName}
          >
            {triggerChildren}
          </Button>
        }
        open={open}
        onOpenChange={handleOpenChange}
        style={SIDEBAR_SURFACE_VARS}
        className="**:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider"
      >
        {creatingPortfolio ? (
          <CreatePortfolioView
            properties={properties}
            onCancel={() => setCreatingPortfolio(false)}
            onCreate={handleCreatePortfolio}
          />
        ) : (
          <>
            <div className="flex shrink-0 items-center justify-end border-b border-sidebar-border p-4">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close property switcher"
                onClick={() => setOpen(false)}
                className="-mr-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">{commandContent}</div>
          </>
        )}
      </MobileFullPage>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={<Button type="button" variant="ghost" aria-label={`Switch properties — currently ${triggerLabel}`} className={triggerClassName} />}>
        {triggerChildren}
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={8}
        className="w-[309px] max-h-[32rem] overflow-hidden p-0 ring-sidebar-border **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider"
        style={SIDEBAR_SURFACE_VARS}
      >
        {creatingPortfolio ? (
          <CreatePortfolioView
            properties={properties}
            onCancel={() => setCreatingPortfolio(false)}
            onCreate={handleCreatePortfolio}
          />
        ) : (
          commandContent
        )}
      </PopoverContent>
    </Popover>
  )
}

/* ── Nav items ──────────────────────────────────────────────────────────── */

interface NavEntryProps {
  item: AppNavItem
  activeItem: string
  onActivate: (label: string) => void
}

/**
 * Idle nav items sit back at 70% so the active one reads as the only thing
 * selected; hover brings an item to full strength. Applied from `isActive`
 * rather than a `not-data-active:` variant so it never depends on Tailwind's
 * variant ordering against the `data-active:` rules in sidebarMenuButtonVariants.
 */
const NAV_IDLE = "text-sidebar-foreground/70 hover:text-sidebar-foreground"

/** A parent with children, rendered as an inline collapsible while expanded. */
function NavCollapsibleEntry({ item, activeItem, onActivate }: NavEntryProps) {
  const childActive = item.items!.some((sub) => sub.label === activeItem)
  const [open, setOpen] = React.useState(childActive)
  const Icon = item.icon

  return (
    <Collapsible open={open} onOpenChange={setOpen} render={<SidebarMenuItem />}>
      <CollapsibleTrigger
        render={
          <SidebarMenuButton
            isActive={open || childActive}
            className={cn("justify-start", !(open || childActive) && NAV_IDLE)}
          />
        }
      >
        <Icon aria-hidden="true" />
        <span>{item.label}</span>
        <ChevronRight
          className="ml-auto opacity-60 transition-transform duration-200 in-data-panel-open:rotate-90"
          aria-hidden="true"
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <SidebarMenuSub className="border-none">
          {item.items!.map((sub) => (
            <SidebarMenuSubItem key={sub.label}>
              <SidebarMenuSubButton
                isActive={sub.label === activeItem}
                render={<a href={sub.href ?? "#"} />}
                onClick={(event) => {
                  if (!sub.href || sub.href === "#") event.preventDefault()
                  onActivate(sub.label)
                }}
                className={cn(sub.label !== activeItem && NAV_IDLE)}
              >
                <sub.icon aria-hidden="true" />
                <span>{sub.label}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

/** The same parent in the collapsed rail — children move into a flyout menu. */
function NavFlyoutEntry({ item, activeItem, onActivate }: NavEntryProps) {
  const Icon = item.icon
  const childActive = item.items!.some((sub) => sub.label === activeItem)

  return (
    <SidebarMenuItem>
      <Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <TooltipTrigger
                render={
                  <SidebarMenuButton
                    isActive={childActive}
                    className={cn(!childActive && NAV_IDLE)}
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                }
              />
            }
          />
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={8}
            className="min-w-48 ring-sidebar-border"
            style={SIDEBAR_SURFACE_VARS}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {item.items!.map((sub) => (
                <DropdownMenuItem key={sub.label} onClick={() => onActivate(sub.label)}>
                  <sub.icon aria-hidden="true" />
                  <span>{sub.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent side="right" align="center">
          {item.label}
        </TooltipContent>
      </Tooltip>
    </SidebarMenuItem>
  )
}

interface NavLeafEntryProps extends NavEntryProps {
  /** Drops to the `sm` button size and smaller icons — used by the footer. */
  secondary?: boolean
}

function NavLeafEntry({
  item,
  activeItem,
  onActivate,
  secondary = false,
}: NavLeafEntryProps) {
  const Icon = item.icon
  const active = item.label === activeItem

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        size={secondary ? "sm" : "default"}
        isActive={active}
        tooltip={item.label}
        render={<a href={item.href ?? "#"} />}
        onClick={(event) => {
          if (!item.href || item.href === "#") event.preventDefault()
          onActivate(item.label)
        }}
        className={cn(
          // Ask VTS keeps its accent at all times — it isn't a destination.
          !active && !item.accent && NAV_IDLE,
          secondary && "[&_svg]:size-3.5",
          item.accent &&
            "text-sidebar-primary hover:text-sidebar-primary data-active:text-sidebar-primary [&_svg]:text-sidebar-primary"
        )}
      >
        <Icon aria-hidden="true" />
        <span className={cn(item.accent && "font-medium")}>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

/** Opens the activity feed as a white popover anchored to this footer link, instead of navigating. */
function ActivityFeedNavItem({ item }: { item: AppNavItem }) {
  const [open, setOpen] = React.useState(false)
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <ActivityFeed
        open={open}
        onOpenChange={setOpen}
        trigger={
          <SidebarMenuButton
            size="sm"
            isActive={open}
            className={cn("[&_svg]:size-3.5", !open && NAV_IDLE)}
          >
            <Icon aria-hidden="true" />
            <span>{item.label}</span>
          </SidebarMenuButton>
        }
      />
    </SidebarMenuItem>
  )
}

function NavEntry(props: NavEntryProps) {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile

  if (!props.item.items?.length) {
    return <NavLeafEntry {...props} />
  }

  return collapsed ? <NavFlyoutEntry {...props} /> : <NavCollapsibleEntry {...props} />
}

/* ── Sidebar ────────────────────────────────────────────────────────────── */

export interface AppSidebarProps {
  items?: AppNavItem[]
  footerItems?: AppNavItem[]
  portfolios?: AppNavPortfolio[]
  properties?: AppNavProperty[]
  /** Label of the nav item rendered as active. */
  activeItem?: string
  onActiveItemChange?: (label: string) => void
  selectedProperties?: string[]
  onSelectedPropertiesChange?: (properties: string[]) => void
  /** Called when a portfolio is created via the property switcher's "+". */
  onPortfoliosChange?: (portfolios: AppNavPortfolio[]) => void
  /**
   * `icon` keeps the collapsed rail (the real app shell). `none` renders a
   * static, non-fixed sidebar — use it to embed the shell inside a page.
   */
  collapsible?: "icon" | "offcanvas" | "none"
  /**
   * `sidebar` sits flush against the edge. `floating` insets it and rounds the
   * surface into a card. `inset` keeps the nav flush and floats the page pane
   * instead.
   */
  variant?: AppNavVariant
  className?: string
}

export function AppSidebar({
  items = VTS_NAV_ITEMS,
  footerItems = VTS_NAV_FOOTER_ITEMS,
  portfolios,
  onPortfoliosChange,
  properties = VTS_PROPERTIES,
  activeItem,
  onActiveItemChange,
  selectedProperties,
  onSelectedPropertiesChange,
  collapsible = "icon",
  variant = "sidebar",
  className,
}: AppSidebarProps) {
  const [internalActive, setInternalActive] = React.useState(
    activeItem ?? items[0]?.label ?? ""
  )
  const [internalSelectedProperties, setInternalSelectedProperties] = React.useState<string[]>(
    selectedProperties ?? ["200 Berkeley Street"]
  )
  const [internalPortfolioList, setInternalPortfolioList] = React.useState<AppNavPortfolio[]>(
    portfolios ?? VTS_PORTFOLIOS
  )
  const [dark, setDark] = React.useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  )

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  const active = activeItem ?? internalActive
  const currentSelectedProperties = selectedProperties ?? internalSelectedProperties
  const currentPortfolios = portfolios ?? internalPortfolioList

  const { toggleSidebar, state, isMobile, setOpenMobile } = useSidebar()

  const handleActivate = (label: string) => {
    if (isMobile) setOpenMobile(false)
    if (onActiveItemChange) onActiveItemChange(label)
    else setInternalActive(label)
  }

  const handleSelectedPropertiesChange = (next: string[]) => {
    if (onSelectedPropertiesChange) onSelectedPropertiesChange(next)
    else setInternalSelectedProperties(next)
  }

  const handleCreatePortfolio = (name: string, propertyNames: string[]) => {
    const next = [
      ...currentPortfolios,
      { name, propertyCount: propertyNames.length, properties: propertyNames },
    ]
    if (onPortfoliosChange) onPortfoliosChange(next)
    else setInternalPortfolioList(next)
  }
  const collapsed = state === "collapsed" && !isMobile

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      className={cn(
        "border-none",
        (variant === "floating" || variant === "inset") && "pt-4 pb-4 pl-4",
        className
      )}
    >
      {/* pb-4 + SidebarGroup's own pt-2 gives a 24px gap below the switcher. */}
      <SidebarHeader className="relative gap-2 p-2 pb-4">
        {/*
         * A plain button, not shadcn's Button: Button forces bare child svgs
         * to a fixed icon size (its small-square-icon convention), which
         * would squash this wide wordmark logo.
         */}
        <button
          type="button"
          onClick={() => setDark((value) => !value)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className={cn(
            "flex h-10 cursor-pointer items-center rounded-md transition-opacity hover:opacity-80",
            collapsed ? "justify-center" : "justify-start pl-2"
          )}
        >
          <VtsLogo markOnly={collapsed} className="text-sidebar-foreground" />
        </button>

        {collapsible !== "none" && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="absolute top-3 -right-3 z-20 hidden size-6 rounded-full bg-sidebar text-sidebar-foreground ring-1 ring-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring md:flex"
          >
            {collapsed ? (
              <ChevronRight className="size-3.5" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-3.5" aria-hidden="true" />
            )}
          </Button>
        )}

        <PropertySwitcher
          values={currentSelectedProperties}
          onValuesChange={handleSelectedPropertiesChange}
          portfolios={currentPortfolios}
          properties={properties}
          onCreatePortfolio={handleCreatePortfolio}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {items.map((item) => (
              <NavEntry
                key={item.label}
                item={item}
                activeItem={active}
                onActivate={handleActivate}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 p-2">
        <SidebarSeparator className="mx-0" />
        <SidebarMenu className="gap-0.5">
          {footerItems.map((item) =>
            item.label === "Activity feed" ? (
              <ActivityFeedNavItem key={item.label} item={item} />
            ) : (
              <NavLeafEntry
                key={item.label}
                item={item}
                activeItem={active}
                onActivate={handleActivate}
                secondary
              />
            )
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

/* ── Mobile top bar ─────────────────────────────────────────────────────── */

/** Below `md`, the sidebar collapses to an off-canvas sheet with no visible rail — this bar is the only way to open it. */
function MobileTopBar() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:hidden">
      <VtsLogo className="text-sidebar-foreground" />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={toggleSidebar}
        aria-label="Open navigation"
        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <Menu aria-hidden="true" />
      </Button>
    </header>
  )
}

/* ── Shell ──────────────────────────────────────────────────────────────── */

export interface AppNavigationProps extends AppSidebarProps {
  children?: React.ReactNode
  defaultOpen?: boolean
  /** Constrains the shell to its container instead of the viewport. */
  embedded?: boolean
}

/**
 * The VTS product app shell: a permanently dark sidebar plus the page surface.
 *
 * Pass `embedded` to render it inside a page (for example, a docs example)
 * rather than as the full-viewport application chrome. The shell is normally
 * viewport-anchored (`fixed` / `h-svh`), so `embedded` re-anchors it to its
 * container — the component itself is otherwise identical, collapsed rail and
 * all. Give the container a height; the shell fills it.
 */
export function AppNavigation({
  children,
  defaultOpen = true,
  embedded = false,
  className,
  ...sidebarProps
}: AppNavigationProps) {
  return (
    <TooltipProvider>
      <SidebarProvider
        defaultOpen={defaultOpen}
        className={cn(embedded && "relative h-full min-h-0 overflow-hidden")}
      >
        <AppSidebar
          {...sidebarProps}
          className={cn(embedded && "absolute h-full", className)}
        />
        <SidebarInset className={cn(embedded && "min-h-0 overflow-auto")}>
          <MobileTopBar />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
