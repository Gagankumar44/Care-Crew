'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Wallet, Upload, FileText, Share2, Eye, Download, Sparkles, Shield, Search, Filter, Calendar } from 'lucide-react'
import { mockHealthDocuments } from '@/data/mockData'
import type { HealthDocument } from '@/data/mockData'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

type FilterType = 'all' | 'report' | 'prescription' | 'scan' | 'lab-result' | 'vaccination'

export default function HealthWalletPage() {
  const [documents] = useState<HealthDocument[]>(mockHealthDocuments)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<HealthDocument | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.type === filter
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.pdf'
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        alert(`Uploading ${files.length} file(s)... AI analysis will be available shortly.`)
        // In production, upload to server and process with OCR/AI
      }
    }
    input.click()
  }

  const handleShare = (doc: HealthDocument) => {
    setSelectedDoc(doc)
    setShowShareModal(true)
  }

  const handleDownload = (doc: HealthDocument) => {
    alert(`Downloading ${doc.name}...`)
  }

  const handleView = (doc: HealthDocument) => {
    alert(`Opening ${doc.name}...`)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report':
        return FileText
      case 'prescription':
        return FileText
      case 'scan':
        return FileText
      case 'lab-result':
        return FileText
      case 'vaccination':
        return Shield
      default:
        return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'report':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
      case 'prescription':
        return 'bg-green-500/10 text-green-600 dark:text-green-400'
      case 'scan':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
      case 'lab-result':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
      case 'vaccination':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400'
    }
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Health Wallet
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Secure health records vault with AI-powered insights and OCR
            </p>
          </div>
          <Button
            onClick={handleUpload}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Documents
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
              </div>
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Reports</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {documents.filter(d => d.type === 'report').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {documents.filter(d => d.type === 'prescription').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Lab Results</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {documents.filter(d => d.type === 'lab-result').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="report">Reports</option>
                <option value="prescription">Prescriptions</option>
                <option value="scan">Scans</option>
                <option value="lab-result">Lab Results</option>
                <option value="vaccination">Vaccinations</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc, index) => {
            const TypeIcon = getTypeIcon(doc.type)
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${getTypeColor(doc.type)}`}>
                      <TypeIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {doc.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span>{doc.uploadDate}</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium">Size:</span> {doc.fileSize}
                  </div>
                  {doc.sharedWith && doc.sharedWith.length > 0 && (
                    <div className="text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Shared with:</span> {doc.sharedWith.join(', ')}
                    </div>
                  )}
                </div>

                {/* AI Summary */}
                {doc.aiSummary && (
                  <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">AI Summary</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {doc.aiSummary}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleView(doc)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    onClick={() => handleDownload(doc)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    onClick={() => handleShare(doc)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Wallet className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Documents Found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Upload your first health document to get started'}
            </p>
            {!searchQuery && filter === 'all' && (
              <Button onClick={handleUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            )}
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedDoc && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Share {selectedDoc.name}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Share with Doctor/Hospital
                  </label>
                  <input
                    type="text"
                    placeholder="Search doctors or hospitals..."
                    className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Generate Share Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="https://mediar.app/share/abc123"
                      className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                    />
                    <Button variant="outline">
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowShareModal(false)} className="flex-1">
                    Share
                  </Button>
                  <Button
                    onClick={() => {
                      setShowShareModal(false)
                      setSelectedDoc(null)
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

