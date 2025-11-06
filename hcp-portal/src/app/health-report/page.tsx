'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { FileText, Download, Share2, AlertCircle, CheckCircle, Clock, TrendingUp, Heart, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface HealthReport {
  riskLevel: 'Low' | 'Moderate' | 'High'
  score: number
  summary: string
  symptoms: Array<{ name: string; severity: string; duration: string }>
  vitals: {
    heartRate: number
    temperature: number
    bloodPressure: string
  }
  recommendations: string[]
  nextSteps: string[]
  generatedAt: Date
}

export default function HealthReportPage() {
  const [report] = useState<HealthReport>({
    riskLevel: 'Moderate',
    score: 65,
    summary: 'Based on your symptoms and vitals, you may benefit from medical consultation. Your heart rate and temperature are within normal ranges, but your reported symptoms suggest monitoring is recommended.',
    symptoms: [
      { name: 'Headache', severity: 'Moderate', duration: '2 days' },
      { name: 'Fatigue', severity: 'Mild', duration: '3 days' },
    ],
    vitals: {
      heartRate: 72,
      temperature: 98.6,
      bloodPressure: '120/80',
    },
    recommendations: [
      'Stay hydrated - drink at least 8 glasses of water daily',
      'Get adequate rest - aim for 7-9 hours of sleep',
      'Monitor symptoms closely for any worsening',
    ],
    nextSteps: [
      'Schedule a consultation with your primary care physician',
      'Consider over-the-counter pain relief if symptoms persist',
      'Return for follow-up if symptoms worsen or new symptoms appear',
    ],
    generatedAt: new Date(),
  })

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Moderate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDownload = () => {
    // Generate PDF report
    const reportContent = `
HEALTH REPORT - MediAR
Generated: ${report.generatedAt.toLocaleString()}

RISK ASSESSMENT
Risk Level: ${report.riskLevel}
Score: ${report.score}/100

SUMMARY
${report.summary}

SYMPTOMS
${report.symptoms.map(s => `- ${s.name}: ${s.severity} (${s.duration})`).join('\n')}

VITALS
Heart Rate: ${report.vitals.heartRate} bpm
Temperature: ${report.vitals.temperature}°F
Blood Pressure: ${report.vitals.bloodPressure} mmHg

RECOMMENDATIONS
${report.recommendations.map(r => `- ${r}`).join('\n')}

NEXT STEPS
${report.nextSteps.map(s => `- ${s}`).join('\n')}

This report is for informational purposes only and does not constitute medical advice.
Please consult with a healthcare provider for professional medical diagnosis and treatment.
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Health Report
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Comprehensive health assessment and recommendations
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Risk Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${getRiskColor(report.riskLevel)}`}>
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Risk Assessment
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Generated {report.generatedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`px-4 py-2 rounded-full font-semibold ${getRiskColor(report.riskLevel)}`}>
                {report.riskLevel} Risk
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {report.score}/100
              </div>
            </div>
          </div>
          
          {/* Risk Score Bar */}
          <div className="mt-4">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${
                  report.riskLevel === 'Low' ? 'bg-green-500' :
                  report.riskLevel === 'Moderate' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Health Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {report.summary}
          </p>
        </motion.div>

        {/* Symptoms & Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Symptoms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Reported Symptoms
            </h2>
            <div className="space-y-3">
              {report.symptoms.map((symptom, idx) => (
                <div key={idx} className="p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {symptom.name}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      symptom.severity === 'Mild' ? 'bg-green-100 text-green-700' :
                      symptom.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {symptom.severity}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Duration: {symptom.duration}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vitals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Vital Signs
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-gray-900 dark:text-white">Heart Rate</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {report.vitals.heartRate} bpm
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-900 dark:text-white">Temperature</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {report.vitals.temperature}°F
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">Blood Pressure</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {report.vitals.bloodPressure}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recommendations
          </h2>
          <ul className="space-y-3">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Suggested Next Steps
          </h2>
          <ul className="space-y-3">
            {report.nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{step}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-4">
            <Link
              href="/appointments/new"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex-1 text-center"
            >
              Schedule Appointment
            </Link>
            <Link
              href="/doctors"
              className="px-6 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex-1 text-center"
            >
              Find a Doctor
            </Link>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 p-4">
          <p>
            This health report is generated based on self-reported symptoms and vital measurements.
            It does not replace professional medical diagnosis. Please consult with a healthcare provider
            for accurate diagnosis and treatment.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}

