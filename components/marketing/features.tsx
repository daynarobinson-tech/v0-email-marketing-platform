import { Shield, Coins, FileCheck } from "lucide-react"

const features = [
  {
    name: "Consent Ledger",
    description: "Every subscription is cryptographically recorded. Prove consent instantly, stay compliant effortlessly.",
    icon: Shield,
  },
  {
    name: "Engagement Tokens",
    description: "Subscribers earn points for opens and clicks. Redeem for real rewards. Watch engagement soar.",
    icon: Coins,
  },
  {
    name: "Content Stamps",
    description: "Timestamp every email sent. Create an immutable record of what was sent and when.",
    icon: FileCheck,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Built for trust, designed for growth
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Three core features that transform how you and your subscribers interact.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="p-8 rounded-lg border border-border bg-background"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
