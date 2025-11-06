'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useThemeV2Context } from '@/components/ThemeV2Provider'
import { PageLayout } from '@/components/PageLayout'
import { AppLayoutV2 } from '@/layouts/AppLayoutV2'
import { TodaysFocusHero } from '@/components/dashboard/TodaysFocusHero'
import { ActionCard } from '@/components/dashboard/ActionCard'
import { ARScanIcon } from '@/components/icons/ARScanIcon'
import { AIAssistantIcon } from '@/components/icons/AIAssistantIcon'
import { BlobShapes } from '@/components/dashboard/BlobShapes'
import { TodayFocusCard } from '@/components/dashboard/TodayFocusCard'
import { HealthInsights } from '@/components/dashboard/HealthInsights'
import { ReportsPreview } from '@/components/dashboard/ReportsPreview'
import { DashboardGrid } from '@/components/DashboardGrid'
import { MetricCard } from '@/components/MetricCard'
import TodayFocus from '@/components/dashboard/TodayFocus'
import SmartActions from '@/components/dashboard/SmartActions'
import { DailyWellness } from '@/components/dashboard/DailyWellness'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { HealthTip } from '@/components/dashboard/HealthTip'
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
  Radio,
  Droplet,
  Footprints,
  Wind
} from 'lucide-react'
import { mockAppointments, mockMessages } from '@/data/mockData'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getTimeBasedGreeting } from '@/utils/timeGreeting'

/**
 * DashboardV2Content - V2 redesign dashboard content
 */
