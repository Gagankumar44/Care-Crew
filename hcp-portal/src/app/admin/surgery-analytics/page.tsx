'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { 
  TrendingUp, 
  Calendar, 
  BarChart3,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Building2,
  MapPin,
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getPredictions, getHistoricalDemand, type DemandPrediction, type DemandHistory as AnalyticsDemandHistory } from '@/lib/api/analytics'

interface Prediction {
  id: string
  hospitalId?: string
  hospitalName?: string
  stateCode: string
  surgeryType: string
  specialty: string
  predictedDemand: number
  confidenceLevel: number
  predictionDate: string
  forecastPeriodDays: number
  factors: Record<string, any>
}

interface DemandHistory {
  date: string
  demandCount: number
  surgeryType: string
  specialty: string
}

export default function SurgeryDemandAnalyticsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [history, setHistory] = useState<DemandHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSurgeryType, setSelectedSurgeryType] = useState<string>('all')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all')
  const [forecastPeriod, setForecastPeriod] = useState<number>(30)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  useEffect(() => {
    if (selectedSurgeryType || selectedSpecialty) {
      fetchAnalyticsData()
    }
  }, [selectedSurgeryType, selectedSpecialty])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch predictions
      const filters: { surgeryType?: string; specialty?: string } = {}
      if (selectedSurgeryType !== 'all') {
        filters.surgeryType = selectedSurgeryType
      }
      if (selectedSpecialty !== 'all') {
        filters.specialty = selectedSpecialty
      }

      const analyticsPredictions = await getPredictions(filters)
      
      // Transform predictions to page format
      const transformedPredictions: Prediction[] = analyticsPredictions.map(p => ({
        id: p.id,
        hospitalId: p.hospital_id,
        stateCode: p.state_code || '',
        surgeryType: p.surgery_type,
        specialty: p.specialty,
        predictedDemand: p.predicted_demand,
        confidenceLevel: p.confidence_level,
        predictionDate: p.prediction_date,
        forecastPeriodDays: Math.ceil((new Date(p.period_end).getTime() - new Date(p.period_start).getTime()) / (1000 * 60 * 60 * 24)),
        factors: p.factors || {}
      }))

      setPredictions(transformedPredictions)

      // Fetch historical demand
      const historicalData = await getHistoricalDemand(filters)
      
      // Transform historical data to page format
      const transformedHistory: DemandHistory[] = historicalData.map(h => ({
        date: h.date,
        demandCount: h.demand_count,
        surgeryType: h.surgery_type,
        specialty: h.specialty
      }))

      setHistory(transformedHistory)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics data')
      setLoading(false)
    }
  }

  const filteredPredictions = predictions.filter(pred => {
    const matchesType = selectedSurgeryType === 'all' || pred.surgeryType === selectedSurgeryType
    const matchesSpecialty = selectedSpecialty === 'all' || pred.specialty === selectedSpecialty
    return matchesType && matchesSpecialty
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

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Predictive Surgery Demand Analytics</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">AI-powered predictions for surgical demand planning</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">Surgery Type</label>
              <select
                value={selectedSurgeryType}
                onChange={(e) => setSelectedSurgeryType(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="Cardiac Surgery">Cardiac Surgery</option>
                <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                <option value="General Surgery">General Surgery</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="all">All Specialties</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">Forecast Period</label>
              <select
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(Number(e.target.value))}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
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
                <h3 className="font-semibold text-red-900 dark:text-red-300">Error loading analytics</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                icon={TrendingUp}
                title="Total Predicted Demand"
                value={filteredPredictions.reduce((sum, p) => sum + p.predictedDemand, 0)}
                subtitle={`${filteredPredictions.length} predictions`}
                color="blue"
              />
              <StatCard
                icon={Target}
                title="Avg Confidence"
                value={`${Math.round(filteredPredictions.reduce((sum, p) => sum + p.confidenceLevel, 0) / filteredPredictions.length * 100)}%`}
                subtitle="Prediction accuracy"
                color="green"
              />
              <StatCard
                icon={BarChart3}
                title="Surgery Types"
                value={new Set(filteredPredictions.map(p => p.surgeryType)).size}
                subtitle="Unique types"
                color="purple"
              />
              <StatCard
                icon={Calendar}
                title="Forecast Period"
                value={`${forecastPeriod} days`}
                subtitle="Looking ahead"
                color="orange"
              />
            </div>

            {/* Predictions Table */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Demand Predictions</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Hospital</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Surgery Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Predicted Demand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Factors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {filteredPredictions.map((prediction) => (
                      <tr key={prediction.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {prediction.hospitalName || 'State-wide'}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{prediction.stateCode}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">{prediction.surgeryType}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-900 dark:text-white">{prediction.specialty}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                            {prediction.predictedDemand}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">over {prediction.forecastPeriodDays} days</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  prediction.confidenceLevel >= 0.8 ? 'bg-green-500' :
                                  prediction.confidenceLevel >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${prediction.confidenceLevel * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {Math.round(prediction.confidenceLevel * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                            <div>Trend: {prediction.factors.historicalTrend}</div>
                            <div>Seasonal: {prediction.factors.seasonalFactor > 1 ? '+' : ''}{Math.round((prediction.factors.seasonalFactor - 1) * 100)}%</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Historical Chart Placeholder */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Historical Demand Trend</h2>
              <div className="h-64 flex items-center justify-center bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                <div className="text-center text-neutral-500 dark:text-neutral-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Chart visualization would go here</p>
                  <p className="text-sm mt-1">Integration with charting library needed</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}

