"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Mail, Eye, MousePointer, MoreHorizontal, Send } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Campaign {
  id: string
  name: string
  subject: string
  status: string
  emails_sent: number
  opens: number
  clicks: number
  created_at: string
  sent_at: string | null
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCampaigns() {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setCampaigns(data)
      }
      setLoading(false)
    }
    fetchCampaigns()
  }, [supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-[#4A7C59] text-white"
      case "draft":
        return "bg-[#E8E6E0] text-[#1C1C1A]"
      case "scheduled":
        return "bg-[#C45C26] text-white"
      default:
        return "bg-[#E8E6E0] text-[#6B6B67]"
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("campaigns").delete().eq("id", id)
    if (!error) {
      setCampaigns(campaigns.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1A]">Campaigns</h1>
          <p className="text-[#6B6B67] mt-1">Create and manage your email campaigns</p>
        </div>
        <Link href="/dashboard/sender/campaigns/new">
          <Button className="bg-[#C45C26] hover:bg-[#A34D20] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C45C26]"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="border border-[#E8E6E0] bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="w-12 h-12 text-[#6B6B67] mb-4" />
            <h3 className="text-lg font-medium text-[#1C1C1A] mb-2">No campaigns yet</h3>
            <p className="text-[#6B6B67] mb-6">Create your first email campaign to get started</p>
            <Link href="/dashboard/sender/campaigns/new">
              <Button className="bg-[#C45C26] hover:bg-[#A34D20] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="border border-[#E8E6E0] bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg text-[#1C1C1A]">{campaign.name}</CardTitle>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <CardDescription className="text-[#6B6B67] mt-1">
                      {campaign.subject || "No subject"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#6B6B67]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/sender/campaigns/${campaign.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/sender/campaigns/${campaign.id}/preview`}>Preview</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-[#6B6B67]">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>{campaign.emails_sent} sent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{campaign.opens} opens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4" />
                    <span>{campaign.clicks} clicks</span>
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
      )}
    </div>
  )
}
