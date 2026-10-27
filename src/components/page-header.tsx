import type { LucideIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PageHeaderProps {
  title: string
  /** Rendered next to the title as "| pageName", in muted text. */
  pageName?: string
  /** Small caption line above the title. */
  eyebrow?: string
  /** Line below the title — an address, description, etc. */
  subtitle?: string
  /** "simple" drops the logo — just the eyebrow, title, and subtitle. */
  variant?: "default" | "simple"
  /** Fallback icon shown when logoSrc isn't provided (default variant only). */
  icon?: LucideIcon
  /** An actual logo or photo — falls back to a plain placeholder circle when omitted. */
  logoSrc?: string
  className?: string
}

export function PageHeader({
  title,
  pageName,
  eyebrow,
  subtitle,
  variant = "default",
  icon: Icon,
  logoSrc,
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

  return (
    <div className={className}>
      <div className="flex items-start gap-4">
        <Avatar className="size-20">
          {logoSrc && <AvatarImage src={logoSrc} alt={title} />}
          <AvatarFallback className="bg-muted">
            {Icon && <Icon className="size-8 text-muted-foreground" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
          {titleLine}
          {subtitle && <p className="text-sm text-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
