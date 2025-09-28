import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function LocationPackages() {
  const locations = [
    { name: "Yaba Package", area: "Yaba" },
    { name: "Surulere Package", area: "Surulere" },
    { name: "Ikeja Package", area: "Ikeja" },
    { name: "Lekki 1 Package", area: "Lekki Phase 1" },
    { name: "Lekki 2 Package", area: "Lekki Phase 2" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Location-Based Packages</h2>
          <p className="text-lg text-muted-foreground">Your package price depends on your area — no hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {locations.map((location, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">{location.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">{location.area}</p>
                <p className="text-xs text-primary mt-2 font-medium">View Pricing</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
