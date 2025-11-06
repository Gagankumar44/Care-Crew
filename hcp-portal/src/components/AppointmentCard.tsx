'use client'

import React from 'react'
import { Calendar, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Appointment {
  id?: string
  department?: string
  doctor?: string
  provider?: string
  specialty?: string
  time: string
  type: string
  date?: string
  location?: string
  status?: string
  reason?: string
}

interface AppointmentCardProps {
  appointment: Appointment
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const router = useRouter()
  
  // Support both old and new data structures
  const appt = {
    department: appointment.department || appointment.specialty || '',
    doctor: appointment.doctor || appointment.provider || '',
    time: appointment.time || '',
    type: appointment.type || 'virtual',
  }

  // Format time display - combine date and time if date exists
  const displayTime = appointment.date 
    ? `${appointment.date}, ${appt.time}`.replace(/^, /, '').replace(/,\s*$/, '')
    : appt.time

  const handleSymptomCheck = () => {
    // Navigate to triage page and pass appointment context
    const params = new URLSearchParams()
    if (appointment.id) params.set('appointmentId', appointment.id)
    if (appt.department) params.set('specialty', appt.department)
    if (appt.doctor) params.set('provider', appt.doctor)
    if (appointment.reason) params.set('reason', appointment.reason)
    
    router.push(`/triage?${params.toString()}`)
  }

  const handleViewDetails = () => {
    // Navigate to appointment details or show a modal
    // For now, just log or could navigate to a details page
    console.log('View details for appointment:', appointment)
    // Could implement a modal or navigate to details page
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-primary font-semibold text-lg">{appt.department}</div>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">with {appt.doctor}</div>
          <div className="mt-2 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <Calendar size={16} />
            <span>{displayTime}</span>
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              <Video size={14} /> {appt.type === 'virtual' ? 'Virtual' : appt.type.charAt(0).toUpperCase() + appt.type.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button 
            onClick={handleSymptomCheck}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium shadow-sm"
            aria-label="Start symptom check"
          >
            Start Symptom Check
          </button>
          <button 
            onClick={handleViewDetails}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium"
            aria-label="View appointment details"
          >
            Details
          </button>
        </div>
      </div>
    </motion.div>
  )
}

