'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  type?: 'card' | 'stat' | 'action' | 'wellness'
}

export function SkeletonLoader({ type = 'card' }: SkeletonLoaderProps) {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)',
    backgroundSize: '200% 100%',
  }

  if (type === 'stat') {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <motion.div
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={shimmer}
          className="h-3 w-20 bg-white/10 rounded mb-2"
        />
        <motion.div
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.1 }}
          style={shimmer}
          className="h-8 w-16 bg-white/10 rounded mb-2"
        />
        <motion.div
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.2 }}
          style={shimmer}
          className="h-2 w-24 bg-white/10 rounded"
        />
      </div>
    )
  }

  if (type === 'action') {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <motion.div
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={shimmer}
          className="h-12 w-12 bg-white/10 rounded-xl mb-4"
        />
        <motion.div
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.1 }}
          style={shimmer}
          className="h-5 w-32 bg-white/10 rounded mb-2"
        />
        <motion.div
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.2 }}
          style={shimmer}
          className="h-4 w-24 bg-white/10 rounded"
        />
      </div>
    )
  }

  if (type === 'wellness') {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={shimmer}
            className="w-12 h-12 bg-white/10 rounded-xl"
          />
          <div className="flex-1">
            <motion.div
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.1 }}
              style={shimmer}
              className="h-4 w-20 bg-white/10 rounded mb-2"
            />
            <motion.div
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.2 }}
              style={shimmer}
              className="h-3 w-16 bg-white/10 rounded"
            />
          </div>
        </div>
        <motion.div
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.3 }}
          style={shimmer}
          className="h-2 w-full bg-white/10 rounded-full"
        />
      </div>
    )
  }

  // Default card skeleton
  return (
    <div className="glass-card p-10 w-full rounded-[24px]">
      <motion.div
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={shimmer}
        className="h-8 w-48 bg-white/10 rounded mb-4"
      />
      <motion.div
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.1 }}
        style={shimmer}
        className="h-4 w-full bg-white/10 rounded mb-2"
      />
      <motion.div
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.2 }}
        style={shimmer}
        className="h-4 w-3/4 bg-white/10 rounded"
      />
    </div>
  )
}

