'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useState, useRef } from 'react'

export interface FeatureTile {
  id: string
  icon: LucideIcon
  iconVariant?: 'filled' | 'outline'
  title: string
  microcopy: string
  description?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'pink' | 'amber' | 'indigo'
  href?: string
  onClick?: () => void
  'aria-label'?: string
  'aria-describedby'?: string
}

interface FeatureTilesProps {
  features: FeatureTile[]
  className?: string
  gridCols?: '3' | '4' | 'auto'
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    icon: 'text-blue-500 dark:text-blue-400',
    iconFilled: 'bg-blue-500 text-white',
    border: 'border-blue-500/20 dark:border-blue-500/30',
    hover: 'hover:bg-blue-500/15 dark:hover:bg-blue-500/25',
    glow: 'shadow-blue-500/20 dark:shadow-blue-500/30',
    focus: 'focus-visible:ring-blue-500/50',
  },
  green: {
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    icon: 'text-green-500 dark:text-green-400',
    iconFilled: 'bg-green-500 text-white',
    border: 'border-green-500/20 dark:border-green-500/30',
    hover: 'hover:bg-green-500/15 dark:hover:bg-green-500/25',
    glow: 'shadow-green-500/20 dark:shadow-green-500/30',
    focus: 'focus-visible:ring-green-500/50',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    icon: 'text-purple-500 dark:text-purple-400',
    iconFilled: 'bg-purple-500 text-white',
    border: 'border-purple-500/20 dark:border-purple-500/30',
    hover: 'hover:bg-purple-500/15 dark:hover:bg-purple-500/25',
    glow: 'shadow-purple-500/20 dark:shadow-purple-500/30',
    focus: 'focus-visible:ring-purple-500/50',
  },
  orange: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    icon: 'text-orange-500 dark:text-orange-400',
    iconFilled: 'bg-orange-500 text-white',
    border: 'border-orange-500/20 dark:border-orange-500/30',
    hover: 'hover:bg-orange-500/15 dark:hover:bg-orange-500/25',
    glow: 'shadow-orange-500/20 dark:shadow-orange-500/30',
    focus: 'focus-visible:ring-orange-500/50',
  },
  red: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    icon: 'text-red-500 dark:text-red-400',
    iconFilled: 'bg-red-500 text-white',
    border: 'border-red-500/20 dark:border-red-500/30',
    hover: 'hover:bg-red-500/15 dark:hover:bg-red-500/25',
    glow: 'shadow-red-500/20 dark:shadow-red-500/30',
    focus: 'focus-visible:ring-red-500/50',
  },
  teal: {
    bg: 'bg-teal-500/10 dark:bg-teal-500/20',
    icon: 'text-teal-500 dark:text-teal-400',
    iconFilled: 'bg-teal-500 text-white',
    border: 'border-teal-500/20 dark:border-teal-500/30',
    hover: 'hover:bg-teal-500/15 dark:hover:bg-teal-500/25',
    glow: 'shadow-teal-500/20 dark:shadow-teal-500/30',
    focus: 'focus-visible:ring-teal-500/50',
  },
  pink: {
    bg: 'bg-pink-500/10 dark:bg-pink-500/20',
    icon: 'text-pink-500 dark:text-pink-400',
    iconFilled: 'bg-pink-500 text-white',
    border: 'border-pink-500/20 dark:border-pink-500/30',
    hover: 'hover:bg-pink-500/15 dark:hover:bg-pink-500/25',
    glow: 'shadow-pink-500/20 dark:shadow-pink-500/30',
    focus: 'focus-visible:ring-pink-500/50',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    icon: 'text-amber-500 dark:text-amber-400',
    iconFilled: 'bg-amber-500 text-white',
    border: 'border-amber-500/20 dark:border-amber-500/30',
    hover: 'hover:bg-amber-500/15 dark:hover:bg-amber-500/25',
    glow: 'shadow-amber-500/20 dark:shadow-amber-500/30',
    focus: 'focus-visible:ring-amber-500/50',
  },
  indigo: {
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    icon: 'text-indigo-500 dark:text-indigo-400',
    iconFilled: 'bg-indigo-500 text-white',
    border: 'border-indigo-500/20 dark:border-indigo-500/30',
    hover: 'hover:bg-indigo-500/15 dark:hover:bg-indigo-500/25',
    glow: 'shadow-indigo-500/20 dark:shadow-indigo-500/30',
    focus: 'focus-visible:ring-indigo-500/50',
  },
}

