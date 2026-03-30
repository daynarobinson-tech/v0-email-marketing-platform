import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// The verification type required by worldcoin
export type VerifyReply = {
  success: boolean
  code?: string
  detail?: string
}

export async function POST(req: Request) {
  try {
    const { proof, subscriberId } = await req.json()
    
    // In a real application, you must verify the proof by sending it to the Worldcoin Developer Portal API
    // Using https://developer.worldcoin.org/api/v1/verify/{process.env.NEXT_PUBLIC_WLD_APP_ID}
    
    const verifyReq = await fetch(
      `https://developer.worldcoin.org/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID || "app_staging_placeholder"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...proof,
          action: process.env.NEXT_PUBLIC_WLD_ACTION || "verify-personhood",
        }),
      }
    )

    const verifyRes = await verifyReq.json()

    // Assuming it succeeds for hackathon purposes if dev mode, or check API response.
    if (verifyReq.ok) {
      // Once verified, save the status and the nullifier hash to Supabase
      // The nullifier_hash is a unique identifier preventing the same human from verifying multiple accounts
      const supabase = await createClient()
      
      const { error } = await supabase
        .from("subscribers")
        .update({ 
          is_verified: true,
          world_id_nullifier: proof.nullifier_hash || "mock-hash-" + Date.now()
        })
        .eq("id", subscriberId)

      if (error) {
        return NextResponse.json({ success: false, detail: "Failed to update database" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, detail: verifyRes.detail || "Invalid proof" }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, detail: err.message }, { status: 500 })
  }
}
