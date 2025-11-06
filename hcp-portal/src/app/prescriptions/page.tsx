'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { FileText, Download, ShoppingCart, Clock, Pill, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { mockPrescriptions } from '@/data/mockData'
import type { Prescription } from '@/data/mockData'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function PrescriptionsPage() {
  const [prescriptions] = useState<Prescription[]>(mockPrescriptions)

  const handleDownloadPDF = (prescription: Prescription) => {
    // In production, this would generate and download a PDF
    alert(`Downloading prescription PDF for ${prescription.doctorName}...`)
    // Simulate PDF generation
    const pdfContent = `
      PRESCRIPTION
      Doctor: ${prescription.doctorName}
      Specialty: ${prescription.doctorSpecialty}
      Date: ${prescription.date}
      
      MEDICATIONS:
      ${prescription.medicines.map(m => 
        `${m.name} - ${m.dosage} - ${m.frequency} for ${m.duration}\n${m.instructions}`
      ).join('\n\n')}
      
      INSTRUCTIONS: ${prescription.instructions}
      ${prescription.followUpDate ? `Follow-up: ${prescription.followUpDate}` : ''}
    `
    console.log('PDF Content:', pdfContent)
  }

  const handleOrderMedicine = (medicine: any) => {
    // In production, this would redirect to pharmacy partner
    window.open('https://example.com/pharmacy', '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600 dark:text-green-400'
      case 'completed':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
      case 'expired':
        return 'bg-red-500/10 text-red-600 dark:text-red-400'
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
              E-Prescriptions
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              View and manage your prescriptions, download PDFs, and order medicines
            </p>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {prescriptions.map((prescription, index) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              {/* Prescription Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-primary" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {prescription.doctorName}
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {prescription.doctorSpecialty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Date: {prescription.date}</span>
                    </div>
                    {prescription.followUpDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Follow-up: {prescription.followUpDate}</span>
                      </div>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                      {prescription.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownloadPDF(prescription)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* Medicines List */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Medications
                </h3>
                <div className="space-y-4">
                  {prescription.medicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="p-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-white/20 dark:border-white/10"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {medicine.name}
                            </h4>
                            {medicine.available ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <div>
                              <span className="font-medium">Dosage:</span> {medicine.dosage}
                            </div>
                            <div>
                              <span className="font-medium">Frequency:</span> {medicine.frequency}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {medicine.duration}
                            </div>
                            {medicine.pharmacyPrice && (
                              <div>
                                <span className="font-medium">Price:</span> ₹{medicine.pharmacyPrice}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                            <span className="font-medium">Instructions:</span> {medicine.instructions}
                          </p>
                        </div>
                        {medicine.available && medicine.pharmacyPrice && (
                          <Button
                            onClick={() => handleOrderMedicine(medicine)}
                            className="flex items-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Order Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Doctor's Instructions
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {prescription.instructions}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {prescriptions.length === 0 && (
          <div className="glass-card p-12 text-center">
            <FileText className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Prescriptions Yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Your prescriptions will appear here after consultations
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

