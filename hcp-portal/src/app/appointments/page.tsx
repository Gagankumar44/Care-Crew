'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { AppointmentCard } from '@/components/AppointmentCard'
import { Plus, Calendar, Clock, Filter, Search, Video, MapPin } from 'lucide-react'
import { mockAppointments, type Appointment } from '@/data/mockData'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

type TabType = 'upcoming' | 'past' | 'new'
type FilterType = 'all' | 'virtual' | 'in-person'

export default function AppointmentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('upcoming')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Load appointments from localStorage on mount and when page gains focus
  const loadAppointments = () => {
    const savedAppointments = JSON.parse(
      localStorage.getItem('appointments') || '[]'
    )
    // Merge saved appointments with mock data (avoid duplicates)
    const allAppointments = [...savedAppointments, ...mockAppointments]
    // Remove duplicates based on ID
    const uniqueAppointments = allAppointments.filter((appt, index, self) =>
      index === self.findIndex(a => a.id === appt.id)
    )
    setAppointments(uniqueAppointments)
  }

  useEffect(() => {
    loadAppointments()
    
    // Reload when page becomes visible (user comes back from booking)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadAppointments()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Helper function to check if appointment is upcoming
  const isAppointmentUpcoming = (apt: Appointment & { rawDate?: string }): boolean => {
    try {
      // Use rawDate if available (from saved appointments), otherwise parse formatted date
      const dateString = (apt as any).rawDate || apt.date
      const appointmentDate = new Date(dateString)
      if (isNaN(appointmentDate.getTime())) return true
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      appointmentDate.setHours(0, 0, 0, 0)
      return appointmentDate >= today
    } catch {
      return true
    }
  }

  const tabs = [
    { 
      id: 'upcoming' as TabType, 
      label: 'Upcoming', 
      count: appointments.filter(isAppointmentUpcoming).length 
    },
    { 
      id: 'past' as TabType, 
      label: 'Past', 
      count: appointments.filter(a => !isAppointmentUpcoming(a)).length 
    },
    { id: 'new' as TabType, label: 'New Appointment', count: null },
  ]

  const filteredAppointments = appointments.filter(apt => {
    // Check if appointment is upcoming or past based on date
    // Handle different date formats - use rawDate if available
    let appointmentDate: Date
    try {
      const dateString = (apt as any).rawDate || apt.date
      appointmentDate = new Date(dateString)
      // If date is invalid, assume it's upcoming
      if (isNaN(appointmentDate.getTime())) {
        appointmentDate = new Date()
      }
    } catch {
      appointmentDate = new Date()
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    appointmentDate.setHours(0, 0, 0, 0)
    
    const isUpcoming = appointmentDate >= today
    
    const matchesTab = activeTab === 'upcoming' 
      ? isUpcoming 
      : activeTab === 'past' 
        ? !isUpcoming 
        : false
    const matchesFilter = filterType === 'all' || apt.type === filterType
    const matchesSearch = searchQuery === '' || 
      apt.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesFilter && matchesSearch
  })

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Appointments</h1>
            <p className="text-neutral-600 dark:text-neutral-400">Manage your medical appointments</p>
          </div>
          <Link
            href="/appointments/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus size={20} />
            <span>New Appointment</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-0.5 bg-neutral-100 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* New Appointment Form */}
        {activeTab === 'new' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Schedule New Appointment</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider / Department
                  </label>
                  <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Cardiology - Dr. Sarah Johnson</option>
                    <option>Dermatology - Dr. Michael Chen</option>
                    <option>General Medicine - Dr. Emily Davis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type
                  </label>
                  <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Virtual Consultation</option>
                    <option>In-Person Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your symptoms or reason for the appointment..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Schedule Appointment
                </button>
                <button
                  type="button"
                  className="px-6 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Appointments List */}
        {activeTab !== 'new' && (
          <>
            {/* Filters and Search */}
            <div className="glass-card p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-neutral-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="virtual">Virtual</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments Grid */}
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="glass-card p-12 text-center">
                  <Calendar className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 text-lg">No appointments found</p>
                  <p className="text-neutral-400 text-sm mt-2">
                    {searchQuery ? 'Try adjusting your search' : 'Schedule your first appointment'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}

