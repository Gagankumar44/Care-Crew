'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { MapPin, Star, Phone, Car, Calendar, Building2, Clock, Users, Award, Plane, MessageSquare, DollarSign } from 'lucide-react'
import { mockHospitals, mockDoctors } from '@/data/mockData'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getHospitals, type Hospital } from '@/lib/api/hospital-registry'
import { useSafeAuth } from '@/hooks/useSafeAuth'

export default function HospitalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useSafeAuth()
  const hospitalId = params.id as string
  const [hospital, setHospital] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    fetchHospitalData()
  }, [hospitalId])

  const fetchHospitalData = async () => {
    try {
      setLoading(true)
      // Try to fetch from API first
      try {
        const data = await getHospitals({})
        const found = data.find((h: Hospital) => h.id === hospitalId)
        if (found) {
          setHospital(found)
        } else {
          // Fallback to mock data
          setHospital(mockHospitals.find(h => h.id === hospitalId))
        }
      } catch (error) {
        // Fallback to mock data
        setHospital(mockHospitals.find(h => h.id === hospitalId))
      }
      setDoctors(mockDoctors.filter(d => d.hospitalId === hospitalId))
    } catch (error) {
      console.error('Error fetching hospital:', error)
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

  if (!hospital) {
    return (
      <PageLayout>
        <div className="glass-card p-12 text-center">
          <Building2 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">Hospital not found</p>
          <button
            onClick={() => router.push('/hospitals')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Hospitals
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary-600 mb-4 text-sm"
          >
            ← Back
          </button>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {hospital.name}
              </h1>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{hospital.address || 'Address not available'}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <span>{hospital.city || hospital.city}, {hospital.state || hospital.state_name || hospital.state_code}</span>
                {hospital.establishedYear && (
                  <>
                    <span>•</span>
                    <span>Est. {hospital.establishedYear}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {hospital.rating || hospital.rating || 'N/A'}
                </span>
                <span className="text-sm text-neutral-500">({hospital.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hospital.emergencyAvailable && (
            <Link
              href="/emergency"
              className="glass-card p-4 flex items-center gap-3 hover:shadow-glass-lg transition-all group"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Emergency</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">24/7 Available</div>
              </div>
            </Link>
          )}
          <a
            href={`tel:${hospital.phone || hospital.contact_phone}`}
            className="glass-card p-4 flex items-center gap-3 hover:shadow-glass-lg transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">Call Now</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">{hospital.phone || hospital.contact_phone}</div>
            </div>
          </a>
          <Link
            href={`/appointments/new?hospital=${hospital.id}`}
            className="glass-card p-4 flex items-center gap-3 hover:shadow-glass-lg transition-all group"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">Book Appointment</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Schedule visit</div>
            </div>
          </Link>
          {(hospital.air_ambulance_available || (hospital.facilities && typeof hospital.facilities === 'object' && hospital.facilities.Air_Ambulance)) && (
            <Link
              href={`/air-ambulance-request?hospital=${hospital.id}`}
              className="glass-card p-4 flex items-center gap-3 hover:shadow-glass-lg transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Air Ambulance</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Request service</div>
              </div>
            </Link>
          )}
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/hospital-cost-comparison?surgery=all&hospital=${hospital.id}`}
            className="glass-card p-4 flex items-center gap-3 hover:shadow-glass-lg transition-all group"
          >
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">View Costs</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Surgery pricing</div>
            </div>
          </Link>
          <Link
            href={`/hospital-feedback?hospital=${hospital.id}`}
            className="glass-card p-4 flex items-center gap-3 hover:shadow-glass-lg transition-all group"
          >
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">Feedback</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Rate & review</div>
            </div>
          </Link>
          <Link
            href={`/hospitals?state=${hospital.state || hospital.state_name || hospital.state_code}`}
            className="glass-card p-4 flex items-center gap-3 hover:shadow-glass-lg transition-all group"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">Compare</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Similar hospitals</div>
            </div>
          </Link>
        </div>

        {/* Hospital Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facilities */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Facilities
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(hospital.facilities && Array.isArray(hospital.facilities) 
                ? hospital.facilities 
                : hospital.facilities && typeof hospital.facilities === 'object'
                  ? Object.keys(hospital.facilities).filter(k => hospital.facilities[k])
                  : []).map((facility: string) => (
                <div
                  key={facility}
                  className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm text-gray-700 dark:text-neutral-300">{facility.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Specialties
            </h2>
            <div className="flex flex-wrap gap-2">
              {(hospital.specialties && Array.isArray(hospital.specialties) 
                ? hospital.specialties 
                : []).map((specialty: string) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Capacity
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Total Beds</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{hospital.beds || hospital.beds_total || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">ICU Beds</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{hospital.icuBeds || hospital.icu_beds || 'N/A'}</span>
              </div>
              {hospital.beds_available !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Available Beds</span>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">{hospital.beds_available}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Location */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Contact & Location
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Address</div>
                <div className="text-gray-900 dark:text-white">{hospital.address || 'Address not available'}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Phone</div>
                <a href={`tel:${hospital.phone || hospital.contact_phone}`} className="text-primary hover:text-primary-600">
                  {hospital.phone || hospital.contact_phone || 'N/A'}
                </a>
              </div>
              {hospital.contact_email && (
                <div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Email</div>
                  <a href={`mailto:${hospital.contact_email}`} className="text-primary hover:text-primary-600">
                    {hospital.contact_email}
                  </a>
                </div>
              )}
              {hospital.coordinates && (
                <div className="mt-4 h-48 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                  <span className="text-neutral-500 text-sm">Map View Coming Soon</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Doctors at this Hospital */}
        {doctors.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Doctors at {hospital.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/doctors/${doctor.id}`}
                  className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{doctor.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    ₹{doctor.consultationFee.toLocaleString()} consultation
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

