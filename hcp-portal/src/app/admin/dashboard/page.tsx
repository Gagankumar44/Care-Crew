'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import IndiaMap from '@/components/IndiaMap'
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plane, 
  BarChart3,
  Download,
  Filter,
  Shield,
  Globe,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getIndiaAnalytics, getMonthlyStatewiseReport, type StateStats } from '@/lib/api/india-analytics'
import { getHospitals } from '@/lib/api/hospital-registry'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getIndiaAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStateClick = (stateCode: string) => {
    setSelectedState(stateCode === selectedState ? null : stateCode)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Admin Dashboard - India Level Control
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Central control and analysis for all hospitals, surgeries, and healthcare activity across India
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* India Analytics Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            India Analytics Overview
          </h2>
          
          {/* India Map */}
          <IndiaMap onStateClick={handleStateClick} selectedState={selectedState} />

          {/* Overall Stats */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <Building2 className="w-8 h-8 text-primary mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.totals.total_hospitals.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Hospitals</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.totals.total_surgeries.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Surgeries</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <Plane className="w-8 h-8 text-purple-500 mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.totals.total_air_ambulance_missions.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Air Ambulance Missions</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <Globe className="w-8 h-8 text-blue-500 mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.totals.states_count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">States Covered</div>
              </motion.div>
            </div>
          )}
        </section>

        {/* Hospital Control */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Hospital Control
            </h2>
            <Link href="/admin/hospital-registry">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                Manage Hospitals
              </button>
            </Link>
          </div>
          
          <div className="glass-card p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add, approve, edit, and manage hospitals across all Indian states. Verify licenses and NABH accreditations.
            </p>
            <div className="flex gap-4">
              <Link href="/admin/hospital-registry">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                  View All Hospitals
                </button>
              </Link>
              <Link href="/admin/multi-state-control">
                <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  Multi-State Control
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Surgery Cost Management */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Surgery Cost Management
            </h2>
            <Link href="/surgery-costs">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                Manage Costs
              </button>
            </Link>
          </div>
          
          <div className="glass-card p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add surgery categories, enter cost ranges per hospital/state, and compare prices across states.
            </p>
            <div className="flex gap-4">
              <Link href="/hospital-cost-comparison">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                  Compare Prices
                </button>
              </Link>
              <Link href="/surgery-costs">
                <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  View All Surgeries
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Reports & Analytics */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Reports & Analytics
          </h2>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Statewise Reports
              </h3>
              <div className="flex gap-2">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate comprehensive monthly reports for cost comparison, patient registration growth, and top hospitals.
              </p>
              <Link href="/admin/surgery-analytics">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                  View Analytics
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Top Hospitals */}
        {analytics && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              State-wise Statistics
            </h2>
            
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">State</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Hospitals</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Surgeries</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Avg Cost</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Air Missions</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {analytics.state_stats.slice(0, 10).map((state: StateStats) => (
                      <tr key={state.state_code} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {state.state_name}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {state.city_count} cities
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {state.hospital_count}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {state.total_surgeries.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {state.avg_surgery_cost ? (
                            <div className="font-semibold text-gray-900 dark:text-white">
                              ₹{state.avg_surgery_cost.toLocaleString('en-IN')}
                            </div>
                          ) : (
                            <span className="text-neutral-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {state.air_ambulance_missions}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleStateClick(state.state_code)}
                            className="text-primary hover:text-primary-600 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  )
}

