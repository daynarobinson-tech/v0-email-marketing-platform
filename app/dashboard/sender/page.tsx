import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"
import { SenderDashboardContent } from "@/components/dashboard/sender-content"

export default async function SenderDashboardPage() {
  const supabase = await createClient()

  // Get all subscribers
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false })

  // Get campaign stats
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")

  // Calculate stats
  const totalSubscribers = subscribers?.length || 0
  const totalEmailsSent = campaigns?.reduce((sum, c) => sum + (c.emails_sent || 0), 0) || 0
  const totalOpens = campaigns?.reduce((sum, c) => sum + (c.opens || 0), 0) || 0
  const averageOpenRate = totalEmailsSent > 0 ? Math.round((totalOpens / totalEmailsSent) * 100) : 0
  
  // Web3 Gamification Stats
  const verifiedHumans = subscribers?.filter(s => s.is_verified).length || 0
  const treasuryBalance = 50000 // Mock platform-abstracted token treasury for the Sender

  return (
    <div className="min-h-screen bg-background">
      <Sidebar type="sender" />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <SenderDashboardContent 
          subscribers={subscribers || []}
          stats={{
            totalSubscribers,
            totalEmailsSent,
            averageOpenRate,
            verifiedHumans,
            treasuryBalance
          }}
        />
      </main>
    </div>
  )
}
