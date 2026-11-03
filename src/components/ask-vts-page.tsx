import { useState } from "react"
import { ArrowUp, Copy, ListChecks, Lock, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const RECENT_CONVERSATIONS = [
  { id: "lease-expire", label: "When does the lease expire?" },
  { id: "amazon-termination", label: "Does Amazon have a termina..." },
]

const SOURCE_FILTERS = [
  "Leases",
  "Deals",
  "Proposals",
  "Loan documents",
  "Building documents",
  "Floor plans",
  "Market data",
]

const SUGGESTED_PROMPTS = [
  "What are the renewal options for Google?",
  "Does Amazon have a termination right?",
  "Show me all upcoming expirations in Q3",
]

export function AskVtsPage() {
  const [activeConversation, setActiveConversation] = useState(RECENT_CONVERSATIONS[0].id)
  const [sourceFilter, setSourceFilter] = useState("Leases")
  const [message, setMessage] = useState(
    "What is the average expiring base rent for these 2 tenants rolling within the next 24 months?"
  )

  return (
    <div className="flex h-full min-h-[calc(100svh-4rem)] overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex w-64 shrink-0 flex-col gap-4 border-r border-border p-4">
        <Button className="justify-start gap-2">
          <Plus className="size-4" />
          New chat
        </Button>

        <div className="flex flex-col gap-1">
          <p className="px-2 pb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Recent conversations
          </p>
          {RECENT_CONVERSATIONS.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveConversation(conversation.id)}
              className={cn(
                "cursor-pointer truncate rounded-md px-2 py-2 text-left text-sm",
                conversation.id === activeConversation
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {conversation.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="border-b border-border px-6 py-4">
          <p className="text-sm font-semibold text-foreground">VTS AI</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">Hi, Ian. How can I help?</h1>

          <div className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-border p-4 shadow-sm">
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask VTS anything..."
              className="min-h-16 resize-none border-0 p-0 shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:bg-primary/10">
                <ListChecks className="size-4" />
                Select sources
                <Badge className="bg-primary text-primary-foreground">214</Badge>
              </Button>
              <Button
                size="icon-sm"
                className="rounded-full"
                disabled={message.length === 0}
                aria-label="Send message"
              >
                <ArrowUp className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {SOURCE_FILTERS.map((filter) => {
              const active = filter === sourceFilter
              return (
                <Button
                  key={filter}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSourceFilter(filter)}
                  className={cn(
                    "gap-1.5",
                    active ? "border-primary text-primary" : "border-border text-muted-foreground"
                  )}
                >
                  <Lock className="size-3" />
                  {filter}
                </Button>
              )
            })}
          </div>

          <div className="grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setMessage(prompt)}
                className="flex cursor-pointer flex-col gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted/50"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Copy className="size-4 text-primary" />
                </span>
                <span className="text-sm text-foreground">{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="pb-4 text-center text-xs text-muted-foreground">
          Verified by VTS AI Audit Engine · Real-time lease data sync active
        </p>
      </div>
    </div>
  )
}
