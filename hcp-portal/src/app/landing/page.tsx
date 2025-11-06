'use client'

import { LandingNavbar } from '@/components/landing/Navbar'
import { HeroNew } from '@/components/landing/HeroNew'
import { ValuePropsBar } from '@/components/landing/ValuePropsBar'
import { DemoSection } from '@/components/landing/DemoSection'
import { TrustBar } from '@/components/landing/TrustBar'
import { FeaturesSection } from '@/components/landing/Features'
import { AdvancedFeatures } from '@/components/landing/AdvancedFeatures'
import { ARPreviewSection } from '@/components/landing/ARPreviewSection'
import { HowItWorksSection } from '@/components/landing/HowItWorks'
import { TestimonialsSection } from '@/components/landing/Testimonials'
import { WhyUsSection } from '@/components/landing/WhyUs'
import { PricingSection } from '@/components/landing/Pricing'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-900 relative overflow-x-hidden" style={{ position: 'relative', width: '100%' }}>
      <LandingNavbar />
      <main id="main-content" className="relative w-full z-10" style={{ position: 'relative', width: '100%', zIndex: 10 }} tabIndex={-1}>
        <HeroNew />
        <ValuePropsBar />
        <DemoSection />
        <TrustBar />
        <FeaturesSection />
        <AdvancedFeatures />
        <ARPreviewSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <WhyUsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}


