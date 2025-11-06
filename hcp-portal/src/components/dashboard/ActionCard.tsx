'use client'

import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionCardProps {
  title: string
  description?: string
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>
  href: string
  variant?: 'teal' | 'violet' | 'neutral'
  gradient?: 'primary' | 'accent' | 'health' | 'warning'
  delay?: number
  layoutId?: string
  size?: 'default' | 'large'
}

const gradientStyles = {
  teal: {
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/10',
    iconText: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/20 dark:border-teal-500/20',
  },
  violet: {
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/10',
    iconText: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/20 dark:border-violet-500/20',
  },
  neutral: {
    iconBg: 'bg-neutral-100 dark:bg-neutral-800',
    iconText: 'text-neutral-600 dark:text-neutral-400',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
  primary: {
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/10',
    iconText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20 dark:border-blue-500/20',
  },
  accent: {
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/10',
    iconText: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20 dark:border-purple-500/20',
  },
  health: {
    iconBg: 'bg-green-500/10 dark:bg-green-500/10',
    iconText: 'text-green-600 dark:text-green-400',
    border: 'border-green-500/20 dark:border-green-500/20',
  },
  warning: {
    iconBg: 'bg-orange-500/10 dark:bg-orange-500/10',
    iconText: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20 dark:border-orange-500/20',
  },
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  href,
  variant,
  gradient,
  delay = 0,
  layoutId,
  size = 'default',
}: ActionCardProps) {
  // Support both variant (backward compat) and gradient (new usage)
  const styleKey = gradient || variant || 'teal'
  const styles = gradientStyles[styleKey as keyof typeof gradientStyles] || gradientStyles.teal
  
  // Motion variants for card appearance and hover
  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }
  
  const hoverVariants = {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -4, // 4px lift (half of base unit)
      scale: 1.01,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }
  
  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-[24px]">
      <motion.div
        layoutId={layoutId}
        className={cn(
          'glass-card cursor-pointer',
          'border', styles.border,
          'group relative',
          'rounded-[24px]', // Large soft radius for main cards
          size === 'large' ? 'p-8' : 'p-6'
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileFocus="hover"
        whileTap={{ scale: 0.98 }}
        transition={{ layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
      >
        <motion.div 
          className="relative z-10"
          variants={hoverVariants}
        >
          <div className={size === 'large' ? 'mb-6' : 'mb-4'}>
            <motion.div
              className={cn(
                'inline-flex transition-colors duration-300 items-center justify-center', // Larger soft radius (24px)
                size === 'large' ? 'p-4 rounded-3xl' : 'p-3 rounded-3xl',
                styles.iconBg, styles.iconText
              )}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
            >
              {typeof Icon === 'function' && 'prototype' in Icon && Icon.prototype ? (
                // Lucide icon (has prototype)
                <Icon size={size === 'large' ? 32 : 24} aria-hidden="true" />
              ) : typeof Icon === 'function' ? (
                // Custom React component icon
                <Icon size={size === 'large' ? 32 : 24} className={styles.iconText} aria-hidden="true" />
              ) : (
                // Fallback
                <Icon size={size === 'large' ? 32 : 24} aria-hidden="true" />
              )}
            </motion.div>
          </div>

          <h3 className={cn(
            'font-semibold text-neutral-900 dark:text-white mb-2',
            size === 'large' ? 'text-xl' : 'text-lg'
          )}>
            {title}
          </h3>

          {description && (
            <p className={cn(
              'text-neutral-600 dark:text-neutral-400 leading-relaxed',
              size === 'large' ? 'text-base' : 'text-sm'
            )}>
              {description}
            </p>
          )}
        </motion.div>
      </motion.div>
    </Link>
  )
}
