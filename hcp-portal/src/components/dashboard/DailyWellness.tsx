'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Droplet, Footprints, Pill, Wind } from 'lucide-react'

interface WellnessGoal {
  id: string
  label: string
  icon: React.ElementType
  current: number
  target: number
  unit: string
  color: string
}

const defaultGoals: WellnessGoal[] = [
  { 
    id: 'water', 
    label: 'Water', 
    icon: Droplet, 
    current: 6, 
    target: 8, 
    unit: 'glasses', 
    color: '#60A5FA' 
  },
  { 
    id: 'steps', 
    label: 'Steps', 
    icon: Footprints, 
    current: 7240, 
    target: 10000, 
    unit: 'steps', 
    color: '#34D399' 
  },
  { 
    id: 'medication', 
    label: 'Medication', 
    icon: Pill, 
    current: 2, 
    target: 3, 
    unit: 'doses', 
    color: '#A78BFA' 
  },
  { 
    id: 'breathing', 
    label: 'Breathing', 
    icon: Wind, 
    current: 1, 
    target: 2, 
    unit: 'sessions', 
    color: '#FB923C' 
  },
]

interface DailyWellnessProps {
  goals?: WellnessGoal[]
}

export function DailyWellness({ goals = defaultGoals }: DailyWellnessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-8 rounded-[24px] w-full"
    >
      <h2 className="text-2xl font-semibold text-white mb-6">
        Daily Wellness Goals
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {goals.map((goal, index) => {
          const Icon = goal.icon
          const percentage = Math.min((goal.current / goal.target) * 100, 100)
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${goal.color}20` }}
                >
                  <Icon 
                    className="w-6 h-6" 
                    style={{ color: goal.color }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm">
                    {goal.label}
                  </h3>
                  <p className="text-white/60 text-xs">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: goal.color }}
                />
              </div>
              
              {/* Percentage */}
              <div className="mt-2 text-right">
                <span className="text-white/80 text-sm font-medium">
                  {Math.round(percentage)}%
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

