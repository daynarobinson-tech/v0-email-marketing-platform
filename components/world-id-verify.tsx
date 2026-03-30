"use client"

import { useState } from "react"
import { IDKitWidget, VerificationLevel, ISuccessResult } from "@worldcoin/idkit"
import { Button } from "@/components/ui/button"
import { ShieldCheck, UserCheck } from "lucide-react"

interface WorldIDVerifyProps {
  subscriberId: string
  isVerified?: boolean
  onSuccess?: () => void
}

export function WorldIDVerify({ subscriberId, isVerified = false, onSuccess }: WorldIDVerifyProps) {
  const [verified, setVerified] = useState(isVerified)
  const [verifying, setVerifying] = useState(false)

  const handleVerify = async (result: ISuccessResult) => {
    try {
      setVerifying(true)
      const res = await fetch("/api/verify-world-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof: result,
          subscriberId
        }) // The proof details
      })

      if (res.ok) {
        setVerified(true)
        onSuccess?.()
      } else {
        console.error("Verification failed on backend")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-card mt-4">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          verified ? "bg-green-500/20 text-green-600" : "bg-blue-500/20 text-blue-600"
        }`}>
          {verified ? <UserCheck className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Sybill Protection</h3>
          <p className="text-sm text-muted-foreground">
            {verified 
              ? "You are verified as a unique human. You can now earn and redeem rewards!" 
              : "Verify you are human to unlock token earning and reward redemptions."}
          </p>
        </div>
      </div>

      {!verified ? (
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}` || "app_staging_placeholder"}
          action={process.env.NEXT_PUBLIC_WLD_ACTION || "verify-personhood"}
          onSuccess={handleVerify}
          verification_level={VerificationLevel.Device} // Or Orb for stricter checking
        >
          {({ open }) => (
            <Button 
               onClick={open} 
               disabled={verifying}
               className="w-full bg-black text-white hover:bg-black/80 font-semibold"
            >
              {verifying ? "Verifying..." : "Verify with World ID"}
            </Button>
          )}
        </IDKitWidget>
      ) : (
        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded text-center text-sm font-medium">
          ✓ Verification Complete
        </div>
      )}
    </div>
  )
}
