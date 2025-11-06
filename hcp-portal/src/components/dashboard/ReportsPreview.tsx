'use client'

import React from 'react'
import { FileText, Image, Scan, File, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Report {
  id: string
  name: string
  type: 'pdf' | 'image' | 'scan'
  date: string
  thumbnail?: string
}

const reports: Report[] = [
  { id: '1', name: 'Blood Test Results', type: 'pdf', date: '2 days ago' },
  { id: '2', name: 'X-Ray Chest', type: 'image', date: '1 week ago' },
  { id: '3', name: 'MRI Scan', type: 'scan', date: '2 weeks ago' },
]

const iconMap = {
  pdf: FileText,
  image: Image,
  scan: Scan,
}

export function ReportsPreview() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Reports
        </h2>
        <Link
          href="/reports"
          className="text-sm text-primary hover:underline whitespace-nowrap"
        >
          View All →
        </Link>
      </div>
      <div className="space-y-3">
        {reports.map((report, index) => {
          const Icon = iconMap[report.type]
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/20 dark:border-white/10 hover:bg-blue-500/15 transition-colors cursor-pointer group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {report.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>{report.date}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

