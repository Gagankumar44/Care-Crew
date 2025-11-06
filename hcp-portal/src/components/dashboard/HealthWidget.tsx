'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import React from 'react'

interface HealthWidgetProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | null
  trendValue?: string
  color?: 'blue' | 'green' | 'red' | 'orange'
  pulse?: boolean
  delay?: number
}

const colors = {
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-500',
    pulse: 'bg-blue-500',
  },
  green: {
    bg: 'bg-green-500/10',
    icon: 'text-green-500',
    pulse: 'bg-green-500',
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-500',
    pulse: 'bg-red-500',
  },
  orange: {
    bg: 'bg-orange-500/10',
    icon: 'text-orange-500',
    pulse: 'bg-orange-500',
  },
}

export function HealthWidget({
  title,
  value,
  unit,
  icon: Icon,
  trend = null,
  trendValue,
  color = 'blue',
  pulse = false,
  delay = 0,
}: HealthWidgetProps) {
  const colorScheme = colors[color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorScheme.bg}`}>
          <Icon className={`${colorScheme.icon} w-5 h-5`} />
        </div>

        {trend && trendValue && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              trend === 'up' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}
          >
            {trend === 'up' ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {trendValue}
          </div>
        )}
      </div>

      <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wide">
        {title}
      </h4>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {unit}
          </span>
        )}
      </div>

      {/* Pulse animation */}
      {pulse && (
        <div className="absolute -bottom-2 -right-2 w-24 h-24">
          <motion.div
            className={`absolute inset-0 rounded-full ${colorScheme.pulse}`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}
    </motion.div>
  )
}
