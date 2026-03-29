import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

export default function RedeemPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Rewards Coming Soon
        </h1>
        <p className="text-muted-foreground mb-8">
          {"We're working on exciting rewards for you. Keep engaging with emails to earn more points!"}
        </p>
        <Button asChild variant="outline" className="border-border">
          <Link href="/dashboard/subscriber">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
