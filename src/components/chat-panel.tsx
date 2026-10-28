import { useState } from "react"
import { ArrowUp, Layers, Mic, Paperclip, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const SUGGESTED_PROMPTS = [
  "Summarize this page",
  "Show Acme's termination rights",
  "What is Acme's expiring base rent?",
]

function SuggestionRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="h-12 w-full justify-start gap-3 rounded-xl border-0 bg-primary/10 px-3 font-normal text-foreground hover:bg-primary/15"
    >
      <Sparkles className="size-4 text-primary" />
      <span className="truncate text-sm">{label}</span>
    </Button>
  )
}

export function AiChatTriggerButton({
  active,
  onClick,
}: {
  active: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      aria-label={active ? "Close VTS AI chat" : "Open VTS AI chat"}
      aria-pressed={active}
      onClick={onClick}
      className={active ? undefined : "bg-muted text-primary hover:bg-muted/80"}
    >
      <Sparkles className="size-4" />
    </Button>
  )
}

export function ChatPanel() {
  const [message, setMessage] = useState("")

  return (
    <div className="fixed inset-y-0 right-0 z-30 w-[347px] py-4 pr-4 pl-2">
      <Card className="flex size-full flex-col gap-0 border border-border p-0 ring-0 shadow-sm">
        <div className="flex h-14 shrink-0 items-center px-4">
          <p className="text-sm font-semibold text-foreground">VTS AI</p>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-2 overflow-y-auto px-4 pt-6 pb-2">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-6 text-center">
            <Sparkles className="size-7 text-primary" />
            <p className="text-base font-semibold text-foreground">Hi, Ian. How can I help?</p>
          </div>

          <div className="flex flex-col gap-2 pb-4">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <SuggestionRow key={prompt} label={prompt} onClick={() => setMessage(prompt)} />
            ))}
          </div>
        </div>

        <div className="p-3">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-3">
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask VTS anything..."
              className="min-h-14 resize-none border-0 bg-transparent p-0 shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Paperclip className="size-4" />
                <Layers className="size-4" />
              </div>
              <div className="flex items-center gap-2">
                <Mic className="size-4 text-muted-foreground" />
                <Button
                  size="icon-sm"
                  className="rounded-full"
                  disabled={message.length === 0}
                  onClick={() => setMessage("")}
                  aria-label="Send message"
                >
                  <ArrowUp className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
