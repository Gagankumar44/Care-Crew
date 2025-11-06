'use client'

import React, { useState, useRef } from 'react'
import { Scan, Camera, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function MobileARScanner() {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleQuickScan = (mode: 'ar' | 'photo') => {
    if (mode === 'ar') {
      router.push('/ar-scan?type=skin')
      setIsOpen(false)
    } else if (mode === 'photo') {
      fileInputRef.current?.click()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        sessionStorage.setItem('uploadedImage', base64)
        router.push('/ar-scan?type=skin&uploaded=true')
        setIsOpen(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Mobile: Show as button in header or bottom bar */}
      <div className="md:hidden">
        {isOpen ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 dark:border-white/10 p-4 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">AR Scanner</h3>
                <button onClick={() => setIsOpen(false)} className="p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickScan('ar')}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                >
                  <Scan className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">AR Scan</span>
                </button>
                <button
                  onClick={() => handleQuickScan('photo')}
                  className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20"
                >
                  <Camera className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Upload</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white rounded-full shadow-lg flex items-center justify-center z-50"
          >
            <Scan className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  )
}

