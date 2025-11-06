'use client'

import React from 'react'
import { Droplet, Footprints, Pill, Wind } from 'lucide-react'
import { motion } from 'framer-motion'

interface WellnessGoal {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  current: number
  target: number
  unit: string
  color: string
}

const goals: WellnessGoal[] = [
  {
    id: 'water',
    label: 'Water Intake',
    icon: Droplet,
    current: 6,
    target: 8,
    unit: 'glasses',
    color: 'blue',
  },
  {
    id: 'steps',
    label: 'Steps',
    icon: Footprints,
    current: 7240,
    target: 10000,
    unit: 'steps',
    color: 'green',
  },
  {
    id: 'medication',
    label: 'Medication',
    icon: Pill,
    current: 2,
    target: 3,
    unit: 'doses',
    color: 'purple',
  },
  {
    id: 'breathing',
    label: 'Breathing',
    icon: Wind,
    current: 1,
    target: 2,
    unit: 'sessions',
    color: 'orange',
  },
]

export function WellnessWidget() {
  return (
    <div className="glass-card p-6 rounded-[24px]"> {/* Large soft radius */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-heading">
        Daily Wellness Goals
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {goals.map((goal, index) => {
          const Icon = goal.icon
          const percentage = Math.min((goal.current / goal.target) * 100, 100)
          const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500',
          }

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-[20px] bg-white/50 dark:bg-neutral-800/50" // Large soft radius
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${colorClasses[goal.color as keyof typeof colorClasses]}/10`}>
                  <Icon className={`w-5 h-5 ${colorClasses[goal.color as keyof typeof colorClasses]}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.label}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                </div>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className={`h-2 rounded-full ${colorClasses[goal.color as keyof typeof colorClasses]}`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

