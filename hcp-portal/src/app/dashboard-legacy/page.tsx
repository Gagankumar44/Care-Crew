'use client'

import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { GreetingSection } from '@/components/dashboard/GreetingSection'
import { HealthWidget } from '@/components/dashboard/HealthWidget'
import { ActionCard } from '@/components/dashboard/ActionCard'
import { HealthInsights } from '@/components/dashboard/HealthInsights'
import { WellnessWidget } from '@/components/dashboard/WellnessWidget'
import { ReportsPreview } from '@/components/dashboard/ReportsPreview'
import { 
  Heart, 
  Activity, 
  Thermometer, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Sparkles, 
  Stethoscope,
  TrendingUp,
  Clock,
  ArrowRight,
  Moon,
  Pill,
  TestTube,
  Target,
  Wallet,
  Radio
} from 'lucide-react'
import { mockAppointments, mockMessages } from '@/data/mockData'
import Link from 'next/link'
import { motion } from 'framer-motion'

/**
 * Legacy Dashboard Page
 * 
 * This route preserves the current/legacy dashboard UI unchanged.
 * Accessible at /dashboard-legacy
 */
export default function DashboardLegacyPage() {
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'upcoming' || a.status === 'confirmed').slice(0, 2)
  const recentMessages = mockMessages.slice(0, 3)
  const unreadCount = mockMessages.filter(m => m.unread).length

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Greeting Section */}
        <GreetingSection userName="Patient" />

        {/* Health Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthWidget
            title="Heart Rate"
            value={72}
            unit="bpm"
            icon={Heart}
            trend="down"
            trendValue="2%"
            color="red"
            delay={0}
            pulse={false}
          />
          <HealthWidget
            title="Activity"
            value={8.2}
            unit="k steps"
            icon={Activity}
            trend="up"
            trendValue="5%"
            color="green"
            delay={0.1}
            pulse={false}
          />
          <HealthWidget
            title="Body Temp"
            value={98.6}
            unit="°F"
            icon={Thermometer}
            trend={null}
            color="orange"
            delay={0.2}
            pulse={false}
          />
          <HealthWidget
            title="Sleep Quality"
            value={87}
            unit="%"
            icon={Moon}
            trend="up"
            trendValue="8%"
            color="blue"
            delay={0.3}
            pulse={false}
          />
        </div>

        {/* Quick Actions - Navigation Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="AR Scan"
              description="Scan skin or measure ROM"
              icon={Radio}
              href="/ar-scan"
              variant="teal"
              delay={0}
            />
            <ActionCard
              title="AI Triage"
              description="Get symptom analysis"
              icon={Stethoscope}
              href="/triage"
              variant="violet"
              delay={0.1}
            />
            <ActionCard
              title="Messages"
              description={`${unreadCount} unread messages`}
              icon={MessageSquare}
              href="/messages"
              variant="teal"
              delay={0.2}
            />
            <ActionCard
              title="Appointments"
              description={`${upcomingAppointments.length} upcoming`}
              icon={Calendar}
              href="/appointments"
              variant="violet"
              delay={0.3}
            />
          </div>
        </div>

        {/* Health Insights */}
        <HealthInsights />

        {/* Wellness & Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WellnessWidget />
          <ReportsPreview />
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
              Recent Activity
            </h2>
            <Link 
              href="/health-trends"
              className="text-sm text-primary dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
                    <Calendar className="w-5 h-5 text-primary dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {appointment.title}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}










