"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Coins, Coffee, ShoppingBag, Ticket, ArrowLeft, CheckCircle } from "lucide-react"

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
}

const rewards: Reward[] = [
  {
    id: "coffee",
    name: "Free Coffee",
    description: "Redeem for a free coffee at participating cafes",
    cost: 100,
    icon: <Coffee className="w-6 h-6" />,
  },
  {
    id: "discount-10",
    name: "10% Discount",
    description: "Get 10% off your next purchase",
    cost: 50,
    icon: <ShoppingBag className="w-6 h-6" />,
  },
  {
    id: "discount-25",
    name: "25% Discount",
    description: "Get 25% off your next purchase",
    cost: 150,
    icon: <ShoppingBag className="w-6 h-6" />,
  },
  {
    id: "raffle",
    name: "Raffle Entry",
    description: "Enter the monthly prize raffle",
    cost: 25,
    icon: <Ticket className="w-6 h-6" />,
  },
  {
    id: "gift-card-10",
    name: "$10 Gift Card",
    description: "A $10 gift card to use on anything",
    cost: 200,
    icon: <Gift className="w-6 h-6" />,
  },
  {
    id: "gift-card-25",
    name: "$25 Gift Card",
    description: "A $25 gift card to use on anything",
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
        .select("id, token_balance, first_name")
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
            <p className="text-[#6B6B67]">Spend your tokens on exclusive rewards</p>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => {
              const canAfford = subscriber.token_balance >= reward.cost
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
                      disabled={!canAfford || isRedeeming}
                      className={`w-full ${
                        wasRedeemed
                          ? "bg-[#4A7C59] hover:bg-[#4A7C59]"
                          : canAfford
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
                  <p className="text-sm text-[#6B6B67]">Welcome bonus for joining</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4A7C59]/10 flex items-center justify-center text-[#4A7C59] font-semibold text-sm">
                  +5
                </div>
                <div>
                  <p className="font-medium text-[#1C1C1A]">Open Email</p>
                  <p className="text-sm text-[#6B6B67]">Every time you open an email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4A7C59]/10 flex items-center justify-center text-[#4A7C59] font-semibold text-sm">
                  +10
                </div>
                <div>
                  <p className="font-medium text-[#1C1C1A]">Click Link</p>
                  <p className="text-sm text-[#6B6B67]">Engage with email content</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
