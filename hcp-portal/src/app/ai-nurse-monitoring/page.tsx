'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Activity, Heart, Thermometer, AlertCircle, Bell, Camera, Radio, RadioIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { mockVitalReadings } from '@/data/mockData'
import type { VitalReading } from '@/data/mockData'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function AINurseMonitoringPage() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [vitals, setVitals] = useState<VitalReading[]>(mockVitalReadings)
  const [alerts, setAlerts] = useState<string[]>([])

  useEffect(() => {
    if (isMonitoring) {
      // Simulate live vitals updates
      const interval = setInterval(() => {
        setVitals(prev => prev.map(vital => ({
          ...vital,
          value: vital.type === 'heart-rate' 
            ? Math.floor(Math.random() * 20) + 65 // 65-85 bpm
            : vital.type === 'blood-pressure'
            ? `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`
            : vital.value,
          timestamp: new Date().toISOString(),
        })))
      }, 5000) // Update every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
    if (!isMonitoring) {
      setAlerts([])
    }
  }

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'heart-rate':
        return Heart
      case 'blood-pressure':
        return Activity
      case 'temperature':
        return Thermometer
      case 'stress':
        return AlertCircle
      case 'oxygen':
        return Activity
      default:
        return Activity
    }
  }

  const getVitalColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-500'
      case 'warning':
        return 'text-yellow-500'
      case 'critical':
        return 'text-red-500'
      default:
        return 'text-neutral-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500/10 border-green-500/20'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'critical':
        return 'bg-red-500/10 border-red-500/20'
      default:
        return 'bg-neutral-500/10 border-neutral-500/20'
    }
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              24x7 AI-Nurse Monitoring
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Live health monitoring with camera, sensors, and wearable integration
            </p>
          </div>
          <Button
            onClick={handleToggleMonitoring}
            className={`flex items-center gap-2 ${
              isMonitoring ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
          >
            {isMonitoring ? (
              <>
                <RadioIcon className="w-4 h-4" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                Start Monitoring
              </>
            )}
          </Button>
        </div>

        {/* Monitoring Status */}
        {isMonitoring && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 bg-primary/5 border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Radio className="w-6 h-6 text-primary animate-pulse" />
                <div className="absolute inset-0 w-6 h-6 border-2 border-primary rounded-full animate-ping opacity-75" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Live Monitoring Active
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Real-time vitals tracking enabled. Alerts will be triggered if anomalies are detected.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="glass-card p-6 bg-red-500/5 border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-600 dark:text-red-400">
                Active Alerts
              </h3>
            </div>
            <ul className="space-y-2">
              {alerts.map((alert, index) => (
                <li key={index} className="text-sm text-red-600 dark:text-red-400">
                  • {alert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vitals.map((vital, index) => {
            const VitalIcon = getVitalIcon(vital.type)
            return (
              <motion.div
                key={vital.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-6 ${getStatusColor(vital.status)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${getStatusColor(vital.status)}`}>
                      <VitalIcon className={`w-6 h-6 ${getVitalColor(vital.status)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                        {vital.type.replace('-', ' ')}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Last updated: {new Date(vital.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vital.status)}`}>
                    {vital.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getVitalColor(vital.status)}`}>
                    {vital.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {vital.unit}
                  </div>
                  {vital.alert && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                      ⚠️ {vital.alert}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Monitoring Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Camera Monitoring */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Camera Monitoring
              </h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Face vitals check and stress detection using camera
            </p>
            <Button variant="outline" className="w-full">
              Start Camera Analysis
            </Button>
          </div>

          {/* Medicine Reminders */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Medicine Reminders
              </h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Set up automated medication reminders
            </p>
            <Button variant="outline" className="w-full">
              Configure Reminders
            </Button>
          </div>

          {/* Symptom Recheck */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Symptom Recheck
              </h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Periodic symptom assessment and tracking
            </p>
            <Button variant="outline" className="w-full">
              Start Assessment
            </Button>
          </div>

          {/* Emergency Contacts */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Emergency Alert
              </h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Automatically alert contacts in case of emergency
            </p>
            <Button variant="outline" className="w-full">
              Configure Contacts
            </Button>
          </div>
        </div>

        {/* Monitoring History */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monitoring History
          </h3>
          <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-800/50">
              <span>Heart rate spike detected</span>
              <span className="text-xs">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-800/50">
              <span>Medicine reminder sent</span>
              <span className="text-xs">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-neutral-800/50">
              <span>Camera vitals check completed</span>
              <span className="text-xs">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

