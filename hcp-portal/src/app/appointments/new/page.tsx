'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Calendar, Clock, Video, MapPin, ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NewAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    provider: '',
    type: 'virtual',
    date: '',
    time: '',
    reason: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const providers = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', available: true },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Dermatology', available: true },
    { id: '3', name: 'Dr. Emily Davis', specialty: 'General Medicine', available: true },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Get selected provider details
      const selectedProvider = providers.find(p => p.id === formData.provider)
      
      // Format date for display
      const dateObj = new Date(formData.date)
      const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      
      // Create appointment object with both formatted and raw date
      const newAppointment = {
        id: `apt-${Date.now()}`,
        provider: selectedProvider?.name || 'Unknown Provider',
        specialty: selectedProvider?.specialty || 'General',
        date: formattedDate, // Display date
        rawDate: formData.date, // Raw date for sorting/comparison
        time: formData.time,
        location: formData.type === 'in-person' ? 'Medical Center' : 'Virtual',
        type: formData.type === 'virtual' ? 'virtual' : 'in-person',
        status: 'confirmed' as const,
        reason: formData.reason,
        createdAt: new Date().toISOString(),
      }
      
      // Save to localStorage
      const existingAppointments = JSON.parse(
        localStorage.getItem('appointments') || '[]'
      )
      existingAppointments.unshift(newAppointment) // Add to beginning
      localStorage.setItem('appointments', JSON.stringify(existingAppointments))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSubmitting(false)
      setSubmitted(true)
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push('/appointments')
      }, 3000)
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      setIsSubmitting(false)
      alert('Failed to schedule appointment. Please try again.')
    }
  }

  if (submitted) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-glass p-12 text-center border-2 border-neutral-200 dark:border-neutral-700"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Appointment Scheduled!</h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">Your appointment has been successfully scheduled.</p>
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">You will be redirected to your appointments shortly...</p>
              <button
                onClick={() => router.push('/appointments')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-semibold"
              >
                View My Appointments
              </button>
            </div>
          </motion.div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Schedule New Appointment</h1>
          <p className="text-neutral-700 dark:text-neutral-300">Book your next medical appointment</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-800 rounded-xl shadow-glass p-6 md:p-8 space-y-6"
        >
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Select Provider
            </label>
            <div className="space-y-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, provider: provider.id })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.provider === provider.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                      : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="font-semibold text-neutral-900 dark:text-white">{provider.name}</div>
                  <div className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">{provider.specialty}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Appointment Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'virtual' })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.type === 'virtual'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                    : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <Video className={`w-6 h-6 mb-2 ${formData.type === 'virtual' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400'}`} />
                <div className="font-semibold text-neutral-900 dark:text-white">Virtual</div>
                <div className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">Video consultation</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'in-person' })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.type === 'in-person'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                    : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <MapPin className={`w-6 h-6 mb-2 ${formData.type === 'in-person' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400'}`} />
                <div className="font-semibold text-neutral-900 dark:text-white">In-Person</div>
                <div className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">Office visit</div>
              </button>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                <Calendar className="w-4 h-4 inline mr-2 text-neutral-700 dark:text-neutral-300" />
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                <Clock className="w-4 h-4 inline mr-2 text-neutral-700 dark:text-neutral-300" />
                Time
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Reason for Visit
            </label>
            <textarea
              rows={4}
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Describe your symptoms or reason for the appointment..."
              className="w-full px-4 py-3 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium text-neutral-900 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.provider || !formData.date || !formData.time || !formData.reason}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 font-semibold shadow-sm"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </motion.form>
      </div>
    </PageLayout>
  )
}

