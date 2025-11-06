'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface NotificationBadgeProps {
  count: number
  pulse?: boolean
}

export function NotificationBadge({ count, pulse = true }: NotificationBadgeProps) {
  if (count <= 0) return null

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-2 -right-2 z-10"
    >
      <motion.div
        animate={pulse ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Glow effect */}
        {pulse && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-red-500 rounded-full blur-md"
          />
        )}
        
        {/* Badge */}
        <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-lg border border-red-400">
          {count > 99 ? '99+' : count}
        </div>
      </motion.div>
    </motion.div>
  )
}

