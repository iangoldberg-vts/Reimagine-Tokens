import { useState } from "react"
import { Bookmark, ChevronDown, ChevronRight, CircleCheck, ListFilter, Plus, X } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
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

export function FilterMenu({ className }: { className?: string }) {
  const [values, setValues] = useState<Record<string, string[]>>({})
  const [megaMenuFieldId, setMegaMenuFieldId] = useState(FILTER_FIELDS[0].id)

  const activeFieldIds = FILTER_FIELDS.filter((field) => (values[field.id]?.length ?? 0) > 0).map(
    (field) => field.id
  )
  const activeDefaultIds = DEFAULT_FIELD_IDS.filter((fieldId) => activeFieldIds.includes(fieldId))
  const inactiveDefaultIds = DEFAULT_FIELD_IDS.filter((fieldId) => !activeFieldIds.includes(fieldId))
  const extraFieldIds = activeFieldIds.filter((fieldId) => !DEFAULT_FIELD_IDS.includes(fieldId))
  const megaMenuField = FILTER_FIELDS.find((field) => field.id === megaMenuFieldId)!

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

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {activeDefaultIds.map((fieldId) => (
        <ActivePill key={fieldId} fieldId={fieldId} />
      ))}

      {extraFieldIds.map((fieldId) => (
        <ActivePill key={fieldId} fieldId={fieldId} />
      ))}

      {inactiveDefaultIds.map((fieldId) => (
        <DefaultPill key={fieldId} fieldId={fieldId} />
      ))}

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
            <div className="border-b border-border px-2 py-2.5 text-sm text-muted-foreground">
              {FILTER_GROUP_LABEL}
            </div>
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
      </Popover>

      {activeFieldIds.length > 0 && (
        <Button type="button" variant="link" size="sm" className="h-8" onClick={reset}>
          Clear all
        </Button>
      )}
    </div>
  )
}
