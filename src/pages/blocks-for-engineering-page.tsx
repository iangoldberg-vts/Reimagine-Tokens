import { useState } from "react"
import { AppNavigation } from "@/components/app-navigation"
import { AiChatTriggerButton, ChatPanel } from "@/components/chat-panel"
import { PageHeader } from "@/components/page-header"
import { SearchOverlay } from "@/components/search-overlay"

export function BlocksForEngineeringPage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-svh bg-background">
      <AppNavigation
        activeItem="Overview"
        variant="floating"
        onActiveItemChange={(label) => {
          if (label === "Search") setSearchOpen(true)
        }}
      >
        <div className={`flex flex-col gap-4 pt-8 pb-6 pl-6 ${chatOpen ? "pr-[347px]" : "pr-6"}`}>
          <div className="flex items-center gap-3">
            <PageHeader
              eyebrow="Built 1947 · 36 floors · Office"
              title="200 Berkeley Street"
              pageName="Overview"
              subtitle="200 Berkeley St, Boston, MA 02116"
            />
            <AiChatTriggerButton active={chatOpen} onClick={() => setChatOpen((value) => !value)} />
          </div>

          <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
      </AppNavigation>
      {chatOpen && <ChatPanel />}
    </div>
  )
}
