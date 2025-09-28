import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { VisionSection } from "@/components/vision-section"
import { HowItWorks } from "@/components/how-it-works"
import { UserSegments } from "@/components/user-segments"
import { PricingSection } from "@/components/pricing-section"
import { LocationPackages } from "@/components/location-packages"
import { Testimonials } from "@/components/testimonials"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { FloatingChat } from "@/components/floating-chat"
import { StickyCTA } from "@/components/sticky-cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <VisionSection />
      <HowItWorks />
      <UserSegments />
      <PricingSection />
      <LocationPackages />
      <Testimonials />
      <CTASection />
      <Footer />
      <FloatingChat />
      <StickyCTA />
    </main>
  )
}
