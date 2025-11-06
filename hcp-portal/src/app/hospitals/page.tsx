'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Search, MapPin, Star, Filter, Phone, Car, Calendar, Building2 } from 'lucide-react'
import { mockHospitals, Hospital } from '@/data/mockData'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all')

  const states = Array.from(new Set(mockHospitals.map(h => h.state)))
  const specialties = Array.from(new Set(mockHospitals.flatMap(h => h.specialties)))

  const filteredHospitals = mockHospitals.filter(hospital => {
    const matchesSearch = 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = selectedState === 'all' || hospital.state === selectedState
    const matchesSpecialty = selectedSpecialty === 'all' || hospital.specialties.includes(selectedSpecialty)
    
    return matchesSearch && matchesState && matchesSpecialty
  })

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Hospital Directory
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Find hospitals near you with detailed information
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search hospitals by name, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-neutral-500" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Building2 className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No hospitals found</p>
            <p className="text-neutral-400 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 hover:shadow-glass-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/hospitals/${hospital.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors">
              {hospital.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            <MapPin className="w-4 h-4" />
            <span>{hospital.city}, {hospital.state}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {hospital.rating}
          </span>
          <span className="text-xs text-neutral-500">({hospital.reviewCount})</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {hospital.specialties.slice(0, 3).map((specialty) => (
            <span
              key={specialty}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {specialty}
            </span>
          ))}
          {hospital.specialties.length > 3 && (
            <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded-full">
              +{hospital.specialties.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          {hospital.emergencyAvailable && (
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse" />
              <span>24/7 Emergency</span>
            </div>
          )}
          {hospital.ambulanceAvailable && (
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Car className="w-4 h-4" />
              <span>Ambulance</span>
            </div>
          )}
        </div>

        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          <div>Beds: {hospital.beds} | ICU: {hospital.icuBeds}</div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link
          href={`/hospitals/${hospital.id}`}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-center text-sm"
        >
          View Details
        </Link>
        <a
          href={`tel:${hospital.phone}`}
          className="px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  )
}

