'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { MapPin, Building2, Star, Sparkles, Filter } from 'lucide-react'
import { mockHospitals } from '@/data/mockData'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HospitalMapPage() {
  const [selectedState, setSelectedState] = useState<string>('all')

  const states = Array.from(new Set(mockHospitals.map(h => h.state)))
  const hospitalsByState = selectedState === 'all' 
    ? mockHospitals 
    : mockHospitals.filter(h => h.state === selectedState)

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Premium Badge */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-sm font-medium rounded-full">
            Premium Feature
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              State-wise Hospital Map
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Explore hospitals across different states
            </p>
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
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="glass-card p-6">
          <div className="aspect-video bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Placeholder Map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-500 text-lg">Interactive Map Coming Soon</p>
                <p className="text-neutral-400 text-sm mt-2">
                  {selectedState === 'all' 
                    ? `Showing ${hospitalsByState.length} hospitals across ${states.length} states`
                    : `Showing ${hospitalsByState.length} hospitals in ${selectedState}`
                  }
                </p>
              </div>
            </div>
            {/* Mock Hospital Markers */}
            {hospitalsByState.slice(0, 5).map((hospital, idx) => (
              <div
                key={hospital.id}
                className="absolute"
                style={{
                  left: `${20 + idx * 15}%`,
                  top: `${30 + (idx % 2) * 30}%`,
                }}
              >
                <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* State-wise Hospital List */}
        <div className="space-y-6">
          {states.map(state => {
            const stateHospitals = mockHospitals.filter(h => h.state === state)
            if (selectedState !== 'all' && selectedState !== state) return null
            
            return (
              <div key={state} className="glass-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {state} ({stateHospitals.length} hospitals)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stateHospitals.map(hospital => (
                    <Link
                      key={hospital.id}
                      href={`/hospitals/${hospital.id}`}
                      className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:border-primary hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {hospital.name}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {hospital.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{hospital.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {hospital.emergencyAvailable && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-xs">
                            24/7 Emergency
                          </span>
                        )}
                        {hospital.ambulanceAvailable && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
                            Ambulance
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </PageLayout>
  )
}

