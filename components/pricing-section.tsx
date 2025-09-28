import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { PricingTable } from "@/components/pricing-table"

export function PricingSection() {
  const plans = [
    {
      name: "2 Slots",
      description: "For light users",
      features: ["2 delivery windows per month", "Basic customer support", "Area-specific pricing"],
    },
    {
      name: "4 Slots",
      description: "Family plan",
      features: [
        "4 delivery windows per month",
        "Priority customer support",
        "Area-specific pricing",
        "Bulk discounts",
      ],
      popular: true,
    },
    {
      name: "6 Slots",
      description: "Regular grocery shoppers",
      features: [
        "6 delivery windows per month",
        "Priority customer support",
        "Area-specific pricing",
        "Maximum bulk discounts",
      ],
    },
    {
      name: "Unlimited Slots",
      description: "Full convenience",
      features: [
        "Unlimited delivery windows",
        "24/7 premium support",
        "Area-specific pricing",
        "Maximum bulk discounts",
        "Early access to new areas",
      ],
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Flexible Subscription Slots</h2>
          <p className="text-lg text-muted-foreground">Choose a plan that fits your lifestyle.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Each slot equals one delivery window in your selected area.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Detailed Pricing by Location</h3>
            <p className="text-muted-foreground">See exact prices for each area and slot package</p>
          </div>
          <PricingTable />
        </div>
      </div>
    </section>
  )
}
