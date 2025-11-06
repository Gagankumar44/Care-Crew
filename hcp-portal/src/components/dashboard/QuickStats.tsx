'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Stat {
  id: string
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  unit?: string
}

interface QuickStatsProps {
  stats?: Stat[]
}

const defaultStats: Stat[] = [
  {
    id: 'heart',
    label: 'Avg Heart Rate',
    value: 72,
    unit: 'bpm',
    change: -2,
    trend: 'down'
  },
  {
    id: 'steps',
    label: 'Daily Steps',
    value: '8.2k',
    change: 5,
    trend: 'up'
  },
  {
    id: 'sleep',
    label: 'Sleep Score',
    value: 87,
    unit: '%',
    change: 8,
    trend: 'up'
  },
  {
    id: 'weight',
    label: 'Weight',
    value: 165,
    unit: 'lbs',
    change: 0,
    trend: 'neutral'
  }
]

export function QuickStats({ stats = defaultStats }: QuickStatsProps) {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
        >
          <div className="text-white/60 text-xs font-medium mb-2">
            {stat.label}
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-white">
              {stat.value}
            </span>
            {stat.unit && (
              <span className="text-sm text-white/60">
                {stat.unit}
              </span>
            )}
          </div>

          {stat.change !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon(stat.trend)}
              <span className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </span>
              <span className="text-xs text-white/40">vs last week</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

