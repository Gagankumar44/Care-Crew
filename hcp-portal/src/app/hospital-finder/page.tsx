'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  DollarSign, 
  Building2,
  Phone,
  Mail,
  Calendar,
  Plane,
  SlidersHorizontal
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getHospitals, type Hospital } from '@/lib/api/hospital-registry'
import { getSurgeryCostComparison, getTopAffordableHospitals } from '@/lib/api/india-analytics'
import Link from 'next/link'

interface HospitalFilters {
  state: string
  city: string
  specialty: string
  costRange: { min: number; max: number }
  rating: number
  facilities: string[]
  hasAirAmbulance: boolean
}

export default function HospitalFinderPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<HospitalFilters>({
    state: '',
    city: '',
    specialty: '',
    costRange: { min: 0, max: 10000000 },
    rating: 0,
    facilities: [],
    hasAirAmbulance: false,
  })

  const states = ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Gujarat']
  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Pune']
  const specialties = ['Cardiac', 'Neuro', 'Orthopedic', 'General Surgery', 'Ophthalmology']
  const facilitiesOptions = ['ICU', 'MRI', 'CT Scan', 'Ambulance', 'Emergency', '24/7']

  useEffect(() => {
    fetchHospitals()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [hospitals, filters, searchQuery])

  const fetchHospitals = async () => {
    try {
      setLoading(true)
      const data = await getHospitals({})
      setHospitals(data)
      setFilteredHospitals(data)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...hospitals]

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.state_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // State filter
    if (filters.state) {
      filtered = filtered.filter(h => h.state_name === filters.state || h.state_code === filters.state)
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(h => h.city === filters.city)
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(h => (h.rating || 0) >= filters.rating)
    }

    // Cost range filter (using avg_cost if available)
    if (filters.costRange.min > 0 || filters.costRange.max < 10000000) {
      filtered = filtered.filter(h => {
        const cost = h.avg_cost || 0
        return cost >= filters.costRange.min && cost <= filters.costRange.max
      })
    }

    // Air ambulance filter
    if (filters.hasAirAmbulance) {
      filtered = filtered.filter(h => h.air_ambulance_available === true)
    }

    setFilteredHospitals(filtered)
  }

  const handleFilterChange = (key: keyof HospitalFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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
            <Building2 className="w-8 h-8 text-primary" />
            Hospital Finder
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Search, compare, and find the best hospitals across India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search hospitals by name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700"
            >
              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialty
                </label>
                <select
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                >
                  <option value="">All Specialties</option>
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Cost Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cost Range (₹)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.costRange.min || ''}
                    onChange={(e) => handleFilterChange('costRange', {
                      ...filters.costRange,
                      min: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.costRange.max === 10000000 ? '' : filters.costRange.max}
                    onChange={(e) => handleFilterChange('costRange', {
                      ...filters.costRange,
                      max: parseFloat(e.target.value) || 10000000
                    })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              {/* Air Ambulance */}
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="airAmbulance"
                  checked={filters.hasAirAmbulance}
                  onChange={(e) => handleFilterChange('hasAirAmbulance', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="airAmbulance" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Air Ambulance Available
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Found {filteredHospitals.length} hospitals
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 hover:shadow-glass-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                    {hospital.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {hospital.city}, {hospital.state_name || hospital.state_code}
                  </p>
                </div>
                {hospital.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{hospital.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {hospital.avg_cost && (
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>Avg Cost: ₹{hospital.avg_cost.toLocaleString('en-IN')}</span>
                </div>
              )}

              {hospital.air_ambulance_available && (
                <div className="flex items-center gap-2 mb-3 text-sm text-green-600 dark:text-green-400">
                  <Plane className="w-4 h-4" />
                  <span>Air Ambulance Available</span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Link href={`/hospitals/${hospital.id}`} className="flex-1">
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 text-sm">
                    View Details
                  </button>
                </Link>
                <Link href={`/appointments/new?hospital=${hospital.id}`}>
                  <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm">
                    <Calendar className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Building2 className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No hospitals found</p>
            <p className="text-neutral-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

