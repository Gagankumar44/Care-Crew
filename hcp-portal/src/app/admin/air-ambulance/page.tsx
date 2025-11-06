'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Plane, 
  MapPin, 
  Clock, 
  Activity,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Navigation,
  Fuel,
  Calendar,
  Filter,
  Eye,
  Play,
  Pause,
  Square
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getDashboardStatistics, getMissions, type Mission as AmbulanceMission, type DashboardStats as AmbulanceDashboardStats } from '@/lib/api/ambulance'

interface Mission {
  id: string
  ambulanceId: string
  registrationNumber: string
  missionType: string
  priority: string
  status: string
  originLocation: { lat: number; lng: number; address: string }
  destinationLocation: { lat: number; lng: number; address: string; hospitalId: string }
  patientInfo?: { name: string; age: number; condition: string; urgency: string }
  estimatedDistanceKm: number
  estimatedDurationMinutes: number
  actualDurationMinutes?: number
  assignedCrew: Array<{ name: string; role: string }>
  dispatchedAt?: string
  completedAt?: string
  createdAt: string
}

interface DashboardStats {
  availableAmbulances: number
  ambulancesOnMission: number
  pendingMissions: number
  missionsInTransit: number
  missionsToday: number
  completedToday: number
}

export default function AirAmbulanceDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (filterStatus) {
      fetchMissions()
    }
  }, [filterStatus])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch dashboard statistics
      const dashboardStats = await getDashboardStatistics()
      setStats({
        availableAmbulances: dashboardStats.availableAmbulances || 0,
        ambulancesOnMission: dashboardStats.ambulancesOnMission || 0,
        pendingMissions: dashboardStats.pendingMissions || 0,
        missionsInTransit: dashboardStats.missionsInTransit || 0,
        missionsToday: dashboardStats.missionsToday || 0,
        completedToday: dashboardStats.completedToday || 0
      })

      await fetchMissions()
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data')
      setLoading(false)
    }
  }

  const fetchMissions = async () => {
    try {
      const filters: { status?: string } = {}
      if (filterStatus !== 'all') {
        filters.status = filterStatus
      }

      const ambulanceMissions = await getMissions(filters)
      
      // Transform ambulance missions to page format
      const transformedMissions: Mission[] = ambulanceMissions.map(m => ({
        id: m.id,
        ambulanceId: m.ambulance_id,
        registrationNumber: m.registration_number || '',
        missionType: m.mission_type,
        priority: m.priority,
        status: m.status,
        originLocation: m.origin_location,
        destinationLocation: {
          ...m.destination_location,
          hospitalId: (m.destination_location as any).hospital_id || (m.destination_location as any).hospitalId || ''
        },
        patientInfo: m.patient_info,
        estimatedDistanceKm: m.estimated_distance_km || 0,
        estimatedDurationMinutes: m.estimated_duration_minutes || 0,
        assignedCrew: m.assigned_crew || [],
        dispatchedAt: m.dispatched_at,
        completedAt: m.completed_at,
        createdAt: m.created_at
      }))

      setMissions(transformedMissions)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching missions:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch missions')
      setLoading(false)
    }
  }

  const filteredMissions = missions.filter(mission => {
    return filterStatus === 'all' || mission.status === filterStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'dispatched': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'in_transit': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400'
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
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Air Ambulance Mission Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Real-time tracking and management of air ambulance missions</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plane className="w-4 h-4" />
            New Mission
          </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={Plane}
                title="Available"
                value={stats?.availableAmbulances}
                subtitle={`${stats?.ambulancesOnMission} on mission`}
                color="green"
              />
              <StatCard
                icon={Activity}
                title="Active Missions"
                value={stats?.missionsInTransit}
                subtitle={`${stats?.pendingMissions} pending`}
                color="blue"
              />
              <StatCard
                title="Today"
                value={stats?.missionsToday}
                subtitle={`${stats?.completedToday} completed`}
                color="purple"
                icon={Calendar}
              />
            </div>

            {/* Filter */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="all">All Missions</option>
                  <option value="pending">Pending</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="in_transit">In Transit</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Missions List */}
            <div className="space-y-4">
              {filteredMissions.map((mission) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                          Mission #{mission.id}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                          {mission.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(mission.priority)}`}>
                          {mission.priority}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Aircraft: {mission.registrationNumber} | Type: {mission.missionType}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                      {mission.status === 'pending' && (
                        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                          <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                      )}
                      {mission.status === 'in_transit' && (
                        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                          <Square className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Origin</div>
                      <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        {mission.originLocation.address}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Destination</div>
                      <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                        {mission.destinationLocation.address}
                      </div>
                    </div>
                  </div>

                  {mission.patientInfo && (
                    <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Patient Information</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">Name:</span>{' '}
                          <span className="text-neutral-900 dark:text-white">{mission.patientInfo.name}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">Age:</span>{' '}
                          <span className="text-neutral-900 dark:text-white">{mission.patientInfo.age}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">Condition:</span>{' '}
                          <span className="text-neutral-900 dark:text-white">{mission.patientInfo.condition}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">Urgency:</span>{' '}
                          <span className="text-neutral-900 dark:text-white">{mission.patientInfo.urgency}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Navigation className="w-4 h-4" />
                        {mission.estimatedDistanceKm} km
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Clock className="w-4 h-4" />
                        {mission.estimatedDurationMinutes} min
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Users className="w-4 h-4" />
                        {mission.assignedCrew.length} crew
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {new Date(mission.createdAt).toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}

