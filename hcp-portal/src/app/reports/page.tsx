'use client'

import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Upload, FileText, Image, Scan, File } from 'lucide-react'
import Link from 'next/link'

export default function ReportsPage() {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reports & Scans
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Upload and manage your medical reports, scans, and documents
          </p>
        </div>

        <div className="glass-card p-8 text-center">
          <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Upload Your Reports
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Upload PDFs, MRIs, X-Rays, or other medical documents for AI analysis
          </p>
          <button className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            Upload Report
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6">
                <FileText className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Medical Report {i}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Uploaded 2 days ago
                </p>
                <button className="text-sm text-primary hover:underline">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

