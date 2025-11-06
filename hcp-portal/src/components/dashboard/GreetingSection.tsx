'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

interface GreetingSectionProps {
  userName?: string
}

const motivationalMessages = [
  "Take care of your body. It's the only place you have to live.",
  "Health is a state of complete harmony of the body, mind and spirit.",
  "Your health is an investment, not an expense.",
  "The greatest wealth is health.",
]

export function GreetingSection({ userName = 'Patient' }: GreetingSectionProps) {
  const [message, setMessage] = useState<string>(motivationalMessages[0])
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState<string>('Welcome back')

  useEffect(() => {
    setMounted(true)
    // Set random message only on client side to avoid hydration mismatch
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
    setMessage(motivationalMessages[randomIndex])
    
    // Set time-of-day greeting
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon')
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good evening')
    } else {
      setGreeting('Good night')
    }
  }, [])

  // Use first message during SSR to match initial render
  const displayMessage = mounted ? message : motivationalMessages[0]
  const displayGreeting = mounted ? greeting : 'Welcome back'

  return (
    <div className="relative mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5" />

        {/* Floating sparkles */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-8 h-8 text-blue-400/30" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {displayGreeting},{' '}
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {userName}
                </span>
                👋
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {displayMessage}
              </p>
            </div>

            {/* Floating heart icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-pink-400/20 blur-2xl rounded-full" />
                <Heart className="relative w-16 h-16 text-pink-500 fill-pink-500" />
              </div>
            </motion.div>
          </div>

          {/* Health status badge */}
          <div className="flex items-center gap-2 mt-6">
            <div className="flex -space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              All systems optimal
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}