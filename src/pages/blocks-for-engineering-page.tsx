import { useState } from "react"
import { ActivityFeed } from "@/components/activity-feed"
import { AppNavigation } from "@/components/app-navigation"
import { PageHeader } from "@/components/page-header"

export function BlocksForEngineeringPage() {
  const [activityFeedOpen, setActivityFeedOpen] = useState(false)

  return (
    <div className="min-h-svh bg-background">
      <AppNavigation
        activeItem="Overview"
        variant="floating"
        onActiveItemChange={(label) => {
          if (label === "Activity feed") setActivityFeedOpen(true)
        }}
      >
        <div className="p-6">
          <PageHeader
            eyebrow="Built 1947 · 36 floors · Office"
            title="200 Berkeley Street"
            pageName="Overview"
            subtitle="200 Berkeley St, Boston, MA 02116"
          />
        </div>
      </AppNavigation>
      <ActivityFeed open={activityFeedOpen} onOpenChange={setActivityFeedOpen} />
    </div>
  )
}
