"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Send, Eye, CheckCircle, Coins, Gift } from "lucide-react"
import Link from "next/link"
import { useDemoSenderConfig } from "@/hooks/use-demo-sender-config"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DemoNewCampaignPage() {
  const { config, isLoaded } = useDemoSenderConfig()
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [previewText, setPreviewText] = useState("")
  const [bodyHtml, setBodyHtml] = useState("")
  const [openReward, setOpenReward] = useState(5)
  const [clickReward, setClickReward] = useState(10)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    setOpenReward(config.interactionRewards.emailOpen)
    setClickReward(config.interactionRewards.linkClick)
  }, [config.interactionRewards.emailOpen, config.interactionRewards.linkClick, isLoaded])

  const handleSave = async (status: "draft" | "sent" = "draft") => {
    setSaving(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (status === "sent") {
      setSuccessMessage(
        `Campaign sent successfully! Demo rewards are set to ${openReward} tokens per open and ${clickReward} tokens per click.`
      )
    } else {
      setSuccessMessage("Draft saved successfully!")
    }
    setShowSuccess(true)
    setSaving(false)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/demo/sender/campaigns">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Create Campaign</h1>
          <p className="text-muted-foreground mt-1">Design your email and define the token incentives tied to engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="border-border"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave("sent")}
            disabled={saving || !subject}
            className="bg-primary hover:bg-[#A34D20] text-primary-foreground"
          >
            <Send className="w-4 h-4 mr-2" />
            {saving ? "Sending..." : "Send Now"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Campaign Details</CardTitle>
              <CardDescription className="text-muted-foreground">
                Set up the basic information for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Campaign Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., March Newsletter"
                  className="border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground">Subject Line</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Your weekly update is here!"
                  className="border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preview" className="text-foreground">Preview Text</Label>
                <Input
                  id="preview"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Text that appears after the subject line"
                  className="border-border focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Interaction Rewards</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Set how many platform tokens this email awards for each engagement action.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="campaignOpenReward" className="text-foreground">Tokens Per Open</Label>
                  <Input
                    id="campaignOpenReward"
                    type="number"
                    min="0"
                    value={openReward}
                    onChange={(e) => setOpenReward(Number(e.target.value) || 0)}
                    className="border-border focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignClickReward" className="text-foreground">Tokens Per Click</Label>
                  <Input
                    id="campaignClickReward"
                    type="number"
                    min="0"
                    value={clickReward}
                    onChange={(e) => setClickReward(Number(e.target.value) || 0)}
                    className="border-border focus:ring-primary"
                  />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                Default sender program settings currently award {config.interactionRewards.signUp} tokens on signup,
                {" "}{config.interactionRewards.emailOpen} per open, and {config.interactionRewards.linkClick} per click.
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Available Redemptions</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                These are the partial-value offers subscribers can work toward inside this sender's ecosystem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.redemptionOptions.map((option) => (
                <div key={option.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{option.title || "Untitled Reward"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{option.description || "Add a reward description in the sender dashboard."}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{option.tokenCost} tokens</p>
                      <p className="text-xs text-muted-foreground">{option.rewardValue || "Value TBD"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Email Content</CardTitle>
              <CardDescription className="text-muted-foreground">
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
                className="min-h-[300px] font-mono text-sm border-border focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Available variables: {"{{first_name}}"}, {"{{email}}"}, {"{{tracking_link}}"}, {"{{unsubscribe_link}}"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <Card className="border border-border bg-card h-fit sticky top-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Email Preview</CardTitle>
                <CardDescription className="text-muted-foreground">
                  See how your email will look to subscribers
                </CardDescription>
              </div>
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Email Header */}
              <div className="bg-muted p-4 border-b border-border">
                <div className="text-sm text-muted-foreground">From: <span className="text-foreground">Your Brand</span></div>
                <div className="text-sm text-muted-foreground">To: <span className="text-foreground">subscriber@example.com</span></div>
                <div className="text-sm text-muted-foreground mt-2">Subject: <span className="text-foreground font-medium">{subject || "No subject"}</span></div>
                {previewText && (
                  <div className="text-sm text-muted-foreground mt-1">{previewText}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-px border-b border-border bg-border">
                <div className="bg-muted px-4 py-3 text-sm text-muted-foreground">
                  Opens earn <span className="font-medium text-foreground">{openReward} tokens</span>
                </div>
                <div className="bg-muted px-4 py-3 text-sm text-muted-foreground">
                  Clicks earn <span className="font-medium text-foreground">{clickReward} tokens</span>
                </div>
              </div>
              {/* Email Body */}
              <div className="p-6 bg-card min-h-[300px]">
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
                  <p className="text-muted-foreground text-center py-12">
                    Start typing to see a preview of your email
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-secondary" />
              <AlertDialogTitle>Success</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {successMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => router.push("/demo/sender/campaigns")}
              className="bg-primary hover:bg-[#A34D20]"
            >
              Back to Campaigns
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
