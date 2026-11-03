import { Image as ImageIcon, type LucideIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  /** Rendered next to the title as "| pageName", in muted text. */
  pageName?: string
  /** Small caption line above the title. */
  eyebrow?: string
  /** Line below the title — an address, description, etc. Ignored when `badge` is set. */
  subtitle?: string
  /** A pill rendered in place of the subtitle — e.g. an asset count for a portfolio. */
  badge?: string
  /** When set alongside `badge`, the pill becomes clickable and lists these in a popover. */
  badgeItems?: string[]
  /** Called when an item in the badge popover is clicked. */
  onBadgeItemClick?: (item: string) => void
  /** "simple" drops the logo — just the eyebrow, title, and subtitle. */
  variant?: "default" | "simple"
  /** Fallback icon shown when logoSrc isn't provided (default variant only). */
  icon?: LucideIcon
  /** An actual logo or photo — falls back to a plain placeholder circle when omitted. */
  logoSrc?: string
  /** "square" shows a rounded square instead of the default circle — used for portfolios. */
  logoShape?: "circle" | "square"
  className?: string
}

export function PageHeader({
  title,
  pageName,
  eyebrow,
  subtitle,
  badge,
  badgeItems,
  onBadgeItemClick,
  variant = "default",
  icon: Icon,
  logoSrc,
  logoShape = "circle",
  className,
}: PageHeaderProps) {
  const titleLine = (
    <h1 className="font-heading text-4xl font-bold text-foreground">
      {title}
      {pageName && <span className="font-normal text-muted-foreground"> | {pageName}</span>}
    </h1>
  )

  if (variant === "simple") {
    return (
      <div className={className}>
        <div className="flex flex-col gap-1">
          {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
          {titleLine}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    )
  }

  const squareLogo = logoShape === "square"

  return (
    <div className={className}>
      <div className="flex items-start gap-4">
        <Avatar className={cn("size-20", squareLogo && "rounded-xl after:rounded-xl")}>
          {logoSrc && (
            <AvatarImage src={logoSrc} alt={title} className={cn(squareLogo && "rounded-xl")} />
          )}
          <AvatarFallback className={cn("bg-muted", squareLogo && "rounded-xl")}>
            {Icon ? (
              <Icon className="size-8 text-muted-foreground" />
            ) : (
              <ImageIcon className="size-8 text-muted-foreground/50" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
          {titleLine}
          {badge ? (
            badgeItems && badgeItems.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Badge
                      variant="secondary"
                      className="mt-1 h-6 w-fit cursor-pointer bg-accent px-2.5 text-sm text-primary hover:bg-accent/80"
                    />
                  }
                >
                  {badge}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {badgeItems.map((item) => (
                    <DropdownMenuItem key={item} onClick={() => onBadgeItemClick?.(item)}>
                      <span className="truncate">{item}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Badge
                variant="secondary"
                className="mt-1 h-6 w-fit bg-accent px-2.5 text-sm text-primary"
              >
                {badge}
              </Badge>
            )
          ) : (
            subtitle && <p className="text-sm text-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
