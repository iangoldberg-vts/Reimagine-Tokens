import { useState } from "react"
import { Search, type LucideIcon } from "lucide-react"
import {
  AppNavigation,
  VTS_NAV_ITEMS,
  VTS_PORTFOLIOS,
  VTS_PROPERTIES,
  type AppNavItem,
  type AppNavPortfolio,
} from "@/components/app-navigation"
import { AskVtsPage } from "@/components/ask-vts-page"
import { AiChatTriggerButton, ChatPanel } from "@/components/chat-panel"
import { PageHeader } from "@/components/page-header"
import { SearchOverlay } from "@/components/search-overlay"
import { Button } from "@/components/ui/button"

function flattenNavIcons(items: AppNavItem[]) {
  const icons = new Map<string, LucideIcon>()
  for (const item of items) {
    icons.set(item.label, item.icon)
    item.items?.forEach((sub) => icons.set(sub.label, sub.icon))
  }
  return icons
}

const NAV_ICONS = flattenNavIcons(VTS_NAV_ITEMS)

export function BlocksForEngineeringPage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("Overview")
  const [selectedProperties, setSelectedProperties] = useState<string[]>(["Northeast Corridor"])
  const [portfolios, setPortfolios] = useState<AppNavPortfolio[]>(VTS_PORTFOLIOS)

  const PlaceholderIcon = NAV_ICONS.get(activeItem)

  const selectedPortfolio =
    selectedProperties.length === 1
      ? portfolios.find((portfolio) => portfolio.name === selectedProperties[0])
      : undefined
  const selectedProperty =
    selectedProperties.length === 1
      ? VTS_PROPERTIES.find((property) => property.name === selectedProperties[0])
      : undefined

  const headerProps = selectedPortfolio
    ? {
        eyebrow: "Portfolio",
        title: selectedPortfolio.name,
        logoShape: "square" as const,
        badge: `${selectedPortfolio.propertyCount} Assets`,
        badgeItems: selectedPortfolio.properties,
      }
    : selectedProperty
      ? {
          eyebrow: selectedProperty.details,
          title: selectedProperty.name,
          subtitle: selectedProperty.address,
        }
      : selectedProperties.length === 0
        ? {
            title: "All assets",
            badge: `${VTS_PROPERTIES.length} Assets`,
            badgeItems: VTS_PROPERTIES.map((property) => property.name),
          }
        : {
            title: "Multiple selected",
            badge: `${selectedProperties.length} Assets`,
            badgeItems: selectedProperties,
          }

  return (
    <div className="min-h-svh bg-background">
      <AppNavigation
        activeItem={activeItem}
        onActiveItemChange={setActiveItem}
        selectedProperties={selectedProperties}
        onSelectedPropertiesChange={setSelectedProperties}
        portfolios={portfolios}
        onPortfoliosChange={setPortfolios}
        variant="floating"
      >
        {activeItem === "Ask VTS" ? (
          <div className="h-full p-4">
            <AskVtsPage />
          </div>
        ) : (
          <div className={`flex flex-col gap-4 pt-8 pb-6 pl-6 ${chatOpen ? "pr-6 md:pr-[347px]" : "pr-6"}`}>
            <div className="flex items-center justify-between gap-3">
              <PageHeader
                {...headerProps}
                pageName={activeItem}
                onBadgeItemClick={(item) => setSelectedProperties([item])}
              />
              <div className="flex shrink-0 items-center gap-2">
                <AiChatTriggerButton active={chatOpen} onClick={() => setChatOpen((value) => !value)} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="size-4" />
                </Button>
              </div>
            </div>

            {activeItem !== "Overview" && (
              <div className="flex min-h-[22rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-center">
                {PlaceholderIcon && <PlaceholderIcon className="size-8 text-muted-foreground/50" />}
                <p className="text-sm text-muted-foreground">
                  {activeItem} isn't wired up in this demo yet.
                </p>
              </div>
            )}
          </div>
        )}
        <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
      </AppNavigation>
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  )
}
