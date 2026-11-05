import { useLayoutEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  ListFilter,
  Plus,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileFullPage } from "@/components/mobile-full-page"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface FilterField {
  id: string
  label: string
  options: string[]
}

const FILTER_FIELDS: FilterField[] = [
  { id: "lease-status", label: "Lease Status", options: ["Expired", "In Place", "Committed", "Subleased"] },
  {
    id: "size-range",
    label: "Size Range",
    options: ["Under 5,000 sf", "5,000–10,000 sf", "10,000–25,000 sf", "25,000+ sf"],
  },
  { id: "occupancy", label: "Occupancy", options: ["Occupied", "Partially occupied", "Vacant"] },
  { id: "retail", label: "Retail", options: ["Street retail", "Mall", "Strip center", "Mixed-use"] },
  { id: "renewal-status", label: "Renewal Status", options: ["Renewing", "Not renewing", "Undecided"] },
  { id: "space-type", label: "Space Type", options: ["Office", "Retail", "Industrial", "Flex"] },
  { id: "month-to-month", label: "Month to Month", options: ["Yes", "No"] },
]

/** Always on screen as their own dropdown pill, even with no value selected. */
const DEFAULT_FIELD_IDS = ["lease-status", "size-range", "occupancy"]

/** Heads the field column — names the entity these filters apply to. */
const FILTER_GROUP_LABEL = "Lease"

const SAVED_VIEWS = ["Leases needing attention", "Retail leases"]

/** Shared look for a tappable row inside the mobile sheet's list pages. */
const MOBILE_ROW =
  "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"

/** Matches the `gap-2` between items in the desktop filter row. */
const ROW_GAP = 8

