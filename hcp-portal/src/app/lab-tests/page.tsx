'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { TestTube, Calendar, Upload, FileText, CheckCircle, AlertCircle, Clock, MapPin, DollarSign, Sparkles } from 'lucide-react'
import { mockLabTests, mockLabBookings, mockLabResults } from '@/data/mockData'
import type { LabTest, LabBooking, LabResult } from '@/data/mockData'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

type TabType = 'browse' | 'bookings' | 'results'

export default function LabTestsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('browse')
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookings] = useState<LabBooking[]>(mockLabBookings)
  const [results] = useState<LabResult[]>(mockLabResults)

  const handleBookTest = (test: LabTest) => {
    setSelectedTest(test)
    setShowBookingModal(true)
  }

  const handleConfirmBooking = () => {
    alert('Booking confirmed! You will receive a confirmation SMS shortly.')
    setShowBookingModal(false)
    setSelectedTest(null)
  }

  const handleUploadResult = () => {
    // In production, this would open file picker and upload
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.pdf'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        alert(`Uploading ${file.name}... AI analysis will be available shortly.`)
      }
    }
    input.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400'
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 dark:text-red-400'
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400'
    }
  }

  const getValueStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 dark:text-green-400'
      case 'abnormal':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'critical':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-neutral-600 dark:text-neutral-400'
    }
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Lab Tests & Health Scans
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Book diagnostic tests, upload results, and get AI-powered insights
            </p>
          </div>
          <Button
            onClick={handleUploadResult}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Results
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { id: 'browse' as TabType, label: 'Browse Tests', count: mockLabTests.length },
              { id: 'bookings' as TabType, label: 'My Bookings', count: bookings.length },
              { id: 'results' as TabType, label: 'Test Results', count: results.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Browse Tests Tab */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockLabTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <TestTube className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {test.name}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {test.category}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {test.description}
                </p>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Clock className="w-4 h-4" />
                    <span>{test.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{test.preparation}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <DollarSign className="w-4 h-4" />
                    <span>₹{test.price}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleBookTest(test)}
                  className="w-full"
                  disabled={!test.available}
                >
                  {test.available ? 'Book Now' : 'Unavailable'}
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TestTube className="w-6 h-6 text-primary" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {booking.testName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.date} at {booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.labName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.address}</span>
                        </div>
                      </div>
                    </div>
                    {booking.status === 'scheduled' && (
                      <Button variant="outline">
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-card p-12 text-center">
                <Calendar className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Bookings Yet
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Book your first lab test to get started
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.testName}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Date: {result.date}
                    </p>
                  </div>
                </div>

                {/* Test Values */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Test Values
                  </h4>
                  <div className="space-y-3">
                    {result.values.map((value, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Parameter</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{value.parameter}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Value</p>
                            <p className={`font-semibold ${getValueStatusColor(value.status)}`}>
                              {value.value} {value.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Normal Range</p>
                            <p className="text-sm text-gray-900 dark:text-white">{value.normalRange}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              value.status === 'normal' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                              value.status === 'abnormal' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                              'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}>
                              {value.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                {result.aiSummary && (
                  <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">AI Analysis</h4>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {result.aiSummary}
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && (
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Recommendations
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {result.recommendations}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedTest && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Book {selectedTest.name}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Time Slot
                  </label>
                  <select className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary">
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleConfirmBooking} className="flex-1">
                    Confirm Booking
                  </Button>
                  <Button
                    onClick={() => {
                      setShowBookingModal(false)
                      setSelectedTest(null)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

