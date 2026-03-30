"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import * as fcl from "@onflow/fcl"
import { createClient } from "@/lib/supabase/client"
import { Wallet } from "lucide-react"

fcl.config({
  "app.detail.title": "Flow Email Loyalty Platform",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "accessNode.api": "https://rest-testnet.onflow.org", // Testnet access node
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Testnet wallet discovery
  "walletconnect.core.projectId": process.env.NEXT_PUBLIC_WC_PROJECT_ID || "915f070cb1bdf7f1e5dfdc010f3db473", // Fixes WalletConnect error
})

interface FlowConnectProps {
  subscriberId: string
  existingAddress?: string | null
}

export function FlowConnect({ subscriberId, existingAddress }: FlowConnectProps) {
  const [user, setUser] = useState({ loggedIn: null, addr: existingAddress || null })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fcl.currentUser.subscribe(setUser)
  }, [])

  useEffect(() => {
    // If we just logged in via FCL and have an address but it wasn't there before
    const saveAddress = async () => {
      if (user.addr && user.addr !== existingAddress && subscriberId) {
        await supabase
          .from("subscribers")
          .update({ flow_address: user.addr })
          .eq("id", subscriberId)
      }
    }
    
    if (user.loggedIn && user.addr) {
      saveAddress()
    }
  }, [user.addr, user.loggedIn, subscriberId, existingAddress, supabase])

  const handleLogin = async () => {
    setLoading(true)
    try {
      await fcl.logIn()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    fcl.unauthenticate()
  }

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#16ff99]/20 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-[#16ff99]" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Flow Wallet</h3>
          <p className="text-sm text-muted-foreground">
            {user.addr ? "Your wallet is connected and ready to earn rewards." : "Connect a frictionless Flow wallet to receive loyalty tokens."}
          </p>
        </div>
      </div>
      
      {user.addr ? (
        <div className="flex items-center justify-between mt-4 p-3 bg-muted rounded">
          <span className="text-sm font-mono truncate mr-4">{user.addr}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleLogin} 
          disabled={loading}
          className="w-full bg-[#16ff99] hover:bg-[#16ff99]/80 text-black font-semibold mt-2"
        >
          {loading ? "Connecting..." : "Connect Flow Wallet"}
        </Button>
      )}
    </div>
  )
}
