'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Award, CheckCircle2 } from 'lucide-react'

const trustBadges = [
  { name: 'HIPAA Certified', icon: Shield, color: 'text-health' },
  { name: 'FDA Approved', icon: Award, color: 'text-primary' },
  { name: 'AI Verified', icon: CheckCircle2, color: 'text-accent' },
]

function TrustItem({ item, index }: { item: { name: string, icon: any, color?: string }, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = item.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex items-center justify-center"
      style={{ opacity: 1 }}
    >
      <div className="flex items-center gap-3 glass-card px-6 py-4 border border-neutral-200 dark:border-neutral-700 hover:border-primary/30 transition-apple">
        <Icon className={`w-8 h-8 ${item.color || 'text-neutral-600 dark:text-neutral-400'} group-hover:scale-110 transition-transform`} />
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.name}</span>
      </div>
    </motion.div>
  )
}

export function TrustBar() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  return (
    <section ref={sectionRef} className="py-16 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800 relative w-full min-h-[200px]" style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
        {/* Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8"
          style={{ opacity: 1 }}
        >
          {trustBadges.map((badge, index) => (
            <TrustItem key={badge.name} item={badge} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

