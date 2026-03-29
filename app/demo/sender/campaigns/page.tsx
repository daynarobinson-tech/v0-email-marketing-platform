"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Mail, Eye, MousePointer, MoreHorizontal, Send, Trash2, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const initialCampaigns = [
  { id: "1", name: "Welcome Series - Day 1", subject: "Welcome to Bloom! Here's your first reward", status: "sent", emails_sent: 1247, opens: 892, clicks: 456, created_at: "2024-03-14T09:00:00Z", sent_at: "2024-03-15T09:00:00Z" },
  { id: "2", name: "March Newsletter", subject: "What's new this month + bonus tokens inside", status: "sent", emails_sent: 1189, opens: 743, clicks: 312, created_at: "2024-03-21T10:30:00Z", sent_at: "2024-03-22T10:30:00Z" },
  { id: "3", name: "Product Launch Announcement", subject: "Introducing our newest feature - earn 2x tokens!", status: "draft", emails_sent: 0, opens: 0, clicks: 0, created_at: "2024-03-25T14:00:00Z", sent_at: null },
  { id: "4", name: "Spring Sale Promo", subject: "Limited time offer - Double your rewards!", status: "draft", emails_sent: 0, opens: 0, clicks: 0, created_at: "2024-03-27T11:00:00Z", sent_at: null },
  { id: "5", name: "Weekly Digest #12", subject: "Your weekly roundup is here", status: "sent", emails_sent: 1156, opens: 687, clicks: 234, created_at: "2024-03-10T08:00:00Z", sent_at: "2024-03-11T08:00:00Z" },
]

export default function DemoCampaignsPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-secondary/10 text-secondary"
      case "draft":
        return "bg-muted text-muted-foreground"
      case "scheduled":
        return "bg-primary/10 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id))
    setDeleteId(null)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Create and manage your email campaigns</p>
        </div>
        <Link href="/demo/sender/campaigns/new">
          <Button className="bg-primary hover:bg-[#A34D20] text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="border border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg text-foreground">{campaign.name}</CardTitle>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <CardDescription className="text-muted-foreground mt-1">
                    {campaign.subject || "No subject"}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/demo/sender/campaigns/new" className="flex items-center">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/demo/sender/campaigns/new" className="flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteId(campaign.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>{campaign.emails_sent.toLocaleString()} sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{campaign.opens.toLocaleString()} opens</span>
                  {campaign.emails_sent > 0 && (
                    <span className="text-xs">({Math.round((campaign.opens / campaign.emails_sent) * 100)}%)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4" />
                  <span>{campaign.clicks.toLocaleString()} clicks</span>
                  {campaign.opens > 0 && (
                    <span className="text-xs">({Math.round((campaign.clicks / campaign.opens) * 100)}%)</span>
                  )}
                </div>
                <div className="ml-auto text-xs">
                  {campaign.sent_at
                    ? `Sent ${new Date(campaign.sent_at).toLocaleDateString()}`
                    : `Created ${new Date(campaign.created_at).toLocaleDateString()}`}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
