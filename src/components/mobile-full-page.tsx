import type { CSSProperties, ReactElement, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

/**
 * A Dialog dressed up as a full-screen page takeover — used on mobile in
 * place of an anchored Popover, which has no sensible "take over the
 * screen" mode of its own.
 *
 * `trigger` must be rendered through `DialogTrigger` (not a plain cloned
 * element with its own onClick): base-ui's dismiss logic only recognizes a
 * press as "the one that opened this dialog" — and so not an immediate
 * outside-press closing it right back — when the element is registered as
 * the dialog's own reference/trigger.
 */
export function MobileFullPage({
  trigger,
  open,
  onOpenChange,
  className,
  style,
  children,
}: {
  trigger: ReactElement
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent
        showCloseButton={false}
        style={style}
        className={cn(
          "top-0 right-0 bottom-0 left-0 flex size-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0 ring-0 sm:max-w-none",
          // Nested inside the mobile nav's own dialog, the base fade/zoom
          // entrance animation gets stuck mid-transition (never clears
          // data-starting-style, leaving it invisible) — neutralize only the
          // *entrance* so it renders at rest regardless of whether the
          // transition completes. Leave the exit (fade-out-0/zoom-out-95,
          // DialogContent's own defaults) alone: those target hidden, which
          // is what actually lets it disappear. Overriding them to "100"
          // would target "still fully visible" — a no-op transition that
          // never changes any property, so transitionend never fires and
          // the dialog can get stuck open after being dismissed.
          "data-open:fade-in-100 data-open:zoom-in-100",
          className
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}
