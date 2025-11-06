'use client'

import { motion } from 'framer-motion'
import { Clock, TrendingUp, AlertCircle } from 'lucide-react'

interface SymptomEntry {
  id: string
  date: Date
  symptoms: Array<{ name: string; severity: string }>
  painLevel: number
  notes?: string
}

interface SymptomTimelineProps {
  entries: SymptomEntry[]
}

export function SymptomTimeline({ entries }: SymptomTimelineProps) {
  const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Symptom History Timeline
      </h2>
      
      {sortedEntries.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No symptom entries yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700" />
          
          <div className="space-y-6">
            {sortedEntries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-900">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 glass-card p-4 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(entry.date)}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatTime(entry.date)}
                      </p>
                    </div>
                    {entry.painLevel > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
                        <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">
                          Pain: {entry.painLevel}/10
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Symptoms List */}
                  <div className="space-y-2 mb-3">
                    {entry.symptoms.map((symptom, symptomIdx) => (
                      <div
                        key={symptomIdx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          symptom.severity === 'Mild' ? 'bg-green-500' :
                          symptom.severity === 'Moderate' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>{symptom.name}</strong> - {symptom.severity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {entry.notes && (
                    <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

