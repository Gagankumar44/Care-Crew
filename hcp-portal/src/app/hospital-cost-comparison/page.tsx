'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { DollarSign, TrendingUp, Building2, Star, MapPin, Phone, Sparkles, Globe, Filter } from 'lucide-react'
import { mockHospitals, mockSurgeryCosts } from '@/data/mockData'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getSurgeryCostComparison, getTopAffordableHospitals, getTopRatedHospitals } from '@/lib/api/india-analytics'
import { getHospitals } from '@/lib/api/hospital-registry'

export default function CostComparisonPage() {
  const [selectedSurgery, setSelectedSurgery] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [stateComparison, setStateComparison] = useState<any[]>([])
  const [topAffordable, setTopAffordable] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hospitals, setHospitals] = useState<any[]>([])

  const surgeries = mockSurgeryCosts

  useEffect(() => {
    fetchHospitals()
  }, [])

  useEffect(() => {
    if (selectedSurgery !== 'all' && selectedSurgery) {
      fetchSurgeryComparison(selectedSurgery)
      fetchTopAffordable(selectedSurgery)
    }
  }, [selectedSurgery])

  const fetchHospitals = async () => {
    try {
      const data = await getHospitals({})
      setHospitals(data)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      setHospitals(mockHospitals)
    }
  }

  const fetchSurgeryComparison = async (surgeryId: string) => {
    try {
      setLoading(true)
      const comparison = await getSurgeryCostComparison(surgeryId)
      setStateComparison(comparison)
    } catch (error) {
      console.error('Error fetching comparison:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopAffordable = async (surgeryId: string) => {
    try {
      const affordable = await getTopAffordableHospitals(surgeryId, 5)
      setTopAffordable(affordable)
    } catch (error) {
      console.error('Error fetching affordable hospitals:', error)
    }
  }

  // Simulate hospital-specific costs (in real app, this would come from API)
  const getHospitalCosts = (hospitalId: string, surgeryId: string) => {
    const baseCost = mockSurgeryCosts.find(s => s.id === surgeryId)?.avgCost || 0
    // Simulate cost variation by hospital
    const multipliers: Record<string, number> = {
      '1': 1.0, // Apollo - average
      '2': 1.2, // Fortis - premium
      '3': 0.7, // AIIMS - government subsidized
      '4': 0.9, // Manipal - slightly below average
      '5': 1.1, // Max - above average
    }
    return Math.round(baseCost * (multipliers[hospitalId] || 1.0))
  }

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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hospital Cost Comparison
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Compare surgery costs across different hospitals
          </p>
        </div>

        {/* Surgery Selector */}
        <div className="glass-card p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Surgery Type
          </label>
          <select
            value={selectedSurgery}
            onChange={(e) => setSelectedSurgery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Surgeries</option>
            {surgeries.map(surgery => (
              <option key={surgery.id} value={surgery.id}>{surgery.name}</option>
            ))}
          </select>
        </div>

        {/* Comparison Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Hospital
                  </th>
                  {selectedSurgery === 'all' ? (
                    surgeries.map(surgery => (
                      <th key={surgery.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        {surgery.name}
                      </th>
                    ))
                  ) : (
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Cost
                    </th>
                  )}
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {mockHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {hospital.name}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {hospital.city}, {hospital.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    {selectedSurgery === 'all' ? (
                      surgeries.map(surgery => {
                        const cost = getHospitalCosts(hospital.id, surgery.id)
                        const avgCost = surgery.avgCost
                        const isLower = cost < avgCost
                        return (
                          <td key={surgery.id} className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`font-semibold ${isLower ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                ₹{cost.toLocaleString('en-IN')}
                              </span>
                              {isLower && (
                                <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  Lower
                                </span>
                              )}
                            </div>
                          </td>
                        )
                      })
                    ) : (
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ₹{getHospitalCosts(hospital.id, selectedSurgery).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{hospital.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/hospitals/${hospital.id}`}
                        className="text-primary hover:text-primary-600 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* State-wise Comparison */}
        {selectedSurgery !== 'all' && stateComparison.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6" />
              State-wise Cost Comparison
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">State</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Avg Cost</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Min Cost</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Max Cost</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Hospitals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {stateComparison.map((state, index) => (
                      <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {state.state_name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {state.state_code}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            ₹{Math.round(state.avg_cost).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-gray-600 dark:text-gray-400">
                            ₹{Math.round(state.min_cost).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-gray-600 dark:text-gray-400">
                            ₹{Math.round(state.max_cost).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-gray-600 dark:text-gray-400">
                            {state.hospital_count}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Top Affordable Hospitals */}
        {selectedSurgery !== 'all' && topAffordable.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Top 5 Most Affordable Hospitals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topAffordable.map((hospital) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {hospital.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {hospital.city}, {hospital.state_name}
                      </p>
                    </div>
                    {hospital.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{hospital.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cost</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₹{Math.round(hospital.avg_cost).toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Range: ₹{Math.round(hospital.min_cost).toLocaleString('en-IN')} - ₹{Math.round(hospital.max_cost).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <Link href={`/hospitals/${hospital.id}`}>
                    <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 text-sm">
                      View Details
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Summary */}
        {selectedSurgery !== 'all' && (
          <div className="glass-card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cost Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Lowest Cost</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{Math.min(...mockHospitals.map(h => getHospitalCosts(h.id, selectedSurgery))).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Average Cost</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{Math.round(mockHospitals.reduce((sum, h) => sum + getHospitalCosts(h.id, selectedSurgery), 0) / mockHospitals.length).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Highest Cost</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ₹{Math.max(...mockHospitals.map(h => getHospitalCosts(h.id, selectedSurgery))).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