function DashboardV2Content({
  upcomingAppointments,
  recentMessages,
  unreadCount,
}: {
  upcomingAppointments: typeof mockAppointments
  recentMessages: typeof mockMessages
  unreadCount: number
}) {
  // Get greeting based on time of day
  const greetingData = getTimeBasedGreeting('Glav!on')
  const greeting = greetingData.message
  const subtext = greetingData.subtext
  
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
        const today = new Date()
        today.setHours(0, 0, 0, 0)
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

  const metrics = [
    { title: 'Heart Rate', value: '72 bpm', trend: -2, icon: <Heart size={24} />, variant: 'danger' as const },
    { title: 'Activity', value: '8.2k steps', trend: 5, icon: <Activity size={24} />, variant: 'success' as const },
    { title: 'Body Temp', value: '98.6°F', icon: <Thermometer size={24} />, variant: 'default' as const },
    { title: 'Sleep Quality', value: '87%', trend: 8, icon: <Moon size={24} />, variant: 'primary' as const },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{greeting}</h1>
        <p className="text-neutral-400">{subtext}</p>
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

      {/* Metrics Grid - COMMENTED OUT FOR NEW DESIGN */}
      {/* <DashboardGrid metrics={metrics} /> */}

      {/* Smart Quick Actions - COMMENTED OUT FOR NEW DESIGN */}
      {/* <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            title="AR Scan"
            description="Scan skin or measure ROM"
            icon={ARScanIcon}
            href="/ar-scan"
            gradient="accent"
            delay={0}
            size="large"
          />
          <ActionCard
            title="AI Assistant"
            description="Get health insights"
            icon={AIAssistantIcon}
            href="/assistant"
            gradient="warning"
            delay={0.1}
            size="large"
          />
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
      </div> */}
      
      {/* NEW COMPONENTS - Content Area */}
      <div className="content-area">
        <TodayFocus userName="Glav!on" heartRate={72} sleep="81%" />
        <QuickStats />
        <SmartActions unreadMessages={unreadCount} upcomingAppointments={upcomingAppointments.length} />
        <DailyWellness />
        <HealthTip />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-800/50 backdrop-blur-xl rounded-xl p-6 border border-neutral-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upcoming Appointments</h3>
              <Link href="/appointments" className="text-sm text-teal-400 hover:text-teal-300">
                View All →
              </Link>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 rounded-lg bg-neutral-700/50 border border-neutral-600"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{appointment.provider}</h4>
                        <p className="text-sm text-neutral-400">{appointment.specialty}</p>
                        <p className="text-sm text-neutral-500 mt-1">
                          {appointment.date} • {appointment.time}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No upcoming appointments
              </div>
            )}
          </motion.div>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-800/50 backdrop-blur-xl rounded-xl p-6 border border-neutral-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Messages</h3>
              <Link href="/messages" className="text-sm text-teal-400 hover:text-teal-300">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${
                    message.unread 
                      ? 'bg-teal-500/10 border-teal-500/20' 
                      : 'bg-neutral-700/50 border-neutral-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.unread ? 'bg-teal-500/20' : 'bg-neutral-600'
                    }`}>
                      <MessageSquare className={`w-5 h-5 ${
                        message.unread ? 'text-teal-400' : 'text-neutral-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium text-sm ${message.unread ? 'text-white' : 'text-neutral-300'}`}>
                          {message.from}
                        </p>
                        <span className="text-xs text-neutral-500">{message.time}</span>
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

export default function DashboardPage() {
  const { isThemeV2 } = useThemeV2Context()
  const router = useRouter()
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'upcoming' || a.status === 'confirmed').slice(0, 2)
  const recentMessages = mockMessages.slice(0, 3)
  const unreadCount = mockMessages.filter(m => m.unread).length

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check if Clerk is configured
      const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      
      if (clerkKey) {
        // If Clerk is configured, Clerk middleware will handle auth
        // We don't need to check here
        return
      }
      
      // If Clerk is not configured, check localStorage
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      if (isAuthenticated !== 'true') {
        console.log('❌ User not authenticated, redirecting to login...')
        router.push('/auth/login')
        // Use setTimeout to ensure navigation happens
        setTimeout(() => {
          if (window.location.pathname === '/dashboard') {
            window.location.href = '/auth/login'
          }
        }, 100)
      }
    }
    
    checkAuth()
  }, [router])

  // Render V2 layout if theme v2 is enabled
  if (isThemeV2) {
    return (
      <AppLayoutV2>
        <DashboardV2Content 
          upcomingAppointments={upcomingAppointments}
          recentMessages={recentMessages}
          unreadCount={unreadCount}
        />
      </AppLayoutV2>
    )
  }

  // Legacy layout
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Today's Focus Hero - COMMENTED OUT FOR NEW DESIGN */}
        {/* <div className="w-full">
          <TodaysFocusHero
            userName="Patient"
            heartRate={72}
            sleepQuality={81}
            nextFocus="Medication"
          />
        </div> */}

        {/* Quick Actions - Navigation Cards - COMMENTED OUT FOR NEW DESIGN */}
        {/* <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="AR Scan"
              description="Scan skin or measure ROM"
              icon={ARScanIcon}
              href="/ar-scan"
              gradient="accent"
            delay={0}
            size="large"
          />
            <ActionCard
              title="Messages"
              description={`${unreadCount} unread messages`}
              icon={MessageSquare}
              href="/messages"
              gradient="primary"
              delay={0.1}
              layoutId="messages-card"
            />
            <ActionCard
              title="Appointments"
              description="Manage your visits"
              icon={Calendar}
              href="/appointments"
              gradient="health"
              delay={0.2}
            />
            <ActionCard
              title="AI Assistant"
              description="Get health insights"
              icon={AIAssistantIcon}
              href="/assistant"
              gradient="warning"
              delay={0.3}
            />
          </div>
        </div> */}

        {/* New Features Section - COMMENTED OUT FOR NEW DESIGN */}
        {/* <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
            New Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="E-Prescriptions"
              description="View prescriptions & order medicines"
              icon={Pill}
              href="/prescriptions"
              gradient="primary"
              delay={0.8}
            />
            <ActionCard
              title="Lab Tests"
              description="Book tests & view results"
              icon={TestTube}
              href="/lab-tests"
              gradient="health"
              delay={0.9}
            />
            <ActionCard
              title="Health Programs"
              description="AI-guided care plans"
              icon={Target}
              href="/health-programs"
              gradient="accent"
              delay={1.0}
            />
            <ActionCard
              title="Health Wallet"
              description="Secure health records vault"
              icon={Wallet}
              href="/health-wallet"
              gradient="warning"
              delay={1.1}
            />
          </div>
        </div> */}

        {/* Healthcare Services - COMMENTED OUT FOR NEW DESIGN */}
        {/* <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
            Healthcare Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="Hospitals"
              description="Find hospitals near you"
              icon={Stethoscope}
              href="/hospitals"
              gradient="primary"
              delay={0.4}
            />
            <ActionCard
              title="Doctors"
              description="Browse doctor profiles"
              icon={Stethoscope}
              href="/doctors"
              gradient="health"
              delay={0.5}
            />
            <ActionCard
              title="Symptom Check"
              description="AI-powered triage"
              icon={Activity}
              href="/triage"
              gradient="accent"
              delay={0.6}
            />
            <ActionCard
              title="Surgery Costs"
              description="Cost estimates"
              icon={TrendingUp}
              href="/surgery-costs"
              gradient="warning"
              delay={0.7}
            />
          </div>
        </div> */}
        
        {/* NEW COMPONENTS - Content Area */}
        <div className="content-area">
          <TodayFocus userName="Glav!on" heartRate={72} sleep="81%" />
          <QuickStats />
          <SmartActions unreadMessages={unreadCount} upcomingAppointments={upcomingAppointments.length} />
          <DailyWellness />
          <HealthTip />
        </div>

        {/* Background Blob Shapes */}
        <BlobShapes />

        {/* Main Content - Restructured Layout */}
        <div className="space-y-6 relative z-10">
          {/* Combined Today's Focus Card - Wider */}
          <TodayFocusCard 
            appointments={upcomingAppointments}
            wellnessGoals={[
              { id: 'water', label: 'Water', icon: Droplet, current: 6, target: 8, unit: 'glasses', color: 'blue' },
              { id: 'steps', label: 'Steps', icon: Footprints, current: 7240, target: 10000, unit: 'steps', color: 'green' },
              { id: 'medication', label: 'Medication', icon: Pill, current: 2, target: 3, unit: 'doses', color: 'purple' },
              { id: 'breathing', label: 'Breathing', icon: Wind, current: 1, target: 2, unit: 'sessions', color: 'orange' },
            ]}
          />

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6 rounded-[24px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-white font-heading">
                  Recent Messages
                </h2>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-xs font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <Link
                href="/messages"
                className="text-sm text-primary-500 hover:text-primary-400 flex items-center gap-1 font-medium"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-[20px] bg-white/50 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10 hover:border-primary-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.unread ? 'bg-primary-500/10' : 'bg-neutral-100 dark:bg-neutral-700'
                    }`}>
                      <MessageSquare className={`w-5 h-5 ${
                        message.unread ? 'text-primary-500' : 'text-neutral-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-white">
                          {message.from}
                        </p>
                        <span className="text-xs flex items-center gap-1 text-neutral-400">
                          <Clock className="w-3 h-3" />
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm truncate text-neutral-300">
                        {message.preview}
                      </p>
                      {message.unread && (
                        <div className="mt-2 w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Health Insights - MUCH LARGER - Star of the Show */}
          <div className="lg:col-span-full">
            <HealthInsights />
          </div>

          {/* Right Column - Reports and Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Reports Preview */}
            <div className="lg:col-span-1">
              <ReportsPreview />
            </div>

            {/* Quick Navigation Links */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card p-6 rounded-[24px]"
              >
                <h2 className="text-xl font-semibold mb-4 text-white font-heading">
                  Quick Navigation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Link
                    href="/health-trends"
                    className="flex items-center justify-between p-3 rounded-[16px] hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-medium text-white">Health Trends</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:text-primary-500 transition-colors text-neutral-400" />
                  </Link>
                  <Link
                    href="/doctors"
                    className="flex items-center justify-between p-3 rounded-[16px] hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-medium text-white">Doctors</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:text-primary-500 transition-colors text-neutral-400" />
                  </Link>
                  <Link
                    href="/reports"
                    className="flex items-center justify-between p-3 rounded-[16px] hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-medium text-white">Reports & Scans</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:text-primary-500 transition-colors text-neutral-400" />
                  </Link>
                  <Link
                    href="/ai-nurse-monitoring"
                    className="flex items-center justify-between p-3 rounded-[16px] hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Radio className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-medium text-white">AI-Nurse Monitoring</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:text-primary-500 transition-colors text-neutral-400" />
                  </Link>
                  <Link
                    href="/triage"
                    className="flex items-center justify-between p-3 rounded-[16px] hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-medium text-white">Triage</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:text-primary-500 transition-colors text-neutral-400" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
