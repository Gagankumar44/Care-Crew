'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Award, CheckCircle2, Lock, FileCheck, Users, Star, Quote } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface TrustBadge {
  id: string
  name: string
  icon: LucideIcon
  description?: string
  verified?: boolean
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

export interface CustomerQuote {
  id: string
  quote: string
  author: string
  role: string
  company?: string
  avatar?: string
  rating?: number
  highlight?: boolean
}

interface TrustBadgesProps {
  badges: TrustBadge[]
  title?: string
  className?: string
  layout?: 'horizontal' | 'grid' | 'compact'
}

interface CustomerQuotesProps {
  quotes: CustomerQuote[]
  title?: string
  className?: string
  layout?: 'micro' | 'compact' | 'full'
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    icon: 'text-blue-500 dark:text-blue-400',
    border: 'border-blue-500/20 dark:border-blue-500/30',
  },
  green: {
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    icon: 'text-green-500 dark:text-green-400',
    border: 'border-green-500/20 dark:border-green-500/30',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    icon: 'text-purple-500 dark:text-purple-400',
    border: 'border-purple-500/20 dark:border-purple-500/30',
  },
  orange: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    icon: 'text-orange-500 dark:text-orange-400',
    border: 'border-orange-500/20 dark:border-orange-500/30',
  },
  red: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    icon: 'text-red-500 dark:text-red-400',
    border: 'border-red-500/20 dark:border-red-500/30',
  },
}

