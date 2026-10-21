import { Fragment, type ReactNode } from "react"
import { Building2, Info, type LucideIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface PageHeaderBreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderField {
  label: string
  value: ReactNode
  info?: string
}

interface PageHeaderProps {
  breadcrumbs: PageHeaderBreadcrumbItem[]
  title: string
  /** "simple" drops the logo, fields, and info tooltip — just breadcrumb, title, and an optional description. */
  variant?: "default" | "simple"
  /** Placeholder descriptor shown under the title — only used in the "simple" variant. */
  description?: string
  fields?: PageHeaderField[]
  /** Fallback icon shown when logoSrc isn't provided. */
  icon?: LucideIcon
  /** An actual logo or photo — falls back to `icon` when omitted or broken. */
  logoSrc?: string
  className?: string
}

export function PageHeader({
  breadcrumbs,
  title,
  variant = "default",
  description,
  fields = [],
  icon: Icon = Building2,
  logoSrc,
  className,
}: PageHeaderProps) {
  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.label}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="font-semibold">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {variant === "simple" ? (
        <div className="mt-4 flex flex-col gap-1">
          <h1 className="font-heading text-4xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-4">
          <Avatar className="size-16">
            {logoSrc && <AvatarImage src={logoSrc} alt={title} />}
            <AvatarFallback className="bg-muted">
              <Icon className="size-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-4xl font-bold text-foreground">{title}</h1>

            {fields.length > 0 && (
              <TooltipProvider>
                <div className="flex items-center gap-6">
                  {fields.map((field, index) => (
                    <Fragment key={field.label}>
                      {index > 0 && <Separator orientation="vertical" className="h-8" />}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {field.label}
                          {field.info && (
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <Info className="size-3.5 text-muted-foreground" />
                                }
                              />
                              <TooltipContent>{field.info}</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {field.value}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