export function FilterMenu({ className }: { className?: string }) {
  const [values, setValues] = useState<Record<string, string[]>>({})
  const [megaMenuFieldId, setMegaMenuFieldId] = useState(FILTER_FIELDS[0].id)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileFieldId, setMobileFieldId] = useState<string | null>(null)
  const [mobileSavedViewsSheetOpen, setMobileSavedViewsSheetOpen] = useState(false)

  const activeFieldIds = FILTER_FIELDS.filter((field) => (values[field.id]?.length ?? 0) > 0).map(
    (field) => field.id
  )
  const activeDefaultIds = DEFAULT_FIELD_IDS.filter((fieldId) => activeFieldIds.includes(fieldId))
  const inactiveDefaultIds = DEFAULT_FIELD_IDS.filter((fieldId) => !activeFieldIds.includes(fieldId))
  const extraFieldIds = activeFieldIds.filter((fieldId) => !DEFAULT_FIELD_IDS.includes(fieldId))
  const megaMenuField = FILTER_FIELDS.find((field) => field.id === megaMenuFieldId)!

  /** Applied pills, in the order the desktop row renders them. */
  const appliedIds = [...activeDefaultIds, ...extraFieldIds]

  /*
   * The desktop row has to stay on one line, so decide what actually fits
   * before painting: unselected default pills give way first, and once
   * they're gone applied pills collapse behind a "+N more" trigger.
   *
   * Widths come from an off-screen mirror of every pill rather than the live
   * row — measuring the row itself would mean measuring the result of the
   * last fit, which can't tell us whether a dropped pill would fit again.
   */
  const rowRef = useRef<HTMLDivElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)
  const tailRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ applied: appliedIds.length, unselected: inactiveDefaultIds.length })

  useLayoutEffect(() => {
    const row = rowRef.current
    const mirror = mirrorRef.current
    const tail = tailRef.current
    if (!row || !mirror || !tail) return

    const appliedCount = appliedIds.length
    const unselectedCount = inactiveDefaultIds.length

    const resolve = () => {
      const widths = Array.from(mirror.children, (child) => (child as HTMLElement).offsetWidth)
      const appliedW = widths.slice(0, appliedCount)
      const unselectedW = widths.slice(appliedCount, appliedCount + unselectedCount)
      // The mirror's trigger renders the largest possible count, so reserving
      // its width never under-estimates the real one.
      const overflowW = widths[widths.length - 1]

      const budget = row.clientWidth - tail.offsetWidth - ROW_GAP
      const span = (items: number[]) => items.reduce((total, w) => total + w + ROW_GAP, 0)

      // Drop unselected defaults from the right until the applied pills fit.
      for (let keep = unselectedCount; keep >= 0; keep--) {
        if (span(appliedW) + span(unselectedW.slice(0, keep)) <= budget) {
          return { applied: appliedCount, unselected: keep }
        }
      }

      // Still over: hide applied pills behind the overflow trigger. Going all
      // the way to zero keeps the single line intact when the row is narrow
      // enough that even one pill plus the trigger won't sit beside the tail.
      for (let keep = appliedCount - 1; keep >= 0; keep--) {
        if (span(appliedW.slice(0, keep)) + overflowW + ROW_GAP <= budget) {
          return { applied: keep, unselected: 0 }
        }
      }

      return { applied: 0, unselected: 0 }
    }

    const apply = () => {
      const next = resolve()
      setFit((prev) =>
        prev.applied === next.applied && prev.unselected === next.unselected ? prev : next
      )
    }

    apply()
    // Watching all three matters: the row catches container resizes, while
    // the mirror and tail catch the width shifts that land after first paint
    // (stylesheet injection in dev, webfont swap) — neither of which changes
    // the row's own width, so observing it alone would leave a stale fit.
    const observer = new ResizeObserver(apply)
    observer.observe(row)
    observer.observe(mirror)
    observer.observe(tail)
    return () => observer.disconnect()
  }, [values, appliedIds.length, inactiveDefaultIds.length])

  const visibleAppliedIds = appliedIds.slice(0, fit.applied)
  const visibleUnselectedIds = inactiveDefaultIds.slice(0, fit.unselected)
  const overflowCount = appliedIds.length - visibleAppliedIds.length

  const toggleValue = (fieldId: string, option: string) => {
    setValues((current) => {
      const existing = current[fieldId] ?? []
      const next = existing.includes(option)
        ? existing.filter((value) => value !== option)
        : [...existing, option]
      return { ...current, [fieldId]: next }
    })
  }

  const removeField = (fieldId: string) => {
    setValues((current) => {
      const next = { ...current }
      delete next[fieldId]
      return next
    })
  }

  const reset = () => setValues({})

  const handleMobileOpenChange = (next: boolean) => {
    setMobileOpen(next)
    if (!next) setMobileFieldId(null)
  }

  /**
   * Sits beside the title in the full-screen view: inside a field it clears
   * just that field, on the root list it clears every filter at once.
   */
  const mobileClearAction = mobileFieldId
    ? (values[mobileFieldId]?.length ?? 0) > 0
      ? { label: "Clear", onClick: () => removeField(mobileFieldId) }
      : null
    : activeFieldIds.length > 0
      ? { label: "Clear all", onClick: reset }
      : null

  function FieldValueItems({ field }: { field: FilterField }) {
    const selected = values[field.id] ?? []
    return (
      <>
        {selected.length > 0 && (
          <div className="flex justify-end py-1 pr-2 pl-1.5">
            <button
              type="button"
              onClick={() => removeField(field.id)}
              className="cursor-pointer text-xs font-medium text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        )}
        {field.options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            onCheckedChange={() => toggleValue(field.id, option)}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </>
    )
  }

  /** A field with a value set — shows the value, editable via dropdown, clearable with "x". */
  function ActivePill({ fieldId }: { fieldId: string }) {
    const field = FILTER_FIELDS.find((item) => item.id === fieldId)!
    const selected = values[fieldId] ?? []
    const label = selected.length === 1 ? selected[0] : field.label

    return (
      <div className={cn(buttonVariants({ variant: "outline" }), "gap-1.5 bg-primary/10 pr-2 pl-0")}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex h-full cursor-pointer items-center gap-1.5 pl-4 outline-none"
              />
            }
          >
            {label}
            {selected.length > 1 && (
              <Badge className="size-4 justify-center rounded-full p-0 text-[10px] leading-none">
                {selected.length}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <FieldValueItems field={field} />
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          aria-label={`Remove ${field.label} filter`}
          onClick={() => removeField(fieldId)}
          className="cursor-pointer rounded-full p-0.5 hover:bg-primary/10"
        >
          <X className="size-3.5" />
        </button>
      </div>
    )
  }

  /** A default field with no value yet — just a dropdown trigger, no "x". */
  function DefaultPill({ fieldId }: { fieldId: string }) {
    const field = FILTER_FIELDS.find((item) => item.id === fieldId)!

    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button type="button" variant="outline" />}>
          {field.label}
          <ChevronDown data-icon="inline-end" className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <FieldValueItems field={field} />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  /** Root page of the full-screen filters view — every filter field, grouped. */
  function MobileFieldList() {
    return (
      <>
        <div className="px-2 py-2.5 text-sm text-muted-foreground">{FILTER_GROUP_LABEL}</div>
        {FILTER_FIELDS.map((field) => {
          const hasValues = (values[field.id]?.length ?? 0) > 0
          return (
            <button
              key={field.id}
              type="button"
              className={MOBILE_ROW}
              onClick={() => setMobileFieldId(field.id)}
            >
              {hasValues && <CircleCheck className="size-4 shrink-0 text-primary" />}
              <span className="flex-1 truncate">{field.label}</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          )
        })}
      </>
    )
  }

  /** Drill-down page showing one field's options as checkbox rows. */
  function MobileFieldValues({ fieldId }: { fieldId: string }) {
    const field = FILTER_FIELDS.find((item) => item.id === fieldId)!
    const selected = values[fieldId] ?? []

    return (
      <>
        {field.options.map((option) => (
          <button
            key={option}
            type="button"
            className={MOBILE_ROW}
            onClick={() => toggleValue(fieldId, option)}
          >
            <Checkbox checked={selected.includes(option)} className="pointer-events-none" />
            <span className="truncate">{option}</span>
          </button>
        ))}
      </>
    )
  }

  /** The saved view rows shared by the drill-down page and the standalone sheet. */
  function SavedViewsRows() {
    return (
      <>
        {SAVED_VIEWS.map((view) => (
          <button key={view} type="button" className={MOBILE_ROW}>
            {view}
          </button>
        ))}
        <button type="button" className={MOBILE_ROW}>
          <Plus className="size-4 text-muted-foreground" />
          Create view
        </button>
      </>
    )
  }

  /** Shared by the "Filters" button and the overflow trigger. */
  function FilterMegaMenuContent() {
    return (
      <PopoverContent
        align="start"
        className="flex w-auto flex-row items-stretch gap-0 overflow-hidden rounded-xl p-0"
      >
        {/* Field list — popover surface, rounded on the left only. */}
        {/* h-auto overrides Command's own `size-full`, whose height:100% would
            resolve against the auto-height popover and defeat the stretch. */}
        {/*
          cmdk always keeps exactly one item marked data-selected for
          keyboard nav — even controlled to "", it self-corrects back to
          the first item, and disablePointerSelection only stops *hover*
          from moving that marker, not the initial one. Rather than fight
          cmdk's model, cancel data-selected's own background (which
          command.tsx applies by default) on these items and drive the
          highlight purely off real CSS hover: and our own `active` state,
          neither of which cmdk can get stuck or force.
        */}
        <Command className="h-auto w-[183px] self-stretch rounded-none!" loop>
          <div className="px-2 py-2.5 text-sm text-muted-foreground">{FILTER_GROUP_LABEL}</div>
          <CommandList className="max-h-none">
            {FILTER_FIELDS.map((field) => {
              const active = field.id === megaMenuFieldId
              const hasValues = (values[field.id]?.length ?? 0) > 0
              return (
                <CommandItem
                  key={field.id}
                  value={field.label}
                  onSelect={() => setMegaMenuFieldId(field.id)}
                  className={cn(
                    "data-selected:bg-transparent data-selected:text-foreground hover:bg-accent hover:text-accent-foreground",
                    // data-selected:bg-transparent is an attribute selector, which
                    // out-specifies the plain .bg-muted below — force this one with
                    // `!` so the genuinely active field always wins regardless.
                    active && "bg-muted! text-foreground!",
                    // CommandItem always appends its own trailing checkmark icon
                    // (for the data-checked convention) after our children — its
                    // ml-auto was winning the "push to the edge" over our own
                    // chevron, leaving the chevron stranded mid-row. We don't use
                    // that convention here, so just drop it from layout.
                    "[&>svg:last-child]:hidden"
                  )}
                >
                  {/* command.tsx forces descendant svgs to text-foreground while
                      cmdk's own data-selected flag is set (see filter-menu's note
                      above on why that's always true for some item) — force this
                      one to stay primary regardless. */}
                  {hasValues && <CircleCheck className="size-4 shrink-0 text-primary!" />}
                  <span className="flex-1 truncate">{field.label}</span>
                  {active && <ChevronRight className="ml-auto size-4" />}
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>

        {/* Values for the selected field — recessed onto the page surface. */}
        <Command className="h-auto w-[183px] self-stretch rounded-none! bg-background" loop>
          <CommandList className="max-h-none">
            {megaMenuField.options.map((option) => {
              const checked = (values[megaMenuField.id] ?? []).includes(option)
              return (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => toggleValue(megaMenuField.id, option)}
                  className="data-selected:bg-transparent data-selected:text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Checkbox checked={checked} className="pointer-events-none" />
                  <span className="truncate">{option}</span>
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    )
  }

  /** Stands in for the applied pills that didn't fit; opens the megamenu. */
  function OverflowTrigger({ count }: { count: number }) {
    return (
      <Popover>
        <PopoverTrigger
          render={<Button type="button" variant="ghost" className="shrink-0 font-semibold" />}
        >
          + {count} more
        </PopoverTrigger>
        <FilterMegaMenuContent />
      </Popover>
    )
  }

  return (
    <div className={className}>
      <div ref={rowRef} className="relative hidden items-center gap-2 md:flex">
        {/* Every pill at full size, off-screen, purely so the fitting pass can
            measure them. aria-hidden + inert keeps it out of the a11y tree. */}
        <div
          ref={mirrorRef}
          aria-hidden
          inert
          className="pointer-events-none invisible absolute top-0 left-0 flex items-center gap-2"
        >
          {appliedIds.map((fieldId) => (
            <ActivePill key={fieldId} fieldId={fieldId} />
          ))}
          {inactiveDefaultIds.map((fieldId) => (
            <DefaultPill key={fieldId} fieldId={fieldId} />
          ))}
          <OverflowTrigger count={appliedIds.length} />
        </div>

        {visibleAppliedIds.map((fieldId) => (
          <ActivePill key={fieldId} fieldId={fieldId} />
        ))}

        {visibleUnselectedIds.map((fieldId) => (
          <DefaultPill key={fieldId} fieldId={fieldId} />
        ))}

        {overflowCount > 0 && <OverflowTrigger count={overflowCount} />}

        {/* Always on screen, so the fitting pass measures it as one block and
            budgets the pills against whatever is left. */}
        <div ref={tailRef} className="flex shrink-0 items-center gap-2">
          <Separator orientation="vertical" className="mx-1 h-6 self-center!" />

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button type="button" variant="outline" />}>
              <Bookmark data-icon="inline-start" className="size-4" />
              Saved views
              <ChevronDown data-icon="inline-end" className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {SAVED_VIEWS.map((view) => (
                <DropdownMenuItem key={view}>{view}</DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <Plus className="size-4 text-muted-foreground" />
                Create view
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger render={<Button type="button" variant="outline" />}>
              <ListFilter data-icon="inline-start" className="size-4" />
              Filters
              {activeFieldIds.length > 0 && (
                <Badge className="size-4 justify-center rounded-full p-0 text-[10px] leading-none">
                  {activeFieldIds.length}
                </Badge>
              )}
              <ChevronDown data-icon="inline-end" className="size-4" />
            </PopoverTrigger>
            <FilterMegaMenuContent />
          </Popover>

          {activeFieldIds.length > 0 && (
            <Button type="button" variant="link" size="sm" className="h-8" onClick={reset}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Below md there's no room for every pill — Saved views collapses to a
          bottom sheet, and Filters collapses to a full-screen takeover. */}
      <div className="flex items-center gap-2 md:hidden">
        <Sheet open={mobileSavedViewsSheetOpen} onOpenChange={setMobileSavedViewsSheetOpen}>
          <SheetTrigger render={<Button type="button" variant="outline" />}>
            <Bookmark data-icon="inline-start" className="size-4" />
            Saved views
            <ChevronDown data-icon="inline-end" className="size-4" />
          </SheetTrigger>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="max-h-[85vh] gap-0 overflow-hidden rounded-t-2xl p-0"
          >
            <div className="mx-auto mt-2 mb-1 h-1 w-12 shrink-0 rounded-full bg-border" />
            <div className="flex flex-col overflow-y-auto p-1">
              <SavedViewsRows />
            </div>
          </SheetContent>
        </Sheet>

        <MobileFullPage
          trigger={
            <Button type="button" variant="outline">
              <ListFilter data-icon="inline-start" className="size-4" />
              Filters
              {activeFieldIds.length > 0 && (
                <Badge className="size-4 justify-center rounded-full p-0 text-[10px] leading-none">
                  {activeFieldIds.length}
                </Badge>
              )}
              <ChevronDown data-icon="inline-end" className="size-4" />
            </Button>
          }
          open={mobileOpen}
          onOpenChange={handleMobileOpenChange}
          className="bg-background"
        >
          {/* The close affordance sits in its own corner above the title row,
              so it stays put as the title swaps between the two pages. */}
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => handleMobileOpenChange(false)}
            className="absolute top-2 right-4 flex size-[30px] cursor-pointer items-center justify-center rounded-full bg-popover text-foreground shadow-sm"
          >
            <X className="size-3.5" />
          </button>

          {/* pt-[42px] puts the title's own text at 42px from the top, where it
              sits in both the list and the drilled-in field. */}
          <div className="flex shrink-0 items-center gap-2 px-4 pt-[42px] pb-2">
            {mobileFieldId && (
              <button
                type="button"
                aria-label="Back to filters"
                onClick={() => setMobileFieldId(null)}
                className="cursor-pointer text-foreground"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <h2 className="flex-1 truncate text-base leading-6 font-semibold text-foreground">
              {mobileFieldId ? FILTER_FIELDS.find((field) => field.id === mobileFieldId)!.label : "Filters"}
            </h2>
            {mobileClearAction && (
              <button
                type="button"
                onClick={mobileClearAction.onClick}
                className="shrink-0 cursor-pointer text-sm font-medium text-primary hover:underline"
              >
                {mobileClearAction.label}
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="flex flex-col gap-0.5 rounded-lg bg-popover p-2.5 shadow-md">
              {mobileFieldId ? <MobileFieldValues fieldId={mobileFieldId} /> : <MobileFieldList />}
            </div>
          </div>
        </MobileFullPage>

        {activeFieldIds.length > 0 && (
          <Button type="button" variant="link" size="sm" className="h-8" onClick={reset}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}
