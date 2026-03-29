"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Home, 
  Gift, 
  Activity, 
  Users, 
  Mail, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  type: "subscriber" | "sender"
}

const subscriberLinks = [
  { href: "/dashboard/subscriber", label: "Overview", icon: Home },
  { href: "/dashboard/subscriber#activity", label: "Activity", icon: Activity },
  { href: "/redeem", label: "Redeem Rewards", icon: Gift },
]

const senderLinks = [
  { href: "/dashboard/sender", label: "Overview", icon: Home },
  { href: "/dashboard/sender#subscribers", label: "Subscribers", icon: Users },
  { href: "/dashboard/sender#campaigns", label: "Campaigns", icon: Mail },
  { href: "/dashboard/sender#analytics", label: "Analytics", icon: BarChart3 },
]

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const links = type === "subscriber" ? subscriberLinks : senderLinks

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg border border-border bg-card"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Link href="/" className="text-xl font-semibold text-foreground">
              Bloom
            </Link>
            <p className="mt-1 text-xs text-muted-foreground capitalize">
              {type} Dashboard
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/dashboard/subscriber" && link.href !== "/dashboard/sender" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
