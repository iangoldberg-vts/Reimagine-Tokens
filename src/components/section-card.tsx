import { Fragment, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"

export interface SectionCardItem {
  label: string
  value: ReactNode
  /** Renders the value at headline size — use for a single lead metric. */
  emphasized?: boolean
}

interface SectionCardProps {
  title: string
  items: SectionCardItem[]
  /** Two columns pairs items left/right (even index left, odd index right). */
  columns?: 1 | 2
  collapsible?: boolean
  defaultOpen?: boolean
  onEdit?: () => void
  className?: string
}

function SectionCardRow({ item }: { item: SectionCardItem }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-4">
      <span className="text-sm text-muted-foreground">{item.label}</span>
      <span
        className={
          item.emphasized
            ? "text-2xl font-semibold text-foreground"
            : "text-sm font-medium text-foreground"
        }
      >
        {item.value}
      </span>
    </div>
  )
}

function SectionCardColumn({ items }: { items: SectionCardItem[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          <SectionCardRow item={item} />
          <Separator />
        </Fragment>
      ))}
    </div>
  )
}

export function SectionCard({
  title,
  items,
  columns = 1,
  collapsible = false,
  defaultOpen = true,
  onEdit,
  className,
}: SectionCardProps) {
  const leftItems = columns === 2 ? items.filter((_, i) => i % 2 === 0) : items
  const rightItems = columns === 2 ? items.filter((_, i) => i % 2 === 1) : []

  const header = (
    <CardHeader>
      <div className="flex items-center gap-2">
        {collapsible && (
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="group/section-card-trigger -ml-2"
              >
                <ChevronDown className="transition-transform group-aria-expanded/section-card-trigger:rotate-180" />
              </Button>
            }
          />
        )}
        <CardTitle>{title}</CardTitle>
      </div>
      {onEdit && (
        <CardAction>
          <Button variant="link" size="sm" onClick={onEdit} className="h-auto p-0">
            Edit
          </Button>
        </CardAction>
      )}
    </CardHeader>
  )

  const body = (
    <CardContent className={columns === 2 ? "grid grid-cols-2 gap-x-8" : undefined}>
      {columns === 2 ? (
        <>
          <SectionCardColumn items={leftItems} />
          <SectionCardColumn items={rightItems} />
        </>
      ) : (
        <SectionCardColumn items={items} />
      )}
    </CardContent>
  )

  if (collapsible) {
    return (
      <Card className={className}>
        <Collapsible defaultOpen={defaultOpen}>
          {header}
          <CollapsibleContent>{body}</CollapsibleContent>
        </Collapsible>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {header}
      {body}
    </Card>
  )
}
