import { useState } from "react"
import { Search, X } from "lucide-react"
import { ActivityFeed } from "@/components/activity-feed"
import { AppNavigation } from "@/components/app-navigation"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { PageHeader } from "@/components/page-header"

export function BlocksForEngineeringPage() {
  const [activityFeedOpen, setActivityFeedOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-svh bg-background">
      <AppNavigation
        activeItem="Overview"
        variant="floating"
        onActiveItemChange={(label) => {
          if (label === "Search") setSearchOpen(true)
          else if (label === "Activity feed") setActivityFeedOpen(true)
        }}
      >
        <div className="pt-8 pr-6 pb-6 pl-6">
          {searchOpen ? (
            <InputGroup className="h-auto rounded-none border-x-0 border-t-0 border-b border-border pb-3 has-[[data-slot=input-group-control]:focus-visible]:border-border has-[[data-slot=input-group-control]:focus-visible]:ring-0">
              <InputGroupAddon>
                <Search className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                autoFocus
                placeholder="Search for assets, deals, tenants and brokers"
                className="text-base"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          ) : (
            <PageHeader
              eyebrow="Built 1947 · 36 floors · Office"
              title="200 Berkeley Street"
              pageName="Overview"
              subtitle="200 Berkeley St, Boston, MA 02116"
            />
          )}
        </div>
      </AppNavigation>
      <ActivityFeed open={activityFeedOpen} onOpenChange={setActivityFeedOpen} />
    </div>
  )
}
