'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Moon, Pill } from 'lucide-react'

interface TodaysFocusHeroProps {
  userName?: string
  heartRate?: number
  sleepQuality?: number
  nextFocus?: string
}

/**
 * Animated Abstract Graphic Component
 * Inspired by Stripe/Linear homepage animations
 */
function AnimatedAbstractGraphic() {
  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-green-500/40 via-teal-500/40 to-blue-500/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-orange-500/30 rounded-full blur-2xl"
      />

      {/* Animated mesh gradient */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mesh-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="50%" stopColor="rgba(147, 51, 234, 0.2)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
          </linearGradient>
          <linearGradient id="mesh-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
            <stop offset="50%" stopColor="rgba(20, 184, 166, 0.2)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
          </linearGradient>
        </defs>
        
        {/* Animated mesh shapes */}
        <motion.path
          d="M 100 50 Q 200 100 300 50 T 400 50"
          fill="none"
          stroke="url(#mesh-gradient-1)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.path
          d="M 50 150 Q 150 100 250 150 T 350 150"
          fill="none"
          stroke="url(#mesh-gradient-2)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
        />
        <motion.path
          d="M 150 250 Q 250 200 350 250"
          fill="none"
          stroke="url(#mesh-gradient-1)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
        />
      </svg>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}

export function TodaysFocusHero({
  userName = 'Patient',
  heartRate = 72,
  sleepQuality = 81,
  nextFocus = 'Medication',
}: TodaysFocusHeroProps) {
  const [greeting, setGreeting] = useState('Good Morning')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon')
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good Evening')
    } else {
      setGreeting('Good Night')
    }
  }, [])

  // Determine health status message
  const getHealthStatus = () => {
    const isHealthyHeartRate = heartRate >= 60 && heartRate <= 100
    const isGoodSleep = sleepQuality >= 70
    
    if (isHealthyHeartRate && isGoodSleep) {
      return 'healthy'
    }
    return 'normal'
  }

  const healthStatus = getHealthStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800/90 via-neutral-800/80 to-neutral-900/90 backdrop-blur-xl border border-neutral-700/50 shadow-2xl"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              {mounted ? greeting : 'Good Morning'},{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {userName}
              </span>
              .
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl lg:text-2xl text-neutral-300 leading-relaxed max-w-3xl"
            >
              Your heart rate is a{' '}
              <span className="font-semibold text-green-400">{healthStatus} {heartRate} bpm</span>
              , and you achieved{' '}
              <span className="font-semibold text-blue-400">{sleepQuality}% sleep quality</span>
              . Great job.{' '}
              <span className="inline-flex items-center gap-2">
                Your next focus is{' '}
                <span className="font-semibold text-purple-400 inline-flex items-center gap-1">
                  <Pill className="w-5 h-5 inline" />
                  {nextFocus}
                </span>
                .
              </span>
            </motion.p>
          </div>

          {/* Right Animated Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-full lg:w-[40%] xl:w-[35%] flex-shrink-0 h-[200px] lg:h-[250px]"
          >
            <AnimatedAbstractGraphic />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

