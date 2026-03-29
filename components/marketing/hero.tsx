import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance leading-tight">
          The email platform your subscribers actually want to open
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
          Subscribers earn real rewards for every open and click. You get verified engagement. Everyone wins.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-[#A34D20] text-primary-foreground px-8 h-12 text-base">
            <Link href="/subscribe">Start Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-muted px-8 h-12 text-base">
            <Link href="#features">See How It Works</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
