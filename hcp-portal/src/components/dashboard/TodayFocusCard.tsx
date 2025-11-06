'use client'

import React from 'react'
import { Calendar, Droplet, Footprints, Pill, Wind, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Appointment {
  id: string
  provider: string
  specialty: string
  date: string
  time: string
  status: string
  type: string
}

interface WellnessGoal {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  current: number
  target: number
  unit: string
  color: string
}

interface TodayFocusCardProps {
  appointments: Appointment[]
  wellnessGoals: WellnessGoal[]
}

export function TodayFocusCard({ appointments, wellnessGoals }: TodayFocusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 rounded-[24px] relative z-10" // Large soft radius
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-primary-500/10">
            <Calendar className="w-6 h-6 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Today's Focus
          </h2>
        </div>
        <Link
          href="/appointments"
          className="text-sm text-primary-500 hover:text-primary-400 flex items-center gap-1 font-medium"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming</h3>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-[20px] bg-white/50 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10 hover:border-primary-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">
                        {appointment.provider}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-success-500/20 text-success-400'
                          : 'bg-secondary-500/20 text-secondary-400'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-300 mb-2">
                      {appointment.specialty}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.date} • {appointment.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Daily Wellness Goals Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Wellness Goals</h3>
          <div className="grid grid-cols-2 gap-3">
            {wellnessGoals.map((goal, index) => {
              const Icon = goal.icon
              const percentage = Math.min((goal.current / goal.target) * 100, 100)
              const colorClasses = {
                blue: 'bg-blue-500',
                green: 'bg-success-500',
                purple: 'bg-purple-500',
                orange: 'bg-secondary-500',
              }

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-[20px] bg-white/50 dark:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-xl ${colorClasses[goal.color as keyof typeof colorClasses]}/10`}>
                      <Icon className={`w-4 h-4 ${colorClasses[goal.color as keyof typeof colorClasses]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {goal.label}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {goal.current} / {goal.target}
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
      </div>
    </motion.div>
  )
}

