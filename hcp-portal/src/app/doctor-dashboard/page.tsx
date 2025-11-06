'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock,
  Video,
  Phone,
  MessageSquare,
  Star,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Safely use Clerk auth, handling cases where Clerk is not configured
function useSafeAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    
    if (!clerkKey) {
      setIsLoaded(true)
      return
    }

    // Check if Clerk is available by trying to access it
    const checkClerk = async () => {
      try {
        // Check if ClerkProvider exists in the component tree
        if (typeof window !== 'undefined') {
          // Check if Clerk context exists
          const clerkInstance = (window as any).__clerkFrontendApi
          if (clerkInstance) {
            // Clerk is available, use a demo userId for development
            setUserId('demo-doctor-id')
          }
        }
        setIsLoaded(true)
      } catch (error) {
        // Clerk not available, continue without auth
        setIsLoaded(true)
      }
    }

    checkClerk()
  }, [])

  return { userId, isLoaded }
}

export default function DoctorDashboardPage() {
  const { userId } = useSafeAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    completed: 0,
    pending: 0,
  })

  useEffect(() => {
    fetchDoctorData()
  }, [userId])

  const fetchDoctorData = async () => {
    try {
      setLoading(true)
      // In real app, fetch appointments and patient records
      // Mock data for now
      setAppointments([
        {
          id: '1',
          patientName: 'John Doe',
          scheduledAt: new Date().toISOString(),
          type: 'virtual',
          status: 'scheduled',
          reason: 'Follow-up consultation',
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          scheduledAt: new Date(Date.now() + 3600000).toISOString(),
          type: 'in_person',
          status: 'confirmed',
          reason: 'General checkup',
        },
      ])
      setStats({
        totalAppointments: 45,
        todayAppointments: 8,
        completed: 120,
        pending: 12,
      })
    } catch (error) {
      console.error('Error fetching doctor data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Doctor Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage appointments, patient records, and your practice
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <Calendar className="w-8 h-8 text-primary mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalAppointments}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Appointments</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <Clock className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.todayAppointments}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Today</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <MessageSquare className="w-8 h-8 text-purple-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/appointments/new">
              <div className="glass-card p-6 hover:shadow-glass-lg transition-all cursor-pointer">
                <Calendar className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">New Appointment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Schedule a new appointment with a patient
                </p>
              </div>
            </Link>
            <Link href="/prescriptions">
              <div className="glass-card p-6 hover:shadow-glass-lg transition-all cursor-pointer">
                <FileText className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prescriptions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and manage patient prescriptions
                </p>
              </div>
            </Link>
            <Link href="/messages">
              <div className="glass-card p-6 hover:shadow-glass-lg transition-all cursor-pointer">
                <MessageSquare className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Messages</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Communicate with patients securely
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Upcoming Appointments */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Appointments</h2>
          
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Patient</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date & Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Reason</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {appointment.patientName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 dark:text-gray-400">
                          {new Date(appointment.scheduledAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.type === 'virtual' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {appointment.type === 'virtual' ? 'Virtual' : 'In-Person'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 dark:text-gray-400">
                          {appointment.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {appointment.type === 'virtual' && (
                            <button className="text-blue-600 hover:text-blue-700">
                              <Video className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-primary hover:text-primary-600">
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Profile Settings */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h2>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Update Specialization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your specialization and availability
                </p>
              </div>
              <Link href="/profile">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
