'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scan, Camera, Upload, X, Sparkles, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function FloatingARScanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [scanMode, setScanMode] = useState<'ar' | 'photo' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleQuickScan = (mode: 'ar' | 'photo') => {
    setScanMode(mode)
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
      // Navigate to AR scan page with uploaded image
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        // Store in sessionStorage for AR scan page to use
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

      <motion.div
        className="fixed bottom-24 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 mb-2 glass-card p-5 min-w-[280px] shadow-glass-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Scan className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    AR Scanner
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickScan('ar')}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      AR Scan
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickScan('photo')}
                  className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 hover:border-green-500/40 transition-all group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Upload Photo
                    </span>
                  </div>
                </motion.button>
              </div>

              {/* Scanner Preview Area */}
              <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10">
                <div className="aspect-video bg-neutral-700/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Scanner Grid Overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  {/* Center Target */}
                  <div className="relative z-10">
                    <div className="w-24 h-24 border-2 border-purple-400 rounded-lg flex items-center justify-center">
                      <Scan className="w-8 h-8 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mt-2 text-center">
                  Point camera at area to scan
                </p>
              </div>

              {/* Scan Options */}
              <div className="space-y-2">
                <Link
                  href="/ar-scan?type=skin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                    <ImageIcon className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Skin Analysis</p>
                    <p className="text-xs text-neutral-500">AI-powered skin check</p>
                  </div>
                </Link>

                <Link
                  href="/ar-scan?type=rom"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Scan className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">ROM Analysis</p>
                    <p className="text-xs text-neutral-500">Range of motion test</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white rounded-full shadow-glass-lg flex items-center justify-center hover:scale-110 transition-transform relative overflow-hidden group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Scanner Pulse Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: '2s' }} />
          
          {isOpen ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <Scan className="w-6 h-6 relative z-10" />
          )}
        </motion.button>
      </motion.div>
    </>
  )
}

