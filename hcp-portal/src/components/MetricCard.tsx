'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface MetricCardProps {
  title: string
  value: string | number
  trend?: number
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'danger'
  delay?: number
  className?: string
  isAlert?: boolean
}

export function MetricCard({
  title,
  value,
  trend,
  icon,
  variant = 'default',
  delay = 0,
  className,
  isAlert = false,
}: MetricCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Check if this is Sleep Quality with low value
  const isSleepQualityAlert = title === 'Sleep Quality' && typeof value === 'string' 
    ? parseInt(value.replace('%', '')) < 60
    : isAlert

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.35,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -4,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const variantStyles = {
    default: 'bg-neutral-800/50 border-neutral-700',
    primary: 'bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20',
    success: 'bg-green-500/10 border-green-500/20',
    danger: 'bg-red-500/10 border-red-500/20',
  }

  const alertStyles = isSleepQualityAlert
    ? 'bg-gradient-to-br from-red-500/20 via-orange-500/15 to-coral-500/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-2 ring-red-500/30'
    : ''

  return (
    <motion.div
      className={cn(
        'rounded-[20px] border backdrop-blur-xl',
        isSleepQualityAlert ? 'p-8 min-h-[140px]' : 'p-6 min-h-[96px]',
        isSleepQualityAlert ? alertStyles : 'bg-neutral-800/50 ' + variantStyles[variant],
        className
      )}
      variants={prefersReducedMotion ? {} : variants}
      initial="hidden"
      animate={isSleepQualityAlert ? ['visible', 'pulse'] : 'visible'}
      whileHover={prefersReducedMotion ? {} : 'hover'}
      role="group"
      aria-label={`${title}: ${value}${isSleepQualityAlert ? ' - Alert' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className={cn(
          'font-medium text-neutral-400',
          isSleepQualityAlert ? 'text-base' : 'text-sm'
        )}>{title}</h3>
        {icon && (
          <div className={cn(
            'text-neutral-500',
            isSleepQualityAlert && 'scale-125'
          )}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={cn(
          'font-bold text-white',
          isSleepQualityAlert ? 'text-4xl' : 'text-2xl'
        )}>{value}</span>
        {trend !== undefined && (
          <span
            className={cn(
              'font-medium',
              isSleepQualityAlert ? 'text-base' : 'text-sm',
              trend >= 0 ? 'text-green-400' : 'text-red-400'
            )}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {isSleepQualityAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="mt-3 text-sm text-red-300 dark:text-red-400 font-medium"
        >
          ⚠️ Sleep quality needs attention
        </motion.div>
      )}
    </motion.div>
  )
}
