"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Send, Eye } from "lucide-react"
import Link from "next/link"

export default function NewCampaignPage() {
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [previewText, setPreviewText] = useState("")
  const [bodyHtml, setBodyHtml] = useState("")
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async (status: "draft" | "sent" = "draft") => {
    setSaving(true)

    const { data: user } = await supabase.auth.getUser()

    const campaignData = {
      name: name || "Untitled Campaign",
      subject,
      preview_text: previewText,
      body_html: bodyHtml,
      status,
      sender_id: user?.user?.id || null,
      sent_at: status === "sent" ? new Date().toISOString() : null,
      emails_sent: 0,
      opens: 0,
      clicks: 0,
    }

    const { error } = await supabase.from("campaigns").insert(campaignData)

    if (!error) {
      router.push("/dashboard/sender/campaigns")
    }
    setSaving(false)
  }

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/sender/campaigns">
          <Button variant="ghost" size="icon" className="text-[#6B6B67]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[#1C1C1A]">Create Campaign</h1>
          <p className="text-[#6B6B67] mt-1">Design your email with the visual editor</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="border-[#E8E6E0] text-[#1C1C1A]"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="border-[#E8E6E0] text-[#1C1C1A]"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave("sent")}
            disabled={saving || !subject}
            className="bg-[#C45C26] hover:bg-[#A34D20] text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Now
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Card className="border border-[#E8E6E0] bg-white">
            <CardHeader>
              <CardTitle className="text-[#1C1C1A]">Campaign Details</CardTitle>
              <CardDescription className="text-[#6B6B67]">
                Set up the basic information for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#1C1C1A]">Campaign Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., March Newsletter"
                  className="border-[#E8E6E0] focus:ring-[#C45C26]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-[#1C1C1A]">Subject Line</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Your weekly update is here!"
                  className="border-[#E8E6E0] focus:ring-[#C45C26]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preview" className="text-[#1C1C1A]">Preview Text</Label>
                <Input
                  id="preview"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Text that appears after the subject line"
                  className="border-[#E8E6E0] focus:ring-[#C45C26]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E8E6E0] bg-white">
            <CardHeader>
              <CardTitle className="text-[#1C1C1A]">Email Content</CardTitle>
              <CardDescription className="text-[#6B6B67]">
                Write your email content using HTML or plain text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                placeholder={`<h1>Hello {{first_name}},</h1>
<p>Thanks for being a subscriber!</p>
<p>Click the link below to earn 10 reward points:</p>
<a href="{{tracking_link}}">Check out our latest updates</a>
<p>Best,<br>The Team</p>`}
                className="min-h-[300px] font-mono text-sm border-[#E8E6E0] focus:ring-[#C45C26]"
              />
              <p className="text-xs text-[#6B6B67] mt-2">
                Available variables: {"{{first_name}}"}, {"{{email}}"}, {"{{tracking_link}}"}, {"{{unsubscribe_link}}"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <Card className="border border-[#E8E6E0] bg-white h-fit sticky top-6">
          <CardHeader>
            <CardTitle className="text-[#1C1C1A]">Email Preview</CardTitle>
            <CardDescription className="text-[#6B6B67]">
              See how your email will look to subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-[#E8E6E0] rounded-lg overflow-hidden">
              {/* Email Header */}
              <div className="bg-[#FAFAF8] p-4 border-b border-[#E8E6E0]">
                <div className="text-sm text-[#6B6B67]">From: <span className="text-[#1C1C1A]">Your Brand</span></div>
                <div className="text-sm text-[#6B6B67]">To: <span className="text-[#1C1C1A]">subscriber@example.com</span></div>
                <div className="text-sm text-[#6B6B67] mt-2">Subject: <span className="text-[#1C1C1A] font-medium">{subject || "No subject"}</span></div>
                {previewText && (
                  <div className="text-sm text-[#6B6B67] mt-1">{previewText}</div>
                )}
              </div>
              {/* Email Body */}
              <div className="p-6 bg-white min-h-[300px]">
                {bodyHtml ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: bodyHtml
                        .replace(/\{\{first_name\}\}/g, "John")
                        .replace(/\{\{email\}\}/g, "john@example.com")
                        .replace(/\{\{tracking_link\}\}/g, "#")
                        .replace(/\{\{unsubscribe_link\}\}/g, "#"),
                    }}
                  />
                ) : (
                  <p className="text-[#6B6B67] text-center py-12">
                    Start typing to see a preview of your email
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
