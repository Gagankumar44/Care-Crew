'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for trying out Care Crew',
    features: [
      'Basic AI symptom check',
      '5 AR skin scans per month',
      'Health data tracking',
      'Community support',
      'Basic health insights',
    ],
    cta: 'Start Free',
    popular: false,
    gradient: 'from-neutral-50 to-neutral-100',
  },
  {
    name: 'Professional',
    price: '$49',
    period: 'per month',
    description: 'For individuals seeking comprehensive care',
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
    popular: true,
    gradient: 'from-primary-50 to-health-50',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For healthcare organizations',
    features: [
      'Everything in Professional',
      'Multi-user dashboard',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'White-label solution',
      'Advanced security',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    popular: false,
    gradient: 'from-neutral-50 to-neutral-100',
  },
]

function PlanCard({ plan, index }: { plan: typeof plans[0], index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative group ${
        plan.popular ? 'md:-mt-8 md:mb-8' : ''
      }`}
      style={{ opacity: 1 }}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 1 }}
            transition={{ delay: index * 0.08 + 0.2, type: 'spring' }}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-primary rounded-full shadow-float-lg"
            style={{ scale: 1 }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Most Popular</span>
          </motion.div>
        </div>
      )}

      <div
        className={`h-full glass-card p-8 hover:shadow-glass-lg transition-apple ${
          plan.popular ? 'ring-2 ring-primary/20' : ''
        }`}
      >
        {/* Plan Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            {plan.description}
          </p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-neutral-900 dark:text-white">
              {plan.price}
            </span>
            {plan.period !== 'forever' && (
              <span className="text-neutral-600 dark:text-neutral-400">
                /{plan.period === 'per month' ? 'mo' : plan.period}
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-health/20 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-health" />
              </div>
              <span className="text-neutral-700 dark:text-neutral-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variant={plan.popular ? 'gradient' : 'outline'}
          size="lg"
          className="w-full group/btn"
          asChild
        >
          <Link href="/auth/register">
            {plan.cta}
            {plan.popular && (
              <Sparkles className="ml-2 w-4 h-4 group-hover/btn:animate-pulse" />
            )}
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-white dark:bg-neutral-900 relative w-full min-h-[600px]" style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}>
      {/* Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ opacity: 1 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight">
              Simple,{' '}
              <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Choose the plan that fits your healthcare needs
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
          style={{ opacity: 1 }}
        >
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            All plans include HIPAA compliance and secure data encryption
          </p>
          <Link
            href="/contact"
            className="text-primary hover:text-primary-600 transition-apple font-medium"
          >
            Questions? Contact our team →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

