"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || 
            `${window.location.origin}/dashboard/subscriber`,
          data: {
            first_name: firstName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // Automatically create the subscriber profile so their dashboard loads
      if (data?.user) {
        await supabase.from("subscribers").insert({
          user_id: data.user.id,
          email: email,
          first_name: firstName,
          token_balance: 0,
        })
      }

      // If email confirmation is disabled, Supabase instantly returns a session.
      if (data?.session) {
        router.push("/dashboard/subscriber")
        return
      }

      setIsSuccess(true)
    } catch (err) {
      console.error("Sign up error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Check your email
          </h1>
          <p className="text-muted-foreground mb-8">
            {"We've sent you a confirmation link. Please check your email to complete your registration."}
          </p>
          <Button asChild variant="outline" className="border-border">
            <Link href="/auth/login">Back to Login</Link>
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
            Create your account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Start earning rewards for engagement
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
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1.5 bg-background border-border"
                  placeholder="Create a password"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="mt-6 w-full bg-primary hover:bg-[#A34D20] text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:text-[#A34D20]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
