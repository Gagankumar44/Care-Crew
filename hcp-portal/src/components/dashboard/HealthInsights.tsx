'use client'

import React from 'react'
import { Sparkles, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface Insight {
  id: string
  message: string
  type: 'positive' | 'warning' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
}

const insights: Insight[] = [
  {
    id: '1',
    message: 'Your stress increased 5% this week — try deep breathing exercises or increase hydration.',
    type: 'warning',
    icon: AlertCircle,
  },
  {
    id: '2',
    message: 'Great job! Your sleep quality improved by 8% this week.',
    type: 'positive',
    icon: TrendingUp,
  },
  {
    id: '3',
    message: 'Your heart rate is within normal range. Keep up the good work!',
    type: 'positive',
    icon: TrendingUp,
  },
]

export function HealthInsights() {
  return (
    <div className="glass-card p-8 rounded-[24px]"> {/* Large soft radius, more padding */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-2xl bg-primary-500/10">
          <Sparkles className="w-6 h-6 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
          Smart Health Insights
        </h2>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          const colorClasses = {
            positive: 'bg-success-500/10 border-success-500/20 text-success-700 dark:text-success-400',
            warning: 'bg-secondary-500/10 border-secondary-500/20 text-secondary-700 dark:text-secondary-400',
            neutral: 'bg-accent-300/10 border-accent-300/20 text-accent-700 dark:text-accent-400',
          }

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-[20px] border ${colorClasses[insight.type]}`} // Large soft radius
            >
              <div className="flex items-start gap-4">
                <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <p className="text-base leading-relaxed">{insight.message}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

