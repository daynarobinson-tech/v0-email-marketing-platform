"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle2 } from "lucide-react"

export default function SubscribePage() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [consent, setConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!consent) {
      setError("Please agree to receive emails to continue.")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // Insert subscriber into database
      const { data: subscriber, error: insertError } = await supabase
        .from("subscribers")
        .insert({
          email,
          first_name: firstName,
          token_balance: 10, // Starting bonus
        })
        .select()
        .single()

      if (insertError) {
        if (insertError.code === "23505") {
          setError("This email is already subscribed.")
        } else {
          throw insertError
        }
        return
      }

      // Create join event
      await supabase.from("events").insert({
        subscriber_id: subscriber.id,
        event_type: "joined",
        points_earned: 10,
      })

      setIsSuccess(true)
    } catch (err) {
      console.error("Subscription error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {"You're in."}
          </h1>
          <p className="text-muted-foreground mb-8">
            Your rewards wallet is ready. You just earned 10 points for joining!
          </p>
          <Button asChild className="bg-primary hover:bg-[#A34D20] text-primary-foreground">
            <Link href="/auth/login">Log In to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Bloom
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-foreground">
            Join the list
          </h1>
          <p className="mt-2 text-muted-foreground">
            Start earning rewards for every email you open.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 rounded-lg border border-border bg-card">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1.5 bg-background border-border"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1.5 bg-background border-border"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I agree to receive emails and my consent is being recorded securely
              </Label>
            </div>

            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="mt-6 w-full bg-primary hover:bg-[#A34D20] text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already subscribed?{" "}
          <Link href="/auth/login" className="text-primary hover:text-[#A34D20]">
            Log in to your dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
