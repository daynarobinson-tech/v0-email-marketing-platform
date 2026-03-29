import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-lg font-semibold text-foreground">
              TrustLoop
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Email marketing that rewards engagement.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/subscribe" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Subscribe
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Log In
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TrustLoop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
