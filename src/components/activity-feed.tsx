import { useState, type ReactElement } from "react"
import {
  CalendarIcon,
  Expand,
  FilePlusCorner,
  MessageSquare,
  Paperclip,
  Shrink,
  X,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MobileFullPage } from "@/components/mobile-full-page"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

interface ActivityItem {
  id: string
  actor: string
  action: string
  highlight: string
  timestamp: string
  icon: "comment" | "create"
}

interface ActivityGroup {
  id: string
  entity: string
  address: string
  items: ActivityItem[]
  moreCount?: number
}

const GROUPS: ActivityGroup[] = [
  {
    id: "starbucks-northpark",
    entity: "Starbucks Corporation",
    address: "NorthPark Center, 8687 North Central Expressway",
    items: [
      {
        id: "1",
        actor: "Jill Segal",
        action: "commented:",
        highlight: "@Jill Segal test",
        timestamp: "1 day ago",
        icon: "comment",
      },
    ],
  },
  {
    id: "starbucks-metro",
    entity: "Starbucks Corporation",
    address: "Metro Tower, 500 Park Lane",
    items: [
      {
        id: "2",
        actor: "Ian Goldberg",
        action: "commented:",
        highlight: "attached a file",
        timestamp: "10/13/26",
        icon: "comment",
      },
    ],
    moreCount: 1,
  },
  {
    id: "taco",
    entity: "Taco",
    address: "1100 Lonsdale, 1100 Lonsdale",
    items: [
      {
        id: "3",
        actor: "Penny Marble",
        action: "commented:",
        highlight: "pmarble.uk@gmail.com",
        timestamp: "10/07/26",
        icon: "comment",
      },
    ],
  },
  {
    id: "apple",
    entity: "Apple Inc.",
    address: "1100 Lonsdale, 1100 Lonsdale",
    items: [
      {
        id: "4",
        actor: "Ian Goldberg",
        action: "created a",
        highlight: "new deal",
        timestamp: "09/30/26",
        icon: "create",
      },
    ],
  },
]

function ActivityIcon({ type }: { type: ActivityItem["icon"] }) {
  const Icon = type === "create" ? FilePlusCorner : MessageSquare
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-background ${
        type === "create" ? "bg-chart-4" : "bg-chart-5"
      }`}
    >
      <Icon className="size-4" />
    </span>
  )
}

function formatDate(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${mm}/${dd}/${date.getFullYear()}`
}

function CommentComposer({
  onCancel,
  onPost,
}: {
  onCancel: () => void
  onPost: () => void
}) {
  const [value, setValue] = useState("")
  const [date, setDate] = useState<Date | undefined>()
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  return (
    <div className="flex w-full flex-col gap-2">
      <Textarea
        placeholder="Enter comment"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button variant="outline" className="justify-start gap-2 font-normal text-muted-foreground">
        <Paperclip className="size-4" />
        Attach or drop files
      </Button>
      <InputGroup>
        <InputGroupInput placeholder="MM/DD/YYYY" readOnly value={date ? formatDate(date) : ""} />
        <InputGroupAddon align="inline-end">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger
              render={<InputGroupButton size="icon-xs" aria-label="Choose a date" />}
            >
              <CalendarIcon className="size-4" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0 data-closed:hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selected) => {
                  setDate(selected)
                  setDatePickerOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex items-center justify-end gap-2">
        <Button variant="link" size="sm" className="h-auto p-0" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={value.length === 0}
          onClick={() => {
            setValue("")
            onPost()
          }}
        >
          Post
        </Button>
      </div>
    </div>
  )
}

function ActivityGroupCard({ group }: { group: ActivityGroup }) {
  const [commentOpen, setCommentOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div>
        <p className="font-semibold text-foreground">{group.entity}</p>
        <p className="text-sm text-muted-foreground">{group.address}</p>
      </div>

      <div className="flex flex-col gap-4">
        {group.items.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <ActivityIcon type={item.icon} />
            <div className="flex flex-col gap-1">
              <p className="text-sm text-foreground">
                <span className="font-semibold">{item.actor}</span> {item.action}{" "}
                <span className={item.icon === "create" ? "font-semibold" : undefined}>
                  {item.highlight}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {commentOpen ? (
        <CommentComposer
          onCancel={() => setCommentOpen(false)}
          onPost={() => setCommentOpen(false)}
        />
      ) : (
        <div className="flex items-center justify-between">
          {group.moreCount ? (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground"
            >
              +{group.moreCount} more update
            </Button>
          ) : (
            <span />
          )}

          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => setCommentOpen(true)}
          >
            Leave a comment
          </Button>
        </div>
      )}
    </div>
  )
}

function ActivityFeedBody() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col divide-y divide-border">
        {GROUPS.map((group) => (
          <ActivityGroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}

interface ActivityFeedProps {
  /** Renders its own trigger, anchoring the compact popover. */
  trigger: ReactElement
  /** Reflects whether either the compact popover or the expanded modal is showing. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ActivityFeed({ trigger, open: openProp, onOpenChange }: ActivityFeedProps) {
  const isMobile = useIsMobile()
  const [internalOpen, setInternalOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const open = openProp ?? internalOpen

  function setOpen(next: boolean) {
    if (onOpenChange) onOpenChange(next)
    else setInternalOpen(next)
    if (!next) setExpanded(false)
  }

  function renderHeader(onClose?: () => void) {
    return (
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border p-4">
        <p className="font-semibold text-foreground">Activity feed</p>
        <div className="flex items-center gap-2">
          <Button variant="link" size="sm" className="h-auto p-0">
            Mark all as read
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close activity feed"
              onClick={onClose}
              className="-mr-1"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  const compactContent = (
    <>
      {renderHeader()}
      <ActivityFeedBody />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Expand activity feed"
        onClick={() => setExpanded(true)}
        className="absolute right-2 bottom-2"
      >
        <Expand className="size-4" />
      </Button>
    </>
  )

  return (
    <>
      {isMobile ? (
        <MobileFullPage trigger={trigger} open={open} onOpenChange={setOpen}>
          {renderHeader(() => setOpen(false))}
          <ActivityFeedBody />
        </MobileFullPage>
      ) : (
        <Popover open={open && !expanded} onOpenChange={setOpen}>
          <PopoverTrigger render={trigger} />
          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            className="relative flex h-[32rem] w-96 flex-col gap-0 overflow-hidden p-0 data-closed:hidden"
          >
            {compactContent}
          </PopoverContent>
        </Popover>
      )}

      <Dialog open={open && expanded} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[43.5rem] w-[644px] max-w-[calc(100%-2rem)] flex-col gap-0 p-0 sm:max-w-none"
        >
          {renderHeader()}
          <ActivityFeedBody />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Collapse activity feed"
            onClick={() => setExpanded(false)}
            className="absolute right-2 bottom-2"
          >
            <Shrink className="size-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
