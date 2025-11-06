'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Plane, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Phone,
  User,
  Building2,
  Send,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useSafeAuth } from '@/hooks/useSafeAuth'
import { getHospitals } from '@/lib/api/hospital-registry'

export default function AirAmbulanceRequestPage() {
  const { userId } = useSafeAuth()
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    condition: '',
    urgency: 'medium',
    sourceCity: '',
    sourceState: '',
    destinationCity: '',
    destinationState: '',
    destinationHospital: '',
    contactPhone: '',
    contactEmail: '',
    additionalInfo: '',
  })
  const [hospitals, setHospitals] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [requested, setRequested] = useState(false)

  useEffect(() => {
    fetchHospitals()
  }, [])

  const fetchHospitals = async () => {
    try {
      const data = await getHospitals({})
      setHospitals(data.filter(h => h.air_ambulance_available))
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      alert('Please login to request air ambulance')
      return
    }

    try {
      setSubmitting(true)
      // In real app, submit air ambulance request to API
      // await createAirAmbulanceRequest({ ...formData, userId })
      
      alert('Air ambulance request submitted successfully! Our team will contact you shortly.')
      setRequested(true)
      setFormData({
        patientName: '',
        patientAge: '',
        condition: '',
        urgency: 'medium',
        sourceCity: '',
        sourceState: '',
        destinationCity: '',
        destinationState: '',
        destinationHospital: '',
        contactPhone: '',
        contactEmail: '',
        additionalInfo: '',
      })
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Failed to submit request. Please try again or call emergency services.')
    } finally {
      setSubmitting(false)
    }
  }

  if (requested) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="glass-card p-12 text-center max-w-md">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Request Submitted Successfully
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our air ambulance team will contact you shortly to coordinate the mission.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setRequested(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
              >
                New Request
              </button>
            </div>
          </div>
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
            <Plane className="w-8 h-8 text-primary" />
            Request Air Ambulance
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Emergency air transport service for critical medical situations
          </p>
        </div>

        {/* Emergency Alert */}
        <div className="glass-card p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800 dark:text-red-300">
              <strong>Emergency:</strong> For immediate life-threatening emergencies, call 108 (Emergency Services) or your local emergency number immediately.
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          {/* Patient Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient Age *
                </label>
                <input
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medical Condition *
                </label>
                <textarea
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Describe the patient's medical condition..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Urgency Level *
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                >
                  <option value="critical">Critical - Immediate</option>
                  <option value="high">High - Within 2 hours</option>
                  <option value="medium">Medium - Within 6 hours</option>
                  <option value="low">Low - Scheduled</option>
                </select>
              </div>
            </div>
          </section>

          {/* Location Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source City *
                </label>
                <input
                  type="text"
                  name="sourceCity"
                  value={formData.sourceCity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source State *
                </label>
                <input
                  type="text"
                  name="sourceState"
                  value={formData.sourceState}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination City *
                </label>
                <input
                  type="text"
                  name="destinationCity"
                  value={formData.destinationCity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination State *
                </label>
                <input
                  type="text"
                  name="destinationState"
                  value={formData.destinationState}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination Hospital
                </label>
                <select
                  name="destinationHospital"
                  value={formData.destinationHospital}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select Hospital (Optional)</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.city}, {hospital.state_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Any additional information that might be helpful..."
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Average response time: 15-30 minutes</span>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

