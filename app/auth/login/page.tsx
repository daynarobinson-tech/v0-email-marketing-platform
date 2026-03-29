"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      // Check if user is a subscriber or sender (for demo, we'll route to subscriber dashboard)
      router.push("/dashboard/subscriber")
    } catch (err) {
      console.error("Login error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Bloom
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-muted-foreground">
            Log in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 rounded-lg border border-border bg-card">
            <div className="space-y-4">
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
                  className="mt-1.5 bg-background border-border"
                  placeholder="Enter your password"
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
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {"Don't have an account?"}{" "}
            <Link href="/auth/sign-up" className="text-primary hover:text-[#A34D20]">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard/sender" className="text-primary hover:text-[#A34D20]">
              Sender Dashboard (Demo)
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
