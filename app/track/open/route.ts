import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// This endpoint returns a 1x1 transparent pixel for email open tracking
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const subscriberId = searchParams.get("subscriber_id")

  if (subscriberId) {
    try {
      const supabase = await createClient()

      // Get current token balance
      const { data: subscriber } = await supabase
        .from("subscribers")
        .select("token_balance")
        .eq("id", subscriberId)
        .single()

      if (subscriber) {
        // Add 5 points for opening email
        await supabase
          .from("subscribers")
          .update({ 
            token_balance: subscriber.token_balance + 5,
            last_active: new Date().toISOString()
          })
          .eq("id", subscriberId)

        // Create open event
        await supabase.from("events").insert({
          subscriber_id: subscriberId,
          event_type: "email_opened",
          points_earned: 5,
        })
      }
    } catch (error) {
      console.error("Error tracking open:", error)
    }
  }

  // Return a 1x1 transparent PNG pixel
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  )

  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  })
}
