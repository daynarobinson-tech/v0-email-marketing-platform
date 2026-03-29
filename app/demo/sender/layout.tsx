"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Mail, 
  Upload,
  BarChart3, 
  ArrowLeft,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

const demoSidebarLinks = [
  { href: "/demo/sender", label: "Overview", icon: Home },
  { href: "/demo/sender/campaigns", label: "Campaigns", icon: Mail },
  { href: "/demo/sender/import", label: "Import Subscribers", icon: Upload },
  { href: "/demo/sender/analytics", label: "Analytics", icon: BarChart3 },
]

export default function DemoSenderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm fixed top-0 left-0 right-0 z-50">
        <span className="font-medium">Demo Mode</span> — This is sample data. 
        <Link href="/auth/sign-up" className="underline ml-2 hover:no-underline">
          Sign up to create your own dashboard
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-12 left-4 z-50 p-2 rounded-lg border border-border bg-card"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40 pt-10"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-10 left-0 z-40 h-[calc(100vh-40px)] w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Link href="/" className="text-xl font-semibold text-foreground">
              Bloom
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Sender Dashboard (Demo)
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {demoSidebarLinks.map((link) => {
              const isActive = pathname === link.href
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

          <div className="p-4 border-t border-border space-y-2">
            <Button asChild className="w-full bg-primary hover:bg-[#A34D20] text-primary-foreground">
              <Link href="/auth/sign-up">
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-10">
        {children}
      </main>
    </div>
  )
}
