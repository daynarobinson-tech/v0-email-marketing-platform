import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const subscriberId = searchParams.get("subscriber_id")
  const redirectUrl = searchParams.get("url") || "/"

  if (!subscriberId) {
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  try {
    const supabase = await createClient()

    // Add 10 points to subscriber's token balance
    const { data: subscriber } = await supabase
      .from("subscribers")
      .select("token_balance")
      .eq("id", subscriberId)
      .single()

    if (subscriber) {
      // Update token balance
      await supabase
        .from("subscribers")
        .update({ 
          token_balance: subscriber.token_balance + 10,
          last_active: new Date().toISOString()
        })
        .eq("id", subscriberId)

      // Create click event
      await supabase.from("events").insert({
        subscriber_id: subscriberId,
        event_type: "link_clicked",
        points_earned: 10,
      })
    }
  } catch (error) {
    console.error("Error tracking click:", error)
  }

  // Always redirect to the destination URL
  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
