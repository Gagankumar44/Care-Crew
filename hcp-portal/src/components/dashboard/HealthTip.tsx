'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, X } from 'lucide-react'

const healthTips = [
  "💧 Drink at least 8 glasses of water daily to stay hydrated.",
  "🏃 Take a 10-minute walk after meals to aid digestion.",
  "😴 Aim for 7-9 hours of quality sleep each night.",
  "🥗 Include colorful vegetables in every meal for better nutrition.",
  "🧘 Practice deep breathing for 5 minutes to reduce stress.",
  "📱 Take regular screen breaks every 20 minutes.",
  "🌞 Get 15 minutes of sunlight daily for vitamin D.",
  "🤸 Stretch for 5 minutes after waking up.",
]

export function HealthTip() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentTip, setCurrentTip] = useState('')

  useEffect(() => {
    // Select a random tip on mount
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)]
    setCurrentTip(randomTip)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-5 border border-green-500/30 overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 animate-pulse" />
        
        {/* Content */}
        <div className="relative flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <Lightbulb className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">
              💡 Daily Health Tip
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {currentTip}
            </p>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
            aria-label="Dismiss health tip"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

