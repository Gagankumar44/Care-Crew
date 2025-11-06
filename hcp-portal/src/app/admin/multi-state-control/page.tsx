'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Building2, 
  MapPin,
  Activity,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Filter,
  Search,
  Globe,
  Shield,
  BarChart3,
  Calendar,
  Eye,
  Edit,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getHospitals } from '@/lib/api/hospital-registry'
import { getControlLogs, type HospitalControlLog } from '@/lib/api/admin'

interface State {
  code: string
  name: string
  totalHospitals: number
  activeHospitals: number
  totalBeds: number
  availableBeds: number
  utilizationRate: number
  publicHospitals: number
  privateHospitals: number
  lastUpdated: string
}

interface HospitalControl {
  id: string
  hospitalId: string
  hospitalName: string
  stateCode: string
  action: string
  details: Record<string, any>
  adminId: string
  createdAt: string
}

export default function MultiStateHospitalControlPage() {
  const [states, setStates] = useState<State[]>([])
  const [recentControls, setRecentControls] = useState<HospitalControl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMultiStateData()
  }, [])

  const fetchMultiStateData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all hospitals
      const allHospitals = await getHospitals()
      
      // Group hospitals by state and calculate statistics
      const stateMap = new Map<string, State>()
      
      allHospitals.forEach(hospital => {
        const stateCode = hospital.state_code
        if (!stateMap.has(stateCode)) {
          stateMap.set(stateCode, {
            code: stateCode,
            name: hospital.state_name || stateCode,
            totalHospitals: 0,
            activeHospitals: 0,
            totalBeds: 0,
            availableBeds: 0,
            utilizationRate: 0,
            publicHospitals: 0,
            privateHospitals: 0,
            lastUpdated: new Date().toISOString()
          })
        }
        
        const state = stateMap.get(stateCode)!
        state.totalHospitals++
        if (hospital.status === 'active') {
          state.activeHospitals++
        }
        state.totalBeds += hospital.beds_total || 0
        state.availableBeds += hospital.beds_available || 0
        if (hospital.type === 'public') {
          state.publicHospitals++
        } else if (hospital.type === 'private') {
          state.privateHospitals++
        }
      })

      // Calculate utilization rates
      const statesArray = Array.from(stateMap.values()).map(state => ({
        ...state,
        utilizationRate: state.totalBeds > 0 
          ? Math.round(((state.totalBeds - state.availableBeds) / state.totalBeds) * 100 * 10) / 10
          : 0
      }))

      setStates(statesArray)

      // Fetch recent control logs
      const logs = await getControlLogs(20)
      
      // Transform control logs to page format
      const transformedLogs: HospitalControl[] = logs.map(log => ({
        id: log.id,
        hospitalId: log.hospital_id,
        hospitalName: log.details?.hospitalName || 'Unknown Hospital',
        stateCode: log.details?.stateCode || '',
        action: log.action,
        details: log.details,
        adminId: log.admin_id,
        createdAt: log.created_at
      }))

      setRecentControls(transformedLogs)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching multi-state data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch multi-state data')
      setLoading(false)
    }
  }

  const filteredStates = states.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         state.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = selectedState === 'all' || state.code === selectedState
    return matchesSearch && matchesState
  })

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

  const totalStats = states.reduce((acc, state) => ({
    totalHospitals: acc.totalHospitals + state.totalHospitals,
    activeHospitals: acc.activeHospitals + state.activeHospitals,
    totalBeds: acc.totalBeds + state.totalBeds,
    availableBeds: acc.availableBeds + state.availableBeds,
  }), { totalHospitals: 0, activeHospitals: 0, totalBeds: 0, availableBeds: 0 })

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Multi-State Hospital Control System</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Centralized management and monitoring across all states</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              System Settings
            </button>
          </div>
        </div>

        {/* National Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={Building2}
            title="Total Hospitals"
            value={totalStats.totalHospitals}
            subtitle={`${totalStats.activeHospitals} active`}
            color="blue"
          />
          <StatCard
            icon={Activity}
            title="Total Beds"
            value={totalStats.totalBeds.toLocaleString()}
            subtitle={`${totalStats.availableBeds.toLocaleString()} available`}
            color="green"
          />
          <StatCard
            icon={Globe}
            title="States"
            value={states.length}
            subtitle="Coverage"
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            title="Avg Utilization"
            value={`${states.length > 0 ? Math.round(states.reduce((sum, s) => sum + s.utilizationRate, 0) / states.length) : 0}%`}
            subtitle="National average"
            color="orange"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state.code} value={state.code}>{state.name}</option>
                ))}
              </select>
            </div>
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
            {/* States Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStates.map((state) => (
                <motion.div
                  key={state.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{state.name}</h3>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{state.code}</div>
                    </div>
                    <Link href={`/admin/state-admin?state=${state.code}`}>
                      <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                        <Eye className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                      </button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Hospitals</div>
                        <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {state.activeHospitals}/{state.totalHospitals}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Beds</div>
                        <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {state.totalBeds.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Utilization</span>
                        <span className="text-xs font-medium text-neutral-900 dark:text-white">{state.utilizationRate}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            state.utilizationRate >= 80 ? 'bg-red-500' :
                            state.utilizationRate >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${state.utilizationRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {state.publicHospitals} public, {state.privateHospitals} private
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {new Date(state.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Control Actions */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Recent Control Actions</h2>
              </div>
              
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {recentControls.map((control) => (
                  <div key={control.id} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-semibold text-neutral-900 dark:text-white">{control.hospitalName}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {control.stateCode}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          Action: <span className="font-medium">{control.action.replace('_', ' ')}</span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {new Date(control.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}

