'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { Check, Sparkles, Shield, Lock, Clock, CreditCard, Zap, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface PricingPlan {
  id: string
  name: string
  variant: 'simple' | 'business' | 'enterprise'
  description: string
  priceMonthly: number
  priceAnnual: number
  priceLabel?: string // For "Custom" or "Free" pricing
  features: string[]
  cta: string
  href?: string
  onClick?: () => void
  popular?: boolean
  // Microcopy to reduce objections
  billingInfo?: {
    text: string
    details?: string
  }
  securityInfo?: {
    text: string
    details?: string
  }
  slaInfo?: {
    text: string
    details?: string
  }
}

interface PricingEnhancedProps {
  plans: PricingPlan[]
  title?: string
  description?: string
  className?: string
  showToggle?: boolean
  defaultBilling?: 'monthly' | 'annual'
}

function BillingToggle({
  billingPeriod,
  onToggle,
}: {
  billingPeriod: 'monthly' | 'annual'
  onToggle: (period: 'monthly' | 'annual') => void
}) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex items-center gap-2 p-1 glass-card rounded-full border border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => onToggle('monthly')}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${billingPeriod === 'monthly'
              ? 'bg-primary text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }
          `}
          aria-pressed={billingPeriod === 'monthly'}
          aria-label="Monthly billing"
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onToggle('annual')}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative
            ${billingPeriod === 'annual'
              ? 'bg-primary text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }
          `}
          aria-pressed={billingPeriod === 'annual'}
          aria-label="Annual billing"
        >
          Annual
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            Save 20%
          </span>
        </button>
      </div>
    </div>
  )
}

function MicrocopyPill({
  icon: Icon,
  text,
  details,
}: {
  icon: React.ElementType
  text: string
  details?: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{text}</span>
      
      {details && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 glass-card rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 z-50 pointer-events-none"
              role="tooltip"
            >
              {details}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rotate-45 -mt-1" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

function PricingCard({
  plan,
  billingPeriod,
  index,
}: {
  plan: PricingPlan
  billingPeriod: 'monthly' | 'annual'
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const displayPrice =
    plan.priceLabel || 
    (billingPeriod === 'monthly'
      ? `$${plan.priceMonthly}`
      : `$${plan.priceAnnual}`)
  
  const monthlyEquivalent = billingPeriod === 'annual' 
    ? Math.round(plan.priceAnnual / 12)
    : plan.priceMonthly

  const colorVariants = {
    simple: {
      bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      icon: 'text-blue-500 dark:text-blue-400',
      badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
    business: {
      bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      icon: 'text-purple-500 dark:text-purple-400',
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    },
    enterprise: {
      bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      icon: 'text-green-500 dark:text-green-400',
      badge: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    },
  }

  const variant = colorVariants[plan.variant]

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      animate={isHovered ? 'hover' : 'visible'}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative h-full ${
        plan.popular ? 'md:-mt-4 md:mb-4 z-10' : ''
      }`}
      role="article"
      aria-labelledby={`plan-${plan.id}-title`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Most Popular</span>
          </motion.div>
        </div>
      )}

      <div
        className={`
          h-full glass-card p-8 relative overflow-hidden
          transition-all duration-300
          ${plan.popular ? 'ring-2 ring-primary/30 shadow-glass-lg' : ''}
        `}
      >
        {/* Background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${variant.bg} pointer-events-none transition-opacity duration-300`}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Variant Badge */}
        <div className="relative z-10 mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 ${variant.badge}`}>
            {plan.variant}
          </div>

          {/* Plan Header */}
          <h3
            id={`plan-${plan.id}-title`}
            className="text-2xl font-bold text-neutral-900 dark:text-white mb-2"
          >
            {plan.name}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
            {plan.description}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-neutral-900 dark:text-white tabular-nums">
                {displayPrice}
              </span>
              {!plan.priceLabel && (
                <span className="text-neutral-600 dark:text-neutral-400 text-lg">
                  /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </span>
              )}
            </div>
            {billingPeriod === 'annual' && !plan.priceLabel && (
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                ${monthlyEquivalent}/mo billed annually
              </p>
            )}
          </div>

          {/* Microcopy Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {plan.billingInfo && (
              <MicrocopyPill
                icon={CreditCard}
                text={plan.billingInfo.text}
                details={plan.billingInfo.details}
              />
            )}
            {plan.securityInfo && (
              <MicrocopyPill
                icon={Shield}
                text={plan.securityInfo.text}
                details={plan.securityInfo.details}
              />
            )}
            {plan.slaInfo && (
              <MicrocopyPill
                icon={Clock}
                text={plan.slaInfo.text}
                details={plan.slaInfo.details}
              />
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="relative z-10 space-y-3 mb-8" role="list">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 dark:bg-green-500/20 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
              </div>
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="relative z-10">
          {plan.href ? (
            <Button
              variant={plan.popular ? 'gradient' : 'outline'}
              size="lg"
              className="w-full group/btn"
              asChild
            >
              <Link href={plan.href}>
                {plan.cta}
                {plan.popular && (
                  <Sparkles className="ml-2 w-4 h-4 group-hover/btn:animate-pulse" />
                )}
              </Link>
            </Button>
          ) : (
            <Button
              variant={plan.popular ? 'gradient' : 'outline'}
              size="lg"
              className="w-full group/btn"
              onClick={plan.onClick}
            >
              {plan.cta}
              {plan.popular && (
                <Sparkles className="ml-2 w-4 h-4 group-hover/btn:animate-pulse" />
              )}
            </Button>
          )}

          {/* Trust indicators */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>HIPAA</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-primary/5 blur-xl pointer-events-none transition-opacity duration-300"
          animate={{ opacity: isHovered ? 0.1 : 0 }}
        />
      </div>
    </motion.div>
  )
}

export function PricingEnhanced({
  plans,
  title = 'Simple, Transparent Pricing',
  description = 'Choose the plan that fits your needs',
  className = '',
  showToggle = true,
  defaultBilling = 'monthly',
}: PricingEnhancedProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>(
    defaultBilling
  )

  return (
    <section
      className={`py-32 bg-white dark:bg-neutral-900 relative w-full ${className}`}
      aria-labelledby="pricing-title"
    >
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2
            id="pricing-title"
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight"
          >
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Billing Toggle */}
        {showToggle && (
          <BillingToggle
            billingPeriod={billingPeriod}
            onToggle={setBillingPeriod}
          />
        )}

        {/* Pricing Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          role="list"
          aria-label="Pricing plans"
        >
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              index={index}
            />
          ))}
        </div>

        {/* FAQ / Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-neutral-200 dark:border-neutral-800">
            <HelpCircle className="w-4 h-4 text-neutral-500 dark:text-neutral-500" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Questions about pricing?
            </span>
            <Link
              href="/contact"
              className="text-sm font-medium text-primary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Contact us →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

