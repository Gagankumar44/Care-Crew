'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card } from './Card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color?: 'blue' | 'red' | 'green' | 'orange' | 'purple'
  trend?: { value: string; direction: 'up' | 'down' }
  className?: string
  delay?: number
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  className,
  delay = 0
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={cn('p-6', className)}>
        <div className="flex items-center justify-between mb-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={cn(
              'text-xs font-medium',
              trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </div>
      </Card>
    </motion.div>
  )
}