function TrustBadgeItem({
  badge,
  index,
  layout,
}: {
  badge: TrustBadge
  index: number
  layout: 'horizontal' | 'grid' | 'compact'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = badge.icon
  const color = badge.color || 'blue'
  const scheme = colorClasses[color]

  const compactLayout = layout === 'compact'
  const gridLayout = layout === 'grid'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
      role="listitem"
    >
      <div
        className={`
          glass-card border transition-all duration-300
          ${scheme.border}
          ${compactLayout ? 'px-4 py-3' : 'px-6 py-4'}
          ${gridLayout ? 'text-center' : 'flex items-center gap-3'}
          hover:shadow-glass-lg hover:scale-105 cursor-default
        `}
        aria-label={`${badge.name}${badge.verified ? ' - Verified' : ''}`}
      >
        <div className={`flex items-center gap-3 ${gridLayout ? 'flex-col mb-2' : ''}`}>
          <div
            className={`
              ${compactLayout ? 'w-8 h-8' : 'w-10 h-10'}
              rounded-xl flex items-center justify-center
              ${scheme.bg}
              group-hover:scale-110 transition-transform duration-300
            `}
          >
            <Icon className={`${compactLayout ? 'w-4 h-4' : 'w-5 h-5'} ${scheme.icon}`} />
          </div>
          
          <div className={gridLayout ? 'text-center' : ''}>
            <div className="flex items-center gap-2">
              <span
                className={`font-medium text-neutral-900 dark:text-white ${
                  compactLayout ? 'text-sm' : 'text-base'
                }`}
              >
                {badge.name}
              </span>
              {badge.verified && (
                <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
              )}
            </div>
            {badge.description && !compactLayout && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                {badge.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function TrustBadges({
  badges,
  title,
  className = '',
  layout = 'horizontal',
}: TrustBadgesProps) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  const containerClass = {
    horizontal: 'flex flex-wrap items-center justify-center gap-4',
    grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
    compact: 'flex flex-wrap items-center justify-center gap-2',
  }[layout]

  return (
    <section
      ref={sectionRef}
      className={`py-16 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800 relative w-full ${className}`}
      aria-labelledby={title ? 'trust-badges-title' : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
        {title && (
          <motion.h2
            id="trust-badges-title"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-2xl font-semibold text-gray-900 dark:text-white mb-8"
          >
            {title}
          </motion.h2>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={containerClass}
          role="list"
          aria-label="Trust badges and certifications"
        >
          {badges.map((badge, index) => (
            <TrustBadgeItem
              key={badge.id}
              badge={badge}
              index={index}
              layout={layout}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Customer Quote Micro-Layout Component
function CustomerQuoteMicro({
  quote,
  layout,
}: {
  quote: CustomerQuote
  layout: 'micro' | 'compact' | 'full'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  if (layout === 'micro') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="group relative"
        role="article"
        aria-labelledby={`quote-${quote.id}-author`}
      >
        <div className="glass-card p-4 border border-neutral-200 dark:border-neutral-800 hover:shadow-glass-lg transition-all duration-300">
          <Quote className="w-5 h-5 text-primary/30 absolute top-3 right-3" />
          
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3 pr-4">
            "{quote.quote}"
          </p>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white">
              {quote.avatar || quote.author.charAt(0)}
            </div>
            <div>
              <div
                id={`quote-${quote.id}-author`}
                className="text-xs font-semibold text-neutral-900 dark:text-white"
              >
                {quote.author}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-500">
                {quote.role}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (layout === 'compact') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="group relative"
        role="article"
        aria-labelledby={`quote-${quote.id}-author`}
      >
        <div
          className={`
            glass-card p-6 border border-neutral-200 dark:border-neutral-800
            hover:shadow-glass-lg transition-all duration-300 relative
            ${quote.highlight ? 'ring-2 ring-primary/30' : ''}
          `}
        >
          <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
          
          {quote.rating && (
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < quote.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-neutral-300 dark:text-neutral-700'
                  }`}
                />
              ))}
            </div>
          )}

          <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4 pr-8">
            "{quote.quote}"
          </p>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-white shadow-lg">
              {quote.avatar || quote.author.charAt(0)}
            </div>
            <div>
              <div
                id={`quote-${quote.id}-author`}
                className="font-semibold text-neutral-900 dark:text-white"
              >
                {quote.author}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-500">
                {quote.role}
                {quote.company && ` • ${quote.company}`}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Full layout
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
      role="article"
      aria-labelledby={`quote-${quote.id}-author`}
    >
      <div
        className={`
          glass-card p-8 border border-neutral-200 dark:border-neutral-800
          hover:shadow-glass-lg transition-all duration-300 relative
          ${quote.highlight ? 'ring-2 ring-primary/30 md:-mt-4 md:mb-4' : ''}
        `}
      >
        <Quote className="w-12 h-12 text-primary/20 absolute top-6 right-6" />
        
        {quote.rating && (
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < quote.rating!
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-neutral-300 dark:text-neutral-700'
                }`}
              />
            ))}
          </div>
        )}

        <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 pr-12">
          "{quote.quote}"
        </p>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-semibold text-white shadow-lg">
            {quote.avatar || quote.author.charAt(0)}
          </div>
          <div>
            <div
              id={`quote-${quote.id}-author`}
              className="font-semibold text-lg text-neutral-900 dark:text-white"
            >
              {quote.author}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-500">
              {quote.role}
              {quote.company && ` at ${quote.company}`}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function CustomerQuotes({
  quotes,
  title,
  className = '',
  layout = 'compact',
}: CustomerQuotesProps) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  const gridClass = {
    micro: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
    compact: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    full: 'grid grid-cols-1 md:grid-cols-3 gap-8',
  }[layout]

  return (
    <section
      ref={sectionRef}
      className={`py-32 bg-gradient-apple relative w-full ${className}`}
      aria-labelledby={title ? 'quotes-title' : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2
              id="quotes-title"
              className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight"
            >
              {title}
            </h2>
          </motion.div>
        )}

        <div
          className={gridClass}
          role="list"
          aria-label="Customer testimonials and quotes"
        >
          {quotes.map((quote) => (
            <CustomerQuoteMicro key={quote.id} quote={quote} layout={layout} />
          ))}
        </div>
      </div>
    </section>
  )
}

