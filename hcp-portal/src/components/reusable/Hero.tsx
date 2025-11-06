'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroProps {
  badge?: string
  title: string | React.ReactNode
  description?: string
  primaryCTA?: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  stats?: Array<{ value: string; label: string }>
}

export function Hero({
  badge = 'AI-Powered Healthcare Platform',
  title,
  description = 'Revolutionary telehealth platform combining AI symptom analysis, AR-guided examinations, and seamless patient care management.',
  primaryCTA = { label: 'Start free trial', href: '/login' },
  secondaryCTA = { label: 'Watch demo', href: '#demo' },
  stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '50K+', label: 'Patients' },
    { value: 'HIPAA', label: 'Compliant' },
  ]
}: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {badge && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-medium mb-8"
            >
              {badge}
            </motion.div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h1>
          
          {description && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {primaryCTA && (
              <Button asChild size="lg" className="premium-button-gradient text-lg px-8 py-6">
                <Link href={primaryCTA.href}>
                  {primaryCTA.label}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            )}
            {secondaryCTA && (
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                <Link href={secondaryCTA.href}>
                  <Play className="mr-2 w-5 h-5" />
                  {secondaryCTA.label}
                </Link>
              </Button>
            )}
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-neutral-200 dark:border-neutral-800">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

