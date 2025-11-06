'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Sparkles, Brain, Building2, Star, MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { mockHospitals, mockDoctors } from '@/data/mockData'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TriageReferralPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [specialty, setSpecialty] = useState<string>('')
  const [location, setLocation] = useState<string>('')

  // Initialize from URL params if coming from triage
  useEffect(() => {
    const specialtyParam = searchParams.get('specialty')
    if (specialtyParam) {
      setSpecialty(decodeURIComponent(specialtyParam))
    }
  }, [searchParams])

  // Simulate AI triage recommendation
  const getRecommendedHospitals = () => {
    let filtered = [...mockHospitals]
    
    if (specialty) {
      filtered = filtered.filter(h => h.specialties.some(s => 
        s.toLowerCase().includes(specialty.toLowerCase())
      ))
    }
    
    if (location) {
      filtered = filtered.filter(h => 
        h.state.toLowerCase().includes(location.toLowerCase()) ||
        h.city.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    // Sort by rating
    return filtered.sort((a, b) => b.rating - a.rating).slice(0, 5)
  }

  const recommendedHospitals = getRecommendedHospitals()

  // Get relevant doctors for the specialty
  const getRecommendedDoctors = () => {
    if (!specialty) return []
    return mockDoctors
      .filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
  }

  const recommendedDoctors = getRecommendedDoctors()

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Premium Badge */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-sm font-medium rounded-full">
            Premium Feature
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Hospital Referral
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Get personalized hospital recommendations based on your needs
          </p>
        </div>

        {/* Triage Form */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tell us what you need
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialty / Condition
              </label>
              <input
                type="text"
                placeholder="e.g., Cardiology, Neurology, Orthopedics..."
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location Preference (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Delhi, Mumbai, Bangalore..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="pt-2">
              <Link
                href="/triage"
                className="text-sm text-primary hover:text-primary-600"
              >
                Complete AI Triage assessment for better recommendations →
              </Link>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {(specialty || location) && (
          <>
            {/* Recommended Hospitals */}
            {recommendedHospitals.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Top Hospitals for {specialty || 'Your Needs'}
                  </h2>
                </div>
                <div className="space-y-4">
                  {recommendedHospitals.map((hospital, idx) => (
                    <motion.div
                      key={hospital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card p-6 hover:shadow-glass-lg transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <Building2 className="w-6 h-6 text-primary mt-1" />
                            <div className="flex-1">
                              <Link href={`/hospitals/${hospital.id}`}>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors">
                                  {hospital.name}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{hospital.city}, {hospital.state}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-medium">{hospital.rating}</span>
                              <span className="text-sm text-neutral-500">({hospital.reviewCount} reviews)</span>
                            </div>
                            {hospital.emergencyAvailable && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-xs">
                                24/7 Emergency
                              </span>
                            )}
                          </div>
                          <div className="mt-3">
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Specialties Available:</div>
                            <div className="flex flex-wrap gap-2">
                              {hospital.specialties.slice(0, 5).map(s => (
                                <span key={s} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/hospitals/${hospital.id}`}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-center text-sm"
                          >
                            View Details
                          </Link>
                          <Link
                            href={`/appointments/new?hospital=${hospital.id}`}
                            className="px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-center text-sm"
                          >
                            Book Appointment
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Doctors */}
            {recommendedDoctors.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Top Doctors for {specialty}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedDoctors.map((doctor) => (
                    <Link
                      key={doctor.id}
                      href={`/doctors/${doctor.id}`}
                      className="glass-card p-4 hover:shadow-glass-lg transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-xs text-neutral-500">({doctor.reviewCount})</span>
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {doctor.hospitalName}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {recommendedHospitals.length === 0 && recommendedDoctors.length === 0 && (
              <div className="glass-card p-12 text-center">
                <Building2 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-500 text-lg">No recommendations found</p>
                <p className="text-neutral-400 text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}

        {/* Info */}
        <div className="glass-card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <strong>How it works:</strong> Our AI analyzes your needs and recommends the best hospitals and doctors 
              based on specialty, location, ratings, and availability. Complete the full triage assessment for 
              more accurate recommendations.
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

