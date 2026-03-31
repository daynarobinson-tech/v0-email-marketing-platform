"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Coins, ShoppingBag, ArrowLeft, CheckCircle, ShieldCheck, BadgePercent, Truck, Sparkles } from "lucide-react"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  icon: React.ReactNode
}

interface Subscriber {
  id: string
  token_balance: number
  first_name: string
  flow_address?: string
  is_verified?: boolean
}

const rewards: Reward[] = [
  {
    id: "discount-5",
    name: "5% Off Your Next Order",
    description: "Use your tokens for a small discount on a future purchase from this brand.",
    cost: 25,
    icon: <BadgePercent className="w-6 h-6" />,
  },
  {
    id: "discount-10",
    name: "10% Off Your Next Order",
    description: "Turn email engagement into a stronger discount inside the sender's storefront.",
    cost: 75,
    icon: <ShoppingBag className="w-6 h-6" />,
  },
  {
    id: "store-credit",
    name: "$15 Store Credit",
    description: "Apply credit toward an eligible purchase within the sender's ecosystem.",
    cost: 150,
    icon: <Gift className="w-6 h-6" />,
  },
  {
    id: "free-shipping",
    name: "Free Shipping Unlock",
    description: "Redeem tokens to waive shipping on your next qualifying order.",
    cost: 100,
    icon: <Truck className="w-6 h-6" />,
  },
  {
    id: "vip-access",
    name: "VIP Early Access",
    description: "Get early access to a launch, drop, or limited offer from this sender.",
    cost: 200,
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "premium-bundle",
    name: "Premium Bundle Upgrade",
    description: "Trade tokens for a higher-value discount or premium add-on on a future purchase.",
    cost: 450,
    icon: <Gift className="w-6 h-6" />,
  },
]

export default function RedeemPage() {
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [redeemed, setRedeemed] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSubscriber() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("subscribers")
        .select("id, token_balance, first_name, flow_address, is_verified")
        .eq("user_id", user.id)
        .single()

      if (data) {
        setSubscriber(data)
      }
      setLoading(false)
    }
    fetchSubscriber()
  }, [supabase])

  const handleRedeem = async (reward: Reward) => {
    if (!subscriber || subscriber.token_balance < reward.cost) return

    setRedeeming(reward.id)

    // Deduct tokens
    const newBalance = subscriber.token_balance - reward.cost
    const { error: updateError } = await supabase
      .from("subscribers")
      .update({ token_balance: newBalance })
      .eq("id", subscriber.id)

    if (updateError) {
      setRedeeming(null)
      return
    }

    // Record redemption
    await supabase.from("redemptions").insert({
      subscriber_id: subscriber.id,
      reward_name: reward.name,
      tokens_spent: reward.cost,
    })

    // Record event
    await supabase.from("events").insert({
      subscriber_id: subscriber.id,
      event_type: "redeemed",
      points_earned: -reward.cost,
    })

    setSubscriber({ ...subscriber, token_balance: newBalance })
    setRedeemed(reward.id)
    setRedeeming(null)

    // Reset redeemed state after 3 seconds
    setTimeout(() => setRedeemed(null), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C45C26]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/subscriber">
            <Button variant="ghost" size="icon" className="text-[#6B6B67]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[#1C1C1A]">Redeem Rewards</h1>
            <p className="text-[#6B6B67]">Turn your engagement tokens into discounts and perks from this sender</p>
          </div>
          {subscriber && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#E8E6E0]">
              <Coins className="w-5 h-5 text-[#C45C26]" />
              <span className="font-semibold text-[#1C1C1A]">{subscriber.token_balance}</span>
              <span className="text-[#6B6B67]">tokens</span>
            </div>
          )}
        </div>

        {!subscriber ? (
          <Card className="border border-[#E8E6E0] bg-white">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Gift className="w-12 h-12 text-[#6B6B67] mb-4" />
              <h3 className="text-lg font-medium text-[#1C1C1A] mb-2">Sign in to redeem rewards</h3>
              <p className="text-[#6B6B67] mb-6">You need to be logged in to access rewards</p>
              <Button asChild className="bg-[#C45C26] hover:bg-[#A34D20] text-white">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {(!subscriber.is_verified || !subscriber.flow_address) && (
              <div className="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg flex items-start gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Action Required</h3>
                  <p className="text-sm mt-1">
                    To prevent fraud and ensure you receive your rewards securely, you must 
                    connect your Flow wallet and verify your World ID identity on the dashboard before redeeming.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-3 bg-white border-orange-200 text-orange-800 hover:bg-orange-100">
                    <Link href="/dashboard/subscriber">Go to Dashboard to Verify</Link>
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const canAfford = subscriber.token_balance >= reward.cost
                const canRedeem = canAfford && subscriber.is_verified && subscriber.flow_address
                const isRedeeming = redeeming === reward.id
                const wasRedeemed = redeemed === reward.id

              return (
                <Card
                  key={reward.id}
                  className={`border bg-white transition-all ${
                    canAfford
                      ? "border-[#E8E6E0] hover:border-[#C45C26]"
                      : "border-[#E8E6E0] opacity-60"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        canAfford ? "bg-[#C45C26]/10 text-[#C45C26]" : "bg-[#E8E6E0] text-[#6B6B67]"
                      }`}>
                        {reward.icon}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-[#1C1C1A]">
                        <Coins className="w-4 h-4 text-[#C45C26]" />
                        {reward.cost}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-[#1C1C1A] mt-3">{reward.name}</CardTitle>
                    <CardDescription className="text-[#6B6B67]">
                      {reward.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canRedeem || isRedeeming}
                      className={`w-full ${
                        wasRedeemed
                          ? "bg-[#4A7C59] hover:bg-[#4A7C59]"
                          : canRedeem
                          ? "bg-[#C45C26] hover:bg-[#A34D20]"
                          : "bg-[#E8E6E0]"
                      } text-white`}
                    >
                      {isRedeeming ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : wasRedeemed ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Redeemed!
                        </>
                      ) : (!subscriber.is_verified || !subscriber.flow_address) ? (
                        "Verification Required"
                      ) : canAfford ? (
                        "Redeem"
                      ) : (
                        "Not enough tokens"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
        )}

        {/* Info Card */}
        <Card className="border border-[#E8E6E0] bg-white mt-8">
          <CardHeader>
            <CardTitle className="text-[#1C1C1A]">How to Earn More Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4A7C59]/10 flex items-center justify-center text-[#4A7C59] font-semibold text-sm">
                  +10
                </div>
                <div>
                  <p className="font-medium text-[#1C1C1A]">Sign Up</p>
                  <p className="text-sm text-[#6B6B67]">Receive a welcome token bonus when you join the list</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4A7C59]/10 flex items-center justify-center text-[#4A7C59] font-semibold text-sm">
                  +5
                </div>
                <div>
                  <p className="font-medium text-[#1C1C1A]">Open Email</p>
                  <p className="text-sm text-[#6B6B67]">Earn tokens each time you open a sender email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4A7C59]/10 flex items-center justify-center text-[#4A7C59] font-semibold text-sm">
                  +10
                </div>
                <div>
                  <p className="font-medium text-[#1C1C1A]">Click Link</p>
                  <p className="text-sm text-[#6B6B67]">Earn more by clicking through to offers and products</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
