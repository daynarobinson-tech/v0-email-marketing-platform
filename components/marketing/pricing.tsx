import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    price: "$47",
    period: "/mo",
    description: "Perfect for creators and small lists",
    features: [
      "Up to 2,500 subscribers",
      "Unlimited emails",
      "Basic engagement tracking",
      "Consent ledger",
      "Email support",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Growth",
    price: "$147",
    period: "/mo",
    description: "For growing businesses",
    features: [
      "Up to 15,000 subscribers",
      "Unlimited emails",
      "Advanced analytics",
      "Engagement tokens",
      "Content stamps",
      "Priority support",
    ],
    cta: "Start Free",
    featured: true,
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    description: "For teams and agencies",
    features: [
      "Unlimited subscribers",
      "Unlimited emails",
      "White-label options",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, scale as you grow.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-8 rounded-lg border ${
                tier.featured
                  ? "border-primary bg-card"
                  : "border-border bg-card"
              }`}
            >
              <h3 className="text-xl font-semibold text-foreground">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-semibold text-foreground">
                  {tier.price}
                </span>
                <span className="ml-1 text-muted-foreground">{tier.period}</span>
              </div>
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 w-full ${
                  tier.featured
                    ? "bg-primary hover:bg-[#A34D20] text-primary-foreground"
                    : "bg-foreground hover:bg-foreground/90 text-background"
                }`}
              >
                <Link href={tier.name === "Agency" ? "#" : "/subscribe"}>
                  {tier.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
