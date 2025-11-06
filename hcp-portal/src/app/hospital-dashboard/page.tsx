'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Building2, 
  Users, 
  DollarSign, 
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  Upload,
  Settings
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHospitalData()
  }, [])

  const fetchHospitalData = async () => {
    try {
      setLoading(true)
      // In real app, fetch hospital data by user's hospital_id
      // For now, using mock data
      setHospital({
        id: '1',
        name: 'Apollo Hospitals',
        state: 'Karnataka',
        city: 'Bangalore',
        address: '123 Hospital Street',
        contact_phone: '+91 80 1234 5678',
        contact_email: 'info@apollo.com',
        facilities: {
          ICU: true,
          MRI: true,
          CT_Scan: true,
          Ambulance: true,
          Air_Ambulance: true,
          Emergency: true,
        },
        beds_total: 500,
        beds_available: 150,
        icu_beds: 50,
        rating: 4.5,
        verified: true,
        nabh_accreditation: true,
      })
    } catch (error) {
      console.error('Error fetching hospital data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Save hospital updates
    setEditing(false)
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
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Hospital not found</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              Hospital Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Manage your hospital profile, facilities, and updates
            </p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
          >
            {editing ? (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Hospital Profile */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Hospital Profile</h2>
          
          <div className="glass-card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hospital Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={hospital.name}
                    onChange={(e) => setHospital({ ...hospital, name: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-semibold">{hospital.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {hospital.city}, {hospital.state}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={hospital.contact_phone}
                    onChange={(e) => setHospital({ ...hospital, contact_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {hospital.contact_phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={hospital.contact_email}
                    onChange={(e) => setHospital({ ...hospital, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {hospital.contact_email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Facilities</h2>
          
          <div className="glass-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(hospital.facilities).map(([facility, available]) => (
                <div key={facility} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={available as boolean}
                    disabled={!editing}
                    onChange={(e) => setHospital({
                      ...hospital,
                      facilities: { ...hospital.facilities, [facility]: e.target.checked }
                    })}
                    className="w-4 h-4"
                  />
                  <label className="text-gray-700 dark:text-gray-300">{facility.replace('_', ' ')}</label>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bed Availability */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Bed Availability</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Beds</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {hospital.beds_total}
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Beds</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {hospital.beds_available}
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">ICU Beds</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {hospital.icu_beds}
              </div>
            </div>
          </div>
        </section>

        {/* Surgery Pricing */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Surgery Pricing</h2>
          
          <div className="glass-card p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage surgery types and costs for your hospital.
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
              Manage Surgery Prices
            </button>
          </div>
        </section>

        {/* Patient Feedback */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Patient Feedback</h2>
          
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {hospital.rating}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
            </div>
            <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
              View All Feedback
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

