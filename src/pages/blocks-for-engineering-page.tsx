import { useState } from "react"
import { ActivityFeed } from "@/components/activity-feed"
import { AppNavigation } from "@/components/app-navigation"
import { PageHeader } from "@/components/page-header"
import { SearchOverlay } from "@/components/search-overlay"

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
          <PageHeader
            eyebrow="Built 1947 · 36 floors · Office"
            title="200 Berkeley Street"
            pageName="Overview"
            subtitle="200 Berkeley St, Boston, MA 02116"
          />
        </div>

        <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
      </AppNavigation>
      <ActivityFeed open={activityFeedOpen} onOpenChange={setActivityFeedOpen} />
    </div>
  )
}
