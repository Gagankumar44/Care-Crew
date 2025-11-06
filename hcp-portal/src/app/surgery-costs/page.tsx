'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Search, DollarSign, TrendingUp, Filter, AlertCircle } from 'lucide-react'
import { mockSurgeryCosts, SurgeryCost } from '@/data/mockData'
import { motion } from 'framer-motion'

export default function SurgeryCostsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = Array.from(new Set(mockSurgeryCosts.map(s => s.category)))

  const filteredCosts = mockSurgeryCosts.filter(surgery => {
    const matchesSearch = 
      surgery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surgery.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || surgery.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Surgery Cost Estimates
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Get estimated costs for common surgeries (Basic estimates only)
          </p>
        </div>

        {/* Disclaimer */}
        <div className="glass-card p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Disclaimer:</strong> These are approximate cost estimates and may vary based on hospital, location, 
              patient condition, and other factors. Actual costs may differ. Please consult with healthcare providers for accurate pricing.
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search surgeries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-neutral-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Surgery Costs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCosts.map((surgery) => (
            <SurgeryCostCard key={surgery.id} surgery={surgery} formatCurrency={formatCurrency} />
          ))}
        </div>

        {filteredCosts.length === 0 && (
          <div className="glass-card p-12 text-center">
            <DollarSign className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No surgeries found</p>
            <p className="text-neutral-400 text-sm mt-2">Try adjusting your search</p>
          </div>
        )}

        {/* Info */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About Cost Estimates</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Cost estimates include basic surgical procedure costs. Additional costs may apply for:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Pre-operative consultations and tests</li>
            <li>Anesthesia charges</li>
            <li>Hospital stay (room charges)</li>
            <li>Post-operative care and medications</li>
            <li>Follow-up consultations</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}

function SurgeryCostCard({ surgery, formatCurrency }: { surgery: SurgeryCost, formatCurrency: (amount: number) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 hover:shadow-glass-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {surgery.name}
          </h3>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {surgery.category}
          </span>
        </div>
        <DollarSign className="w-6 h-6 text-primary" />
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Average Cost</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(surgery.avgCost)}
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Cost Range</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500">Min</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(surgery.costRange.min)}
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary-600"
                  style={{ 
                    width: `${((surgery.avgCost - surgery.costRange.min) / (surgery.costRange.max - surgery.costRange.min)) * 100}%` 
                  }}
                />
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">Max</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(surgery.costRange.max)}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
            Compare Hospitals
          </button>
        </div>
      </div>
    </motion.div>
  )
}

