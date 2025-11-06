'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Activity, Shield, Clock } from 'lucide-react'

/**
 * Value Props Bar - Displays key stats and social proof
 * Positioned below hero section for immediate credibility
 */
const valueProps = [
  { 
    icon: Users, 
    value: '50,000+', 
    label: 'Patients', 
    subtitle: 'Trusted worldwide',
    color: 'text-primary',
    bgGradient: 'from-primary/10 to-primary/5',
    borderColor: 'border-primary/20',
  },
  { 
    icon: Activity, 
    value: '99.9%', 
    label: 'Uptime', 
    subtitle: 'Reliable service',
    color: 'text-health',
    bgGradient: 'from-health/10 to-health/5',
    borderColor: 'border-health/20',
  },
  { 
    icon: Shield, 
    value: 'HIPAA', 
    label: 'Compliant', 
    subtitle: 'Enterprise security',
    color: 'text-accent',
    bgGradient: 'from-accent/10 to-accent/5',
    borderColor: 'border-accent/20',
  },
  { 
    icon: Clock, 
    value: '< 2 min', 
    label: 'Response', 
    subtitle: 'Average support time',
    color: 'text-primary',
    bgGradient: 'from-primary/10 to-primary/5',
    borderColor: 'border-primary/20',
  },
]

interface StatCardProps {
  stat: typeof valueProps[0]
  index: number
  isInView: boolean
}

function StatCard({ stat, index, isInView }: StatCardProps) {
  const Icon = stat.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      className="flex-1 min-w-[200px] max-w-[280px] group cursor-pointer"
    >
      <div className={`
        relative glass-card p-6 rounded-2xl border
        bg-gradient-to-br ${stat.bgGradient}
        border ${stat.borderColor}
        hover:shadow-glass-lg
        transition-all duration-300
        h-full
      `}>
        {/* Glowing orb effect on hover */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}
          aria-hidden="true"
        />
        
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.5,
            }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center mb-4 ${stat.borderColor} border`}
          >
            <Icon className={`w-6 h-6 ${stat.color}`} aria-hidden="true" />
          </motion.div>
          
          {/* Value */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1"
          >
            {stat.value}
          </motion.div>
          
          {/* Label */}
          <div className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {stat.label}
          </div>
          
          {/* Subtitle */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {stat.subtitle}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ValuePropsBar() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' })

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-y border-neutral-200/50 dark:border-neutral-800/50 relative w-full"
      aria-label="Value propositions and statistics"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" aria-hidden="true" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          role="group"
          aria-label="Statistics and trust indicators"
        >
          {valueProps.map((stat, index) => (
            <StatCard 
              key={stat.label} 
              stat={stat} 
              index={index}
              isInView={isInView}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

