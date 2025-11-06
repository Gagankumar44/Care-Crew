'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Activity, Heart, FileText, Pill, TrendingUp, Calendar, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

type TabType = 'vitals' | 'reports' | 'medications'

const vitalsData = [
  { date: 'Jan', bloodPressure: '120/80', heartRate: 72, temperature: 98.6, weight: 150 },
  { date: 'Feb', bloodPressure: '118/78', heartRate: 70, temperature: 98.4, weight: 149 },
  { date: 'Mar', bloodPressure: '122/82', heartRate: 75, temperature: 98.7, weight: 151 },
  { date: 'Apr', bloodPressure: '119/79', heartRate: 73, temperature: 98.5, weight: 150 },
  { date: 'May', bloodPressure: '121/80', heartRate: 74, temperature: 98.6, weight: 150 },
]

const chartData = vitalsData.map((v, i) => ({
  name: v.date,
  heartRate: v.heartRate,
  weight: v.weight,
}))

const medications = [
  { id: '1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2024-01-15', prescriber: 'Dr. Sarah Johnson' },
  { id: '2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2024-02-01', prescriber: 'Dr. Sarah Johnson' },
  { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', startDate: '2024-01-20', prescriber: 'Dr. Sarah Johnson' },
]

const reports = [
  { id: '1', name: 'Complete Blood Count', date: '2024-04-15', status: 'Normal', doctor: 'Dr. Sarah Johnson' },
  { id: '2', name: 'Lipid Panel', date: '2024-04-15', status: 'Normal', doctor: 'Dr. Sarah Johnson' },
  { id: '3', name: 'Chest X-Ray', date: '2024-03-20', status: 'Normal', doctor: 'Dr. Michael Chen' },
]

export default function HealthDataPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vitals')

  const tabs = [
    { id: 'vitals' as TabType, label: 'Vitals', icon: Activity },
    { id: 'reports' as TabType, label: 'Lab Reports', icon: FileText },
    { id: 'medications' as TabType, label: 'Medications', icon: Pill },
  ]

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Health Data</h1>
          <p className="text-neutral-600">Track your health metrics and medical records</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Vitals Tab */}
        {activeTab === 'vitals' && (
          <div className="space-y-6">
            {/* Current Vitals Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-glass"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-neutral-600">Blood Pressure</h3>
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">121/80</p>
                <p className="text-xs text-success-600 mt-2">Normal</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-glass"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-neutral-600">Heart Rate</h3>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-gray-900">74 bpm</p>
                <p className="text-xs text-success-600 mt-2">Normal</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-glass"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-neutral-600">Temperature</h3>
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">98.6°F</p>
                <p className="text-xs text-success-600 mt-2">Normal</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-glass"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-neutral-600">Weight</h3>
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">150 lbs</p>
                <p className="text-xs text-neutral-500 mt-2">Last updated: Today</p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="heartRate" stroke="#0057D9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="weight" fill="#00A6A6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-glass"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {report.date}
                        </span>
                        <span>{report.doctor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-success-50 text-success-700 rounded-full text-sm font-medium">
                      {report.status}
                    </span>
                    <button className="px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50">
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <div className="space-y-4">
            {medications.map((med) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-glass"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Pill className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{med.name}</h3>
                      <div className="space-y-1 text-sm text-neutral-600">
                        <p>Dosage: {med.dosage}</p>
                        <p>Frequency: {med.frequency}</p>
                        <p className="text-neutral-500">Prescribed by: {med.prescriber}</p>
                        <p className="text-neutral-500">Started: {med.startDate}</p>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50">
                    Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

