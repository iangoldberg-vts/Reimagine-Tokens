import { useState, type ReactElement } from "react"
import { CalendarIcon, MessageSquare, Paperclip, Plus, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  unread: boolean
  tag?: string
  items: ActivityItem[]
  moreCount?: number
}

const GROUPS: ActivityGroup[] = [
  {
    id: "starbucks-northpark",
    entity: "Starbucks Corporation",
    address: "NorthPark Center, 8687 North Central Expressway",
    unread: false,
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
    unread: true,
    tag: "a big new space",
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
    unread: true,
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
    unread: true,
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
  const Icon = type === "create" ? Plus : MessageSquare
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-background ${
        type === "create" ? "bg-success" : "bg-warning"
      }`}
    >
      <Icon className="size-4" />
    </span>
  )
}

function CommentComposer({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState("")

  return (
    <div className="flex w-80 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <Textarea
          placeholder="Enter comment"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="flex-1"
        />
        <Button variant="ghost" size="icon-sm" onClick={onClose} className="-mt-1 -mr-1">
          <XIcon />
        </Button>
      </div>
      <Button variant="outline" className="justify-start gap-2 font-normal text-muted-foreground">
        <Paperclip className="size-4" />
        Attach or drop files
      </Button>
      <InputGroup>
        <InputGroupInput placeholder="MM/DD/YYYY" />
        <InputGroupAddon align="inline-end">
          <CalendarIcon className="size-4" />
        </InputGroupAddon>
      </InputGroup>
      <Button disabled={value.length === 0} className="self-end">
        Post
      </Button>
    </div>
  )
}

function ActivityGroupCard({ group }: { group: ActivityGroup }) {
  const [commentOpen, setCommentOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-foreground">{group.entity}</p>
          <p className="text-sm text-muted-foreground">{group.address}</p>
        </div>
        {group.unread && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
      </div>

      {group.tag && (
        <Badge variant="secondary" className="w-fit">
          {group.tag}
        </Badge>
      )}

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

        <Popover open={commentOpen} onOpenChange={setCommentOpen}>
          <PopoverTrigger render={<Button variant="link" size="sm" className="h-auto p-0" />}>
            Leave a comment
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <CommentComposer onClose={() => setCommentOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

interface ActivityFeedProps {
  /** Renders its own trigger. Omit when the feed is opened from elsewhere via `open`/`onOpenChange`. */
  trigger?: ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ActivityFeed({ trigger, open, onOpenChange }: ActivityFeedProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger render={trigger} />}
      <SheetContent showCloseButton={false} className="gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b border-border p-4">
          <SheetTitle className="font-semibold">Activity feed</SheetTitle>
          <Button variant="link" size="sm" className="h-auto p-0">
            Mark all as read
          </Button>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="flex flex-col divide-y divide-border">
            {GROUPS.map((group) => (
              <ActivityGroupCard key={group.id} group={group} />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
