"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Mail, 
  Gift, 
  Download, 
  Plus,
  Upload,
  Eye,
  MousePointerClick,
  TrendingUp
} from "lucide-react"

// Sample data for demo
const sampleSubscribers = [
  { id: "1", first_name: "Sarah", email: "sarah.johnson@email.com", token_balance: 145, created_at: "2024-01-15T10:30:00Z", last_active: "2024-03-28T14:22:00Z" },
  { id: "2", first_name: "Michael", email: "m.chen@company.io", token_balance: 230, created_at: "2024-01-22T08:15:00Z", last_active: "2024-03-29T09:45:00Z" },
  { id: "3", first_name: "Emma", email: "emma.wilson@startup.co", token_balance: 85, created_at: "2024-02-03T16:45:00Z", last_active: "2024-03-27T11:30:00Z" },
  { id: "4", first_name: "James", email: "james.miller@tech.dev", token_balance: 320, created_at: "2024-02-14T12:00:00Z", last_active: "2024-03-29T16:10:00Z" },
  { id: "5", first_name: "Olivia", email: "olivia.r@design.studio", token_balance: 175, created_at: "2024-02-28T09:20:00Z", last_active: "2024-03-26T13:55:00Z" },
  { id: "6", first_name: "William", email: "will.brown@agency.com", token_balance: 95, created_at: "2024-03-05T14:30:00Z", last_active: "2024-03-28T10:20:00Z" },
  { id: "7", first_name: "Sophia", email: "sophia.lee@brand.io", token_balance: 210, created_at: "2024-03-12T11:00:00Z", last_active: "2024-03-29T08:15:00Z" },
  { id: "8", first_name: "Lucas", email: "lucas.garcia@media.co", token_balance: 55, created_at: "2024-03-20T15:45:00Z", last_active: "2024-03-25T17:30:00Z" },
]

const sampleCampaigns = [
  { id: "1", name: "Welcome Series - Day 1", subject: "Welcome to Bloom! Here's your first reward", status: "sent", emails_sent: 1247, opens: 892, clicks: 456, sent_at: "2024-03-15T09:00:00Z" },
  { id: "2", name: "March Newsletter", subject: "What's new this month + bonus tokens inside", status: "sent", emails_sent: 1189, opens: 743, clicks: 312, sent_at: "2024-03-22T10:30:00Z" },
  { id: "3", name: "Product Launch Announcement", subject: "Introducing our newest feature - earn 2x tokens!", status: "draft", emails_sent: 0, opens: 0, clicks: 0, sent_at: null },
]

export default function DemoSenderPage() {
  const totalSubscribers = sampleSubscribers.length
  const totalEmailsSent = sampleCampaigns.reduce((sum, c) => sum + c.emails_sent, 0)
  const totalOpens = sampleCampaigns.reduce((sum, c) => sum + c.opens, 0)
  const totalClicks = sampleCampaigns.reduce((sum, c) => sum + c.clicks, 0)
  const averageOpenRate = totalEmailsSent > 0 ? Math.round((totalOpens / totalEmailsSent) * 100) : 0
  const clickRate = totalOpens > 0 ? Math.round((totalClicks / totalOpens) * 100) : 0

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Join Date", "Token Balance", "Last Active"]
    const rows = sampleSubscribers.map(sub => [
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
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bloom-demo-report-${new Date().toISOString().split("T")[0]}.csv`
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-semibold text-foreground">{totalSubscribers.toLocaleString()}</p>
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
                <p className="text-2xl font-semibold text-foreground">{totalEmailsSent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-semibold text-foreground">{averageOpenRate}%</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <MousePointerClick className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-semibold text-foreground">{clickRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
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
            <Link href="/demo/sender/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-border">
            <Link href="/demo/sender/import">
              <Upload className="h-4 w-4 mr-2" />
              Import Subscribers
            </Link>
          </Button>
        </div>

        {/* Recent Campaigns */}
        <div className="rounded-lg border border-border bg-card overflow-hidden mb-8">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Campaigns</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
              <Link href="/demo/sender/campaigns">View All</Link>
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Opens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sampleCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{campaign.subject}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === "sent" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                      }`}>
                        {campaign.status === "sent" ? "Sent" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{campaign.emails_sent.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {campaign.opens.toLocaleString()}
                      {campaign.emails_sent > 0 && <span className="text-muted-foreground ml-1">({Math.round((campaign.opens / campaign.emails_sent) * 100)}%)</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {campaign.clicks.toLocaleString()}
                      {campaign.opens > 0 && <span className="text-muted-foreground ml-1">({Math.round((campaign.clicks / campaign.opens) * 100)}%)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden mb-8">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Subscribers</h2>
            <span className="text-sm text-muted-foreground">{totalSubscribers} total</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Token Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sampleSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{subscriber.first_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{subscriber.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(subscriber.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Gift className="h-4 w-4 text-primary" />
                        {subscriber.token_balance}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(subscriber.last_active).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Engagement Analytics</h2>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <TrendingUp className="h-4 w-4" />
              <span>+12% this month</span>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-semibold text-foreground">1,315</p>
              <p className="text-sm text-muted-foreground mt-1">Total Tokens Distributed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-semibold text-foreground">67%</p>
              <p className="text-sm text-muted-foreground mt-1">Active Subscribers</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-semibold text-foreground">24</p>
              <p className="text-sm text-muted-foreground mt-1">Rewards Redeemed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
