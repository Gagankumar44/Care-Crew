'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MessageSquare, 
  Calendar,
} from 'lucide-react'
import { ActionCard } from '@/components/dashboard/ActionCard'
import { ARScanIcon } from '@/components/icons/ARScanIcon'
import { AIAssistantIcon } from '@/components/icons/AIAssistantIcon'
import { WellnessWidget } from '@/components/dashboard/WellnessWidget'
import { ReportsPreview } from '@/components/dashboard/ReportsPreview'
import { TodaysFocusHero } from '@/components/dashboard/TodaysFocusHero'
import { mockAppointments, mockMessages } from '@/data/mockData'

/**
 * DashboardV2Content - V2 redesign dashboard content
 */
export function DashboardV2Content() {
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'upcoming' || a.status === 'confirmed').slice(0, 2)
  const recentMessages = mockMessages.slice(0, 3)
  const unreadCount = mockMessages.filter(m => m.unread).length

  // Check for appointments in the next hour
  const getAppointmentInNextHour = () => {
    const now = new Date()
    
    return upcomingAppointments.find(apt => {
      try {
        // Try to parse the appointment time
        const timeStr = apt.time.toLowerCase().replace(/\s/g, '')
        const [timePart, period] = timeStr.includes('am') || timeStr.includes('pm')
          ? [timeStr.slice(0, -2), timeStr.slice(-2)]
          : [timeStr, '']
        
        const [hours, minutes] = timePart.split(':').map(Number)
        let appointmentHour = hours
        
        if (period === 'pm' && hours !== 12) appointmentHour += 12
        if (period === 'am' && hours === 12) appointmentHour = 0
        
        const appointmentTime = new Date()
        appointmentTime.setHours(appointmentHour, minutes || 0, 0, 0)
        
        // Check if appointment is today and within next hour
        const aptDate = apt.date.toLowerCase()
        
        if (aptDate.includes('today') || aptDate.includes('tomorrow')) {
          // For simplicity, if it says "today" or "tomorrow", check if time is within next hour
          const timeDiff = appointmentTime.getTime() - now.getTime()
          return timeDiff > 0 && timeDiff <= 60 * 60 * 1000
        }
        
        return false
      } catch {
        return false
      }
    })
  }

  const upcomingAppointment = getAppointmentInNextHour()

  return (
    <div className="space-y-6">
      {/* Today's Focus Hero - Full Width */}
      <div className="w-full">
        <TodaysFocusHero
          userName="Patient"
          heartRate={72}
          sleepQuality={81}
          nextFocus="Medication"
        />
      </div>

      {/* Appointment Starting Soon Alert */}
      {upcomingAppointment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 border-2 border-white/20 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Your appointment is starting soon! 🎯
                </h2>
              </div>
              <p className="text-white/90 text-lg mb-2">
                <span className="font-semibold">{upcomingAppointment.provider}</span> • {upcomingAppointment.specialty}
              </p>
              <p className="text-white/80">
                {upcomingAppointment.date} • {upcomingAppointment.time}
              </p>
            </div>
            {upcomingAppointment.type === 'virtual' && (
              <Link
                href={`/appointments/${upcomingAppointment.id}`}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
              >
                Join Call →
              </Link>
            )}
          </div>
        </motion.div>
      )}

      {/* Smart Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Always show AR Scan as hero action */}
          <ActionCard
            title="AR Scan"
            description="Scan skin or measure ROM"
            icon={ARScanIcon}
            href="/ar-scan"
            gradient="accent"
            delay={0}
            size="large"
          />
          
          {/* Always show AI Assistant as hero action */}
          <ActionCard
            title="AI Assistant"
            description="Get health insights"
            icon={AIAssistantIcon}
            href="/assistant"
            gradient="warning"
            delay={0.1}
            size="large"
          />
          
          {/* Dynamic: Show upcoming appointment action if available */}
          {upcomingAppointments.length > 0 && upcomingAppointments[0] && (
            <ActionCard
              title={`Join Your ${upcomingAppointments[0].time} Call`}
              description={`${upcomingAppointments[0].provider} • ${upcomingAppointments[0].date}`}
              icon={Calendar}
              href={`/appointments/${upcomingAppointments[0].id}`}
              gradient="health"
              delay={0.2}
            />
          )}
          
          {/* Dynamic: Show messages action if there are unread messages */}
          {unreadCount > 0 && (
            <ActionCard
              title={`Review ${unreadCount} New Message${unreadCount > 1 ? 's' : ''}`}
              description={recentMessages[0]?.unread ? `From ${recentMessages[0].from}` : "Check your messages"}
              icon={MessageSquare}
              href="/messages"
              gradient="primary"
              delay={0.3}
            />
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-800/50 backdrop-blur-xl rounded-xl p-6 border border-neutral-700"
            role="region"
            aria-label="Upcoming Appointments"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upcoming Appointments</h3>
              <Link 
                href="/appointments" 
                className="text-sm text-teal-400 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2 rounded"
                aria-label="View all appointments"
              >
                View All →
              </Link>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3" role="list">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 rounded-lg bg-neutral-700/50 border border-neutral-600"
                    role="listitem"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{appointment.provider}</h4>
                        <p className="text-sm text-neutral-400">{appointment.specialty}</p>
                        <p className="text-sm text-neutral-500 mt-1">
                          {appointment.date} • {appointment.time}
                        </p>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-orange-500/20 text-orange-400'
                        }`}
                        aria-label={`Status: ${appointment.status}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500" role="status">
                No upcoming appointments
              </div>
            )}
          </motion.div>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-800/50 backdrop-blur-xl rounded-xl p-6 border border-neutral-700"
            role="region"
            aria-label="Recent Messages"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Messages</h3>
              <Link 
                href="/messages" 
                className="text-sm text-teal-400 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2 rounded"
                aria-label="View all messages"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3" role="list">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${
                    message.unread 
                      ? 'bg-teal-500/10 border-teal-500/20' 
                      : 'bg-neutral-700/50 border-neutral-600'
                  }`}
                  role="listitem"
                  aria-label={message.unread ? `Unread message from ${message.from}` : `Message from ${message.from}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.unread ? 'bg-teal-500/20' : 'bg-neutral-600'
                    }`} aria-hidden="true">
                      <MessageSquare className={`w-5 h-5 ${
                        message.unread ? 'text-teal-400' : 'text-neutral-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium text-sm ${message.unread ? 'text-white' : 'text-neutral-300'}`}>
                          {message.from}
                        </p>
                        <time className="text-xs text-neutral-500" dateTime={message.time}>
                          {message.time}
                        </time>
                      </div>
                      <p className="text-sm text-neutral-400 truncate">{message.preview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <WellnessWidget />
          <ReportsPreview />
        </div>
      </div>
    </div>
  )
}
