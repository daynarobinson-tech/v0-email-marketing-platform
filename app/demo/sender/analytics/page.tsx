"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Eye, MousePointerClick, Gift, TrendingUp, TrendingDown, Calendar } from "lucide-react"

const monthlyData = [
  { month: "Jan", emails: 3200, opens: 2150, clicks: 890 },
  { month: "Feb", emails: 3800, opens: 2600, clicks: 1100 },
  { month: "Mar", emails: 4200, opens: 2900, clicks: 1350 },
]

const topPerformers = [
  { name: "Welcome Series - Day 1", openRate: 71.5, clickRate: 51.2 },
  { name: "Flash Sale Announcement", openRate: 68.3, clickRate: 42.8 },
  { name: "Weekly Digest #12", openRate: 59.4, clickRate: 34.1 },
]

export default function DemoAnalyticsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your email performance and subscriber engagement</p>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-semibold text-foreground mt-1">1,247</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-secondary">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12.5% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
                <p className="text-2xl font-semibold text-foreground mt-1">11,200</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-secondary">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8.2% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-semibold text-foreground mt-1">67.2%</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-secondary">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3.1% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Click Rate</p>
                <p className="text-2xl font-semibold text-foreground mt-1">29.8%</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  <span>-1.2% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <MousePointerClick className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Performance */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Monthly Performance</CardTitle>
                <CardDescription className="text-muted-foreground">Email engagement over time</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month) => (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{month.month} 2024</span>
                    <span className="text-muted-foreground">{month.emails.toLocaleString()} sent</span>
                  </div>
                  <div className="flex gap-2 h-4">
                    <div 
                      className="bg-secondary/80 rounded-full" 
                      style={{ width: `${(month.opens / month.emails) * 100}%` }}
                      title={`Opens: ${month.opens}`}
                    />
                    <div 
                      className="bg-primary/80 rounded-full" 
                      style={{ width: `${(month.clicks / month.emails) * 100}%` }}
                      title={`Clicks: ${month.clicks}`}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary/80" />
                      {Math.round((month.opens / month.emails) * 100)}% opens
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/80" />
                      {Math.round((month.clicks / month.emails) * 100)}% clicks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Campaigns */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Top Performing Campaigns</CardTitle>
            <CardDescription className="text-muted-foreground">Highest engagement rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((campaign, index) => (
                <div key={campaign.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{campaign.name}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {campaign.openRate}% opens
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="h-3 w-3" />
                        {campaign.clickRate}% clicks
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Stats */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Rewards Program Stats</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            How your subscribers are engaging with rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-semibold text-foreground">15,420</p>
              <p className="text-sm text-muted-foreground mt-1">Total Tokens Distributed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-semibold text-foreground">3,250</p>
              <p className="text-sm text-muted-foreground mt-1">Tokens Redeemed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-semibold text-foreground">89</p>
              <p className="text-sm text-muted-foreground mt-1">Total Redemptions</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-semibold text-foreground">21%</p>
              <p className="text-sm text-muted-foreground mt-1">Redemption Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
