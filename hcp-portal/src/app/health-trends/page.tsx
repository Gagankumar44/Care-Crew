'use client'

import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Heart, Moon, Wind } from 'lucide-react'

const heartRateData = [
  { name: 'Mon', value: 72 },
  { name: 'Tue', value: 75 },
  { name: 'Wed', value: 70 },
  { name: 'Thu', value: 73 },
  { name: 'Fri', value: 71 },
  { name: 'Sat', value: 74 },
  { name: 'Sun', value: 72 },
]

const sleepData = [
  { name: 'Mon', value: 85 },
  { name: 'Tue', value: 80 },
  { name: 'Wed', value: 90 },
  { name: 'Thu', value: 88 },
  { name: 'Fri', value: 82 },
  { name: 'Sat', value: 92 },
  { name: 'Sun', value: 87 },
]

const stressData = [
  { name: 'Mon', value: 3.5 },
  { name: 'Tue', value: 4.0 },
  { name: 'Wed', value: 3.2 },
  { name: 'Thu', value: 3.8 },
  { name: 'Fri', value: 4.2 },
  { name: 'Sat', value: 2.5 },
  { name: 'Sun', value: 3.0 },
]

export default function HealthTrendsPage() {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Health Trends
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Track your health metrics over time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heart Rate Trend */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Heart Rate Trend
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="value" stroke="#0A84FF" strokeWidth={2} dot={{ fill: '#0A84FF' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep Quality Trend */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sleep Quality Trend
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="value" stroke="#0A84FF" fill="#0A84FF" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stress Trend */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Wind className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Stress Level Trend
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="value" stroke="#34C759" strokeWidth={2} dot={{ fill: '#34C759' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

