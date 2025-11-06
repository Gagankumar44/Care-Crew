'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  Building2, 
  Search, 
  Filter, 
  Plus,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getHospitals, getHospitalStatistics, type Hospital as RegistryHospital } from '@/lib/api/hospital-registry'

interface Hospital {
  id: string
  name: string
  stateCode: string
  stateName: string
  city: string
  address: string
  phone: string
  email: string
  type: string
  accreditation: string
  bedsTotal: number
  bedsAvailable: number
  icuBeds: number
  status: string
  registrationNumber: string
  registrationDate: string
}

export default function HospitalRegistryPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchHospitals()
  }, [])

  const fetchHospitals = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch hospitals from hospital registry service
      const filters: { status?: string } = {}
      if (filterStatus !== 'all') {
        filters.status = filterStatus
      }

      const registryHospitals = await getHospitals(filters)
      
      // Transform registry hospitals to page format
      const transformedHospitals: Hospital[] = registryHospitals.map(h => ({
        id: h.id,
        name: h.name,
        stateCode: h.state_code,
        stateName: h.state_name || h.state_code,
        city: h.city || '',
        address: h.address || '',
        phone: h.phone || '',
        email: h.email || '',
        type: h.type,
        accreditation: h.accreditation || '',
        bedsTotal: h.beds_total || 0,
        bedsAvailable: h.beds_available || 0,
        icuBeds: h.icu_beds || 0,
        status: h.status,
        registrationNumber: h.registration_number || '',
        registrationDate: h.registration_date || ''
      }))

      setHospitals(transformedHospitals)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch hospitals')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (filterStatus) {
      fetchHospitals()
    }
  }, [filterStatus])

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || hospital.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">National Hospital Registry</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage and monitor all registered hospitals nationwide</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Register Hospital
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search hospitals by name, city, or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Hospitals</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{hospitals.length}</div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Active</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {hospitals.filter(h => h.status === 'active').length}
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Public</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {hospitals.filter(h => h.type === 'public').length}
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Beds</div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {hospitals.reduce((sum, h) => sum + h.bedsTotal, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Hospitals Table */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-300">Error loading hospitals</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Hospital</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Beds</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredHospitals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                        No hospitals found
                      </td>
                    </tr>
                  ) : (
                    filteredHospitals.map((hospital) => (
                    <tr key={hospital.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">{hospital.name}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{hospital.registrationNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">{hospital.city}, {hospital.stateCode}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{hospital.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hospital.type === 'public' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}>
                          {hospital.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {hospital.bedsAvailable}/{hospital.bedsTotal}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{hospital.icuBeds} ICU</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hospital.status === 'active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {hospital.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

