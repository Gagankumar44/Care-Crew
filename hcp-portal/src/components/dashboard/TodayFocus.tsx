'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Activity, Moon } from 'lucide-react'
import { getTimeBasedGreeting, getMotivationalMessage } from '@/utils/timeGreeting'

interface TodayFocusProps {
  userName?: string
  heartRate?: number
  sleep?: string
}

export default function TodayFocus({ 
  userName = "Glav!on",
  heartRate = 72,
  sleep = "81%"
}: TodayFocusProps) {
  const greeting = getTimeBasedGreeting(userName)
  const sleepNumber = parseInt(sleep.replace('%', ''))
  const motivationalMsg = getMotivationalMessage(heartRate, sleepNumber)
  
  return (
    <motion.div 
      className="glass-card focus-card p-10 w-full mb-8 rounded-[24px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="focus-content">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {greeting.message} {greeting.emoji}
        </h2>
        <p className="text-white/60 text-sm mb-4">
          {greeting.subtext}
        </p>
        <p className="focus-summary text-lg text-white/90 leading-relaxed">
          Your <strong className="font-semibold">heart rate</strong> is a healthy <strong className="font-semibold">{heartRate} bpm</strong>, 
          and you achieved <strong className="font-semibold">{sleep} sleep quality</strong>. {motivationalMsg}
        </p>
      </div>
      
      {/* This is the visual part - now with health icons */}
      <div className="focus-visual">
        <motion.div
          className="flex flex-col items-center justify-center gap-3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart className="w-16 h-16 text-red-400" fill="currentColor" />
          </motion.div>
          <div className="flex gap-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            >
              <Activity className="w-8 h-8 text-green-400" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6
              }}
            >
              <Moon className="w-8 h-8 text-blue-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
