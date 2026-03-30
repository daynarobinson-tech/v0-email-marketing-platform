"use client"

import { Button } from "@/components/ui/button"
import { Users, Mail, BarChart3, Download, Plus } from "lucide-react"
import Link from "next/link"

interface Subscriber {
  id: string
  email: string
  first_name: string
  token_balance: number
  created_at: string
  last_active: string
  is_verified?: boolean
  flow_address?: string
}

interface SenderDashboardContentProps {
  subscribers: Subscriber[]
  stats: {
    totalSubscribers: number
    totalEmailsSent: number
    averageOpenRate: number
    verifiedHumans: number
    treasuryBalance: number
  }
}

export function SenderDashboardContent({ 
  subscribers,
  stats,
}: SenderDashboardContentProps) {
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Join Date", "Token Balance", "Last Active"]
    const rows = subscribers.map(sub => [
      sub.first_name,
      sub.email,
      new Date(sub.created_at).toLocaleDateString(),
      sub.token_balance.toString(),
      sub.last_active ? new Date(sub.last_active).toLocaleDateString() : "N/A"
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")
    
    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bloom-compliance-report-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Sender Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your subscribers and campaigns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-semibold text-foreground">{stats.totalSubscribers}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
                <p className="text-2xl font-semibold text-foreground">{stats.totalEmailsSent}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Open Rate</p>
                <p className="text-2xl font-semibold text-foreground">{stats.averageOpenRate}%</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#4A7C59]/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#4A7C59]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B6B67]">Verified Humans</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold text-[#1C1C1A]">{stats.verifiedHumans}</p>
                    <span className="text-xs bg-[#4A7C59]/10 text-[#4A7C59] px-2 py-0.5 rounded-full font-medium mt-1">
                      World ID
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card sm:col-span-2 lg:col-span-2">
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#16ff99]/20 flex items-center justify-center">
                <span className="text-xl">🌊</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Flow Treasury Balance (Abstracted)</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold text-foreground">{stats.treasuryBalance.toLocaleString()}</p>
                  <span className="text-sm text-muted-foreground mt-1">Tokens Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            className="border-border"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Compliance Report
          </Button>
          <Button asChild className="bg-primary hover:bg-[#A34D20] text-primary-foreground">
            <Link href="/dashboard/sender/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Subscribers Table */}
        <div id="subscribers" className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Subscribers
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Token Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No subscribers yet. Share your signup page to get started!
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {subscriber.first_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {subscriber.is_verified ? (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-[#4A7C59]/10 text-[#4A7C59] rounded-full" title="Verified Human">
                              W
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full" title="Unverified">
                              -
                            </span>
                          )}
                          {subscriber.flow_address ? (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-[#16ff99]/20 text-[#00a65d] rounded-full" title="Wallet Connected">
                              🌊
                            </span>
                          ) : (
                             <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full" title="No Wallet">
                              -
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(subscriber.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                        {subscriber.token_balance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {subscriber.last_active 
                          ? new Date(subscriber.last_active).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
