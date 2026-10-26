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
  Scale,
  ShieldCheck,
  Sparkle,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { TooltipProvider } from "@/components/ui/tooltip"
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
}

export interface AppNavPortfolio {
  name: string
  propertyCount: number
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
  { name: "Northeast Corridor", propertyCount: 5 },
  { name: "West Coast Portfolio", propertyCount: 3 },
  { name: "Midwest Holdings", propertyCount: 3 },
]

export const VTS_PROPERTIES: AppNavProperty[] = [
  { name: "VTS Tower Headquarters", address: "114 West 41st Street, New York, NY 10036" },
  { name: "One Financial Plaza", address: "1 Financial Plaza, Providence, RI 02903" },
  { name: "Empire State Building", address: "350 5th Ave, New York, NY 10118" },
  { name: "Salesforce Tower", address: "415 Mission St, San Francisco, CA 94105" },
  { name: "200 Berkeley Street", address: "200 Berkeley St, Boston, MA 02116" },
  { name: "Willis Tower", address: "233 S Wacker Dr, Chicago, IL 60606" },
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

/* ── Property switcher ──────────────────────────────────────────────────── */

interface PropertySwitcherProps {
  value: string
  onValueChange: (value: string) => void
  portfolios: AppNavPortfolio[]
  properties: AppNavProperty[]
}

function PropertySwitcher({
  value,
  onValueChange,
  portfolios,
  properties,
}: PropertySwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile

  const select = (next: string) => {
    onValueChange(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label={`Switch property — currently ${value}`}
            className={cn(
              "flex min-h-12 w-full items-center gap-2 rounded-lg p-2 text-left text-sm text-sidebar-foreground ring-sidebar-ring transition-colors outline-none",
              "ring-1 ring-sidebar-border hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring data-popup-open:bg-sidebar-accent",
              collapsed && "min-h-0 justify-center"
            )}
          />
        }
      >
        <Building2 className="size-4 shrink-0" aria-hidden="true" />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 font-medium leading-snug">{value}</span>
            <ChevronDown
              className="size-4 shrink-0 opacity-60 transition-transform duration-200 in-data-popup-open:rotate-180"
              aria-hidden="true"
            />
          </>
        )}
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={8}
        className="w-80 p-0 ring-sidebar-border **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider"
        style={SIDEBAR_SURFACE_VARS}
      >
        <Command>
          <CommandInput placeholder="Search properties..." />
          <CommandList className="max-h-80">
            <CommandEmpty>No properties found.</CommandEmpty>

            <CommandGroup>
              <CommandItem value="All assets" onSelect={() => select("All assets")}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent">
                  <Layers className="size-4 text-sidebar-primary" aria-hidden="true" />
                </span>
                <span className="font-medium">All assets</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Portfolios">
              {portfolios.map((portfolio) => (
                <CommandItem
                  key={portfolio.name}
                  value={portfolio.name}
                  onSelect={() => select(portfolio.name)}
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

            <CommandGroup heading="Properties">
              {properties.map((property) => (
                <CommandItem
                  key={property.name}
                  value={`${property.name} ${property.address}`}
                  onSelect={() => select(property.name)}
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
                onClick={() => onActivate(sub.label)}
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
      <DropdownMenu>
        <DropdownMenuTrigger
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
        onClick={() => onActivate(item.label)}
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
  property?: string
  onPropertyChange?: (property: string) => void
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
  portfolios = VTS_PORTFOLIOS,
  properties = VTS_PROPERTIES,
  activeItem,
  onActiveItemChange,
  property,
  onPropertyChange,
  collapsible = "icon",
  variant = "sidebar",
  className,
}: AppSidebarProps) {
  const [internalActive, setInternalActive] = React.useState(
    activeItem ?? items[0]?.label ?? ""
  )
  const [internalProperty, setInternalProperty] = React.useState(
    property ?? "200 Berkeley Street"
  )

  const active = activeItem ?? internalActive
  const currentProperty = property ?? internalProperty

  const handleActivate = (label: string) => {
    if (onActiveItemChange) onActiveItemChange(label)
    else setInternalActive(label)
  }

  const handlePropertyChange = (next: string) => {
    if (onPropertyChange) onPropertyChange(next)
    else setInternalProperty(next)
  }

  const { toggleSidebar, state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      className={cn("border-none", className)}
    >
      {/* pb-4 + SidebarGroup's own pt-2 gives a 24px gap below the switcher. */}
      <SidebarHeader className="relative gap-2 p-2 pb-4">
        <div className="flex h-10 items-center justify-center">
          <VtsLogo markOnly={collapsed} className="text-sidebar-foreground" />
        </div>

        {collapsible !== "none" && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="absolute top-3 -right-3 z-20 hidden size-6 items-center justify-center rounded-full bg-sidebar text-sidebar-foreground ring-1 ring-sidebar-border transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring md:flex"
          >
            {collapsed ? (
              <ChevronRight className="size-3.5" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-3.5" aria-hidden="true" />
            )}
          </button>
        )}

        <PropertySwitcher
          value={currentProperty}
          onValueChange={handlePropertyChange}
          portfolios={portfolios}
          properties={properties}
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
          {footerItems.map((item) => (
            <NavLeafEntry
              key={item.label}
              item={item}
              activeItem={active}
              onActivate={handleActivate}
              secondary
            />
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
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
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
