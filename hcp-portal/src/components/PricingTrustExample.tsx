/**
 * Example usage of PricingEnhanced, TrustBadges, and TestimonialTemplate components
 * 
 * This file demonstrates how to use all three components together
 * to create a comprehensive pricing and trust section.
 */

'use client'

import { PricingEnhanced, PricingPlan } from './PricingEnhanced'
import { TrustBadges, TrustBadge, CustomerQuotes, CustomerQuote } from './TrustBadges'
import { TestimonialGrid, Testimonial } from './TestimonialTemplate'
import { 
  Brain, Camera, Activity, Shield, CheckCircle2, Lock, 
  FileCheck, Award, Users 
} from 'lucide-react'

// Example Pricing Plans with all variants
const examplePricingPlans: PricingPlan[] = [
  {
    id: 'simple',
    name: 'Simple',
    variant: 'simple',
    description: 'Perfect for individuals getting started',
    priceMonthly: 29,
    priceAnnual: 279, // ~$23/mo when billed annually
    features: [
      'Basic AI symptom check',
      '10 AR skin scans per month',
      'Health data tracking',
      'Community support',
      'Basic health insights',
    ],
    cta: 'Start Free Trial',
    href: '/auth/register?plan=simple',
    popular: false,
    billingInfo: {
      text: 'Cancel anytime',
      details: 'No long-term commitments. Cancel your subscription at any time with no penalties.',
    },
    securityInfo: {
      text: 'HIPAA compliant',
      details: 'All data is encrypted and stored in compliance with HIPAA regulations.',
    },
  },
  {
    id: 'business',
    name: 'Business',
    variant: 'business',
    description: 'For healthcare professionals and small practices',
    priceMonthly: 99,
    priceAnnual: 949, // ~$79/mo when billed annually
    features: [
      'Unlimited AI symptom checks',
      'Unlimited AR scans',
      'Priority health insights',
      '24/7 AI health assistant',
      'Advanced health analytics',
      'Medication reminders',
      'Video consultations',
      'HIPAA compliance',
    ],
    cta: 'Get Started',
    href: '/auth/register?plan=business',
    popular: true,
    billingInfo: {
      text: 'Cancel anytime',
      details: 'No long-term commitments. Cancel your subscription at any time with no penalties.',
    },
    securityInfo: {
      text: 'HIPAA + SOC 2',
      details: 'Enterprise-grade security with HIPAA compliance and SOC 2 Type II certification.',
    },
    slaInfo: {
      text: '99.9% uptime SLA',
      details: 'Guaranteed 99.9% uptime with 24/7 monitoring and support.',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    variant: 'enterprise',
    description: 'For large healthcare organizations',
    priceMonthly: 0,
    priceAnnual: 0,
    priceLabel: 'Custom',
    features: [
      'Everything in Business',
      'Multi-user dashboard',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'White-label solution',
      'Advanced security',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    href: '/contact?plan=enterprise',
    popular: false,
    billingInfo: {
      text: 'Custom billing',
      details: 'Flexible billing options including annual contracts, PO-based billing, and volume discounts.',
    },
    securityInfo: {
      text: 'Enterprise security',
      details: 'Advanced security features including SSO, RBAC, audit logs, and dedicated security reviews.',
    },
    slaInfo: {
      text: '99.99% uptime SLA',
      details: 'Enterprise-grade SLA with dedicated account manager and priority support.',
    },
  },
]

// Example Trust Badges
const exampleTrustBadges: TrustBadge[] = [
  {
    id: 'hipaa',
    name: 'HIPAA Certified',
    icon: Shield,
    description: 'Compliant with healthcare privacy regulations',
    verified: true,
    color: 'blue',
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    icon: Lock,
    description: 'Enterprise-grade security certified',
    verified: true,
    color: 'green',
  },
  {
    id: 'fda',
    name: 'FDA Approved',
    icon: Award,
    description: 'Medical device cleared by FDA',
    verified: true,
    color: 'purple',
  },
  {
    id: 'gdpr',
    name: 'GDPR Compliant',
    icon: FileCheck,
    description: 'Meets EU data protection standards',
    verified: true,
    color: 'orange',
  },
]

// Example Customer Quotes (Micro Layout)
const exampleQuotes: CustomerQuote[] = [
  {
    id: 'quote-1',
    quote: 'MediAR has revolutionized our patient care workflow.',
    author: 'Dr. Sarah Chen',
    role: 'Chief Medical Officer',
    company: 'HealthCorp',
    rating: 5,
    highlight: true,
  },
  {
    id: 'quote-2',
    quote: 'The AI accuracy is impressive. Saves us hours daily.',
    author: 'Michael Rodriguez',
    role: 'Practice Manager',
    company: 'Family Care Clinic',
    rating: 5,
  },
  {
    id: 'quote-3',
    quote: 'Best investment we\'ve made for our practice.',
    author: 'Emily Watson',
    role: 'CEO',
    company: 'Community Health',
    rating: 5,
  },
]

// Example Testimonials
const exampleTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: 'MediAR has transformed how we deliver healthcare. The AR technology is incredible and our patients love it.',
    author: 'Dr. James Thompson',
    role: 'Medical Director',
    company: 'Metro Hospital',
    rating: 5,
    verified: true,
    featured: true,
    tags: ['Healthcare', 'AR Technology', 'Patient Care'],
  },
  {
    id: 'testimonial-2',
    quote: 'The AI triage system has reduced our wait times by 40%. Highly recommended!',
    author: 'Maria Garcia',
    role: 'Operations Manager',
    company: 'Urgent Care Plus',
    rating: 5,
    verified: true,
    tags: ['Efficiency', 'AI'],
  },
  {
    id: 'testimonial-3',
    quote: 'Easy to implement, great support team, and our patients are happy.',
    author: 'Robert Kim',
    role: 'Clinic Administrator',
    company: 'Wellness Center',
    rating: 4,
    tags: ['Implementation', 'Support'],
  },
]

// Complete Example Component
export function PricingTrustExample() {
  return (
    <div className="space-y-0">
      {/* Pricing Section */}
      <PricingEnhanced
        plans={examplePricingPlans}
        title="Simple, Transparent Pricing"
        description="Choose the plan that fits your needs. All plans include a 14-day free trial."
        showToggle={true}
        defaultBilling="monthly"
      />

      {/* Trust Badges */}
      <TrustBadges
        badges={exampleTrustBadges}
        title="Trusted & Certified"
        layout="horizontal"
      />

      {/* Customer Quotes (Micro Layout) */}
      <CustomerQuotes
        quotes={exampleQuotes}
        title="What Our Customers Say"
        layout="compact"
      />

      {/* Testimonials Grid */}
      <TestimonialGrid
        testimonials={exampleTestimonials}
        variant="medium"
        columns={3}
        title="Trusted by Healthcare Professionals"
        description="Join thousands of healthcare providers using MediAR"
      />
    </div>
  )
}

