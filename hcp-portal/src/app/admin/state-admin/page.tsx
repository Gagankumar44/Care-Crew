'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Building2, 
  Activity, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getStateHospitals, calculateStateStats, type Hospital as AdminHospital } from '@/lib/api/admin'

interface Hospital {
  id: string
  name: string
  city: string
  status: string
  bedsTotal: number
  bedsAvailable: number
  type: string
}

interface StateStats {
  totalHospitals: number
  activeHospitals: number
  totalBeds: number
  availableBeds: number
  publicHospitals: number
  privateHospitals: number
}

export default function StateAdminPortalPage() {
  const [stats, setStats] = useState<StateStats | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedState] = useState('CA') // In real app, get from auth context

  useEffect(() => {
    // Fetch state admin data
    fetchStateData()
  }, [])

  const fetchStateData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch hospitals from admin service
      const adminHospitals = await getStateHospitals(selectedState)
      
      // Transform admin hospitals to page format
      const transformedHospitals: Hospital[] = adminHospitals.map(h => ({
        id: h.id,
        name: h.name,
        city: h.city || '',
        status: h.status,
        bedsTotal: h.beds_total || 0,
        bedsAvailable: h.beds_available || 0,
        type: h.type
      }))

      setHospitals(transformedHospitals)
      
      // Calculate statistics from fetched hospitals
      const calculatedStats = calculateStateStats(adminHospitals)
      setStats(calculatedStats)
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching state data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch state data')
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{title}</span>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-neutral-900 dark:text-white">{value}</div>
        {subtitle && <div className="text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</div>}
      </div>
    </motion.div>
  )

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">State Admin Portal</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage hospitals and healthcare resources across {selectedState}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-300">Error loading data</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Building2}
                title="Total Hospitals"
                value={stats?.totalHospitals}
                subtitle={`${stats?.activeHospitals} active`}
                color="blue"
              />
              <StatCard
                icon={Activity}
                title="Total Beds"
                value={stats?.totalBeds?.toLocaleString()}
                subtitle={`${stats?.availableBeds?.toLocaleString()} available`}
                color="green"
              />
              <StatCard
                icon={Shield}
                title="Public Hospitals"
                value={stats?.publicHospitals}
                subtitle={`${stats?.privateHospitals} private`}
                color="purple"
              />
              <StatCard
                icon={TrendingUp}
                title="Utilization"
                value={`${stats ? Math.round(((stats.totalBeds - stats.availableBeds) / stats.totalBeds) * 100) : 0}%`}
                subtitle="Current capacity"
                color="orange"
              />
            </div>

            {/* Hospitals List */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">State Hospitals</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Add Hospital
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {hospitals.length === 0 ? (
                  <div className="p-12 text-center text-neutral-500 dark:text-neutral-400">
                    No hospitals found in this state
                  </div>
                ) : (
                  hospitals.map((hospital) => (
                  <div key={hospital.id} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{hospital.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hospital.status === 'active' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {hospital.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hospital.type === 'public' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {hospital.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {hospital.city}
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            {hospital.bedsAvailable}/{hospital.bedsTotal} beds available
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                          Control
                        </button>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 cursor-pointer"
              >
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Generate Report</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Create state healthcare report</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 cursor-pointer"
              >
                <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">View Analytics</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">State-wide healthcare analytics</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 cursor-pointer"
              >
                <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Manage Settings</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Configure state policies</p>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}

