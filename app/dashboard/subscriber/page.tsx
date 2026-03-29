import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"
import { SubscriberDashboardContent } from "@/components/dashboard/subscriber-content"

export default async function SubscriberDashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get subscriber data based on user email
  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("*")
    .eq("email", user.email)
    .single()

  // Get events for this subscriber
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("subscriber_id", subscriber?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar type="subscriber" />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <SubscriberDashboardContent 
          user={user}
          subscriber={subscriber}
          events={events || []}
        />
      </main>
    </div>
  )
}
