'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3,
  Shield,
  MapPin,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getStateAnalytics } from '@/lib/api/india-analytics'
import { getHospitals } from '@/lib/api/hospital-registry'
import { useSearchParams } from 'next/navigation'

export default function StateDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const stateCode = searchParams.get('state') || 'KA'

  useEffect(() => {
    fetchStateAnalytics()
  }, [stateCode])

  const fetchStateAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getStateAnalytics(stateCode)
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching state analytics:', error)
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

  if (!analytics) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">State not found</p>
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
            <Shield className="w-8 h-8 text-primary" />
            State Dashboard - {analytics.state.name}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Regional health administration and analytics for {analytics.state.name}
          </p>
        </div>

        {/* State Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <Building2 className="w-8 h-8 text-primary mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.hospital_count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Hospitals</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.doctor_count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Doctors</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <DollarSign className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.surgery_costs.length > 0 ? (
                `₹${Math.round(analytics.surgery_costs.reduce((sum: number, c: any) => sum + (c.avg_cost || 0), 0) / analytics.surgery_costs.length).toLocaleString('en-IN')}`
              ) : (
                'N/A'
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Surgery Cost</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <Activity className="w-8 h-8 text-purple-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.top_hospitals.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rated Hospitals</div>
          </motion.div>
        </div>

        {/* Hospital Management */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Hospital Management
          </h2>
          
          <div className="glass-card p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View and manage hospitals under {analytics.state.name}. Upload local data, approve hospitals, and track state-level analytics.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                View All Hospitals
              </button>
              <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
                Add Hospital
              </button>
            </div>
          </div>
        </section>

        {/* Surgery Costs by Category */}
        {analytics.surgery_costs.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Surgery Costs by Category
            </h2>
            
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Avg Cost</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Min Cost</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Max Cost</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Hospitals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {analytics.surgery_costs.map((cost: any, index: number) => (
                      <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {cost.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            ₹{Math.round(cost.avg_cost).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-gray-600 dark:text-gray-400">
                            ₹{Math.round(cost.min_cost).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-gray-600 dark:text-gray-400">
                            ₹{Math.round(cost.max_cost).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-gray-600 dark:text-gray-400">
                            {cost.hospital_count}
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

        {/* Top Hospitals */}
        {analytics.top_hospitals.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Top Rated Hospitals
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.top_hospitals.map((hospital: any) => (
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
                        {hospital.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {hospital.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {hospital.review_count} reviews
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  )
}

