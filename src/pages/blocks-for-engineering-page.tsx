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
            variant="simple"
            breadcrumbs={[{ label: "Design system", href: "#/" }, { label: "Blocks for engineering" }]}
            title="Blocks for engineering"
            description="A real page composed entirely from documented blocks — this header, the nav shell on the left, and Activity feed opened from the nav."
          />
        </div>
      </AppNavigation>
      <ActivityFeed open={activityFeedOpen} onOpenChange={setActivityFeedOpen} />
    </div>
  )
}
