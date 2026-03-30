"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Coins, Mail, MousePointer, UserPlus } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { FlowConnect } from "@/components/flow-connect"
import { WorldIDVerify } from "@/components/world-id-verify"

interface Subscriber {
  id: string
  email: string
  first_name: string
  token_balance: number
  created_at: string
  flow_address?: string
  is_verified?: boolean
}

interface Event {
  id: string
  event_type: string
  points_earned: number
  created_at: string
}

interface SubscriberDashboardContentProps {
  user: User
  subscriber: Subscriber | null
  events: Event[]
}

const eventConfig: Record<string, { icon: typeof Coins; label: string; color: string }> = {
  joined: { icon: UserPlus, label: "Joined", color: "text-secondary" },
  email_opened: { icon: Mail, label: "Opened email", color: "text-primary" },
  link_clicked: { icon: MousePointer, label: "Clicked link", color: "text-primary" },
}

export function SubscriberDashboardContent({ 
  user, 
  subscriber, 
  events 
}: SubscriberDashboardContentProps) {
  const firstName = subscriber?.first_name || user.user_metadata?.first_name || "Subscriber"
  const tokenBalance = subscriber?.token_balance || 0
  const isVerified = subscriber?.is_verified || false
  const flowAddress = subscriber?.flow_address || null

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {user.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Token Balance</p>
                <p className="text-2xl font-semibold text-foreground">{tokenBalance}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emails Opened</p>
                <p className="text-2xl font-semibold text-foreground">
                  {events.filter(e => e.event_type === "email_opened").length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Links Clicked</p>
                <p className="text-2xl font-semibold text-foreground">
                  {events.filter(e => e.event_type === "link_clicked").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Redeem Button */}
        <div className="mb-8">
          <Button asChild className="bg-primary hover:bg-[#A34D20] text-primary-foreground">
            <Link href="/redeem">Redeem Rewards</Link>
          </Button>
        </div>

        {/* Web3 & Identity Section */}
        {subscriber && (
          <div className="mb-10 grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-4">Web3 Rewards</h2>
              <FlowConnect subscriberId={subscriber.id} existingAddress={flowAddress} />
            </div>
            <div className="flex flex-col mt-4 md:mt-0">
              <h2 className="text-lg font-semibold text-foreground mb-4">Identity Verification</h2>
              <WorldIDVerify subscriberId={subscriber.id} isVerified={isVerified} />
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div id="activity" className="p-6 rounded-lg border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Recent Activity
          </h2>
          
          {events.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activity yet. Start engaging with emails to earn points!</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const config = eventConfig[event.event_type] || eventConfig.joined
                const Icon = config.icon
                
                return (
                  <div key={event.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {config.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-secondary">
                      +{event.points_earned} points
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