function FeatureTileCard({ 
  feature, 
  index 
}: { 
  feature: FeatureTile
  index: number 
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const color = feature.color || 'blue'
  const scheme = colorClasses[color]
  const iconVariant = feature.iconVariant || 'outline'
  const Icon = feature.icon

  // Ensure we have exactly 9 features for 3x3 grid
  const tileVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const cardVariants = {
    rest: {
      scale: 1,
      y: 0,
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const iconVariants = {
    rest: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  }

  const handleClick = () => {
    if (feature.onClick) {
      feature.onClick()
    } else if (feature.href) {
      window.location.href = feature.href
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const CardContent = (
    <motion.div
      variants={cardVariants}
      initial="rest"
      animate={isHovered ? 'hover' : 'rest'}
      className={`
        relative glass-card p-6 h-full
        border ${scheme.border}
        ${scheme.hover}
        transition-all duration-300
        cursor-pointer
        group
        ${isFocused ? `${scheme.focus} ring-2 ring-offset-2` : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl ${scheme.glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      />

      {/* Background gradient on hover */}
      <motion.div
        className={`absolute inset-0 rounded-2xl ${scheme.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Icon container */}
      <div className="relative z-10 mb-4">
        <motion.div
          variants={iconVariants}
          initial="rest"
          animate={isHovered ? 'hover' : 'rest'}
          className={`
            w-14 h-14 rounded-2xl
            flex items-center justify-center
            transition-all duration-300
            ${
              iconVariant === 'filled'
                ? `${scheme.iconFilled} shadow-lg`
                : `${scheme.bg} ${scheme.icon} border ${scheme.border}`
            }
          `}
        >
          <Icon 
            className="w-7 h-7" 
            strokeWidth={iconVariant === 'filled' ? 2.5 : 2}
            fill={iconVariant === 'filled' ? 'currentColor' : 'none'}
          />
          
          {/* Icon glow on hover */}
          {iconVariant === 'outline' && (
            <motion.div
              className={`absolute inset-0 rounded-2xl ${scheme.iconFilled} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`}
            />
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {feature.title}
        </h3>
        
        {/* Interactive microcopy */}
        <AnimatePresence mode="wait">
          <motion.p
            key={isHovered ? 'hover' : 'default'}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            {isHovered && feature.description
              ? feature.description
              : feature.microcopy}
          </motion.p>
        </AnimatePresence>

        {/* Optional expanded description indicator */}
        {feature.description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-500"
          >
            <span>Learn more</span>
            <motion.span
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '200%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>
    </motion.div>
  )

  return (
    <motion.div
      variants={tileVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="h-full"
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-full text-left focus:outline-none"
        aria-label={`${feature.title}: ${feature.microcopy}`}
        aria-describedby={feature.description ? `feature-${feature.id}-desc` : undefined}
      >
        {CardContent}
      </button>
      
      {/* Hidden description for screen readers */}
      {feature.description && (
        <div id={`feature-${feature.id}-desc`} className="sr-only">
          {feature.description}
        </div>
      )}
    </motion.div>
  )
}

export function FeatureTiles({
  features,
  className = '',
  gridCols = '3',
}: FeatureTilesProps) {
  // Ensure we have exactly 9 features for balanced 3x3 grid
  const displayFeatures = features.slice(0, 9)
  
  const gridClass = {
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    'auto': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[gridCols]

  return (
    <section 
      className={className}
      aria-label="Feature tiles grid"
    >
      <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
        {displayFeatures.map((feature, index) => (
          <FeatureTileCard
            key={feature.id}
            feature={feature}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

