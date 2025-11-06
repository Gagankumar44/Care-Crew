'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles, Zap, Lock, Globe, TrendingUp } from 'lucide-react'

const reasons = [
  {
    icon: Sparkles,
    title: 'Cutting-Edge AI',
    description: 'Powered by the latest medical AI technology, providing accurate health assessments.',
    stat: '95% Accuracy',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get instant health guidance without waiting hours or days for appointments.',
    stat: '< 2 min Response',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your health data is encrypted end-to-end. We never share your information.',
    stat: '100% Secure',
  },
  {
    icon: Globe,
    title: 'Accessible Anywhere',
    description: 'Access healthcare from anywhere in the world, anytime you need it.',
    stat: '24/7 Available',
  },
]

function ReasonCard({ reason, index }: { reason: typeof reasons[0], index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const Icon = reason.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative glass-card p-8 hover:shadow-glass-lg transition-apple"
      style={{ opacity: 1 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-float group-hover:scale-110 group-hover:shadow-float-lg transition-apple">
          <Icon className="w-8 h-8 text-white" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {reason.title}
          </h3>
          <span className="text-sm font-bold text-primary">{reason.stat}</span>
        </div>

        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {reason.description}
        </p>
      </div>
    </motion.div>
  )
}

export function WhyUsSection() {
  return (
    <section id="why-us" className="py-32 bg-white dark:bg-neutral-900 relative w-full min-h-[600px]" style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}>
      {/* Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ opacity: 1 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
                Care Crew?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Experience the future of healthcare technology
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <ReasonCard key={reason.title} reason={reason} index={index} />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          style={{ opacity: 1 }}
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '50K+', label: 'Health Checks' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.9/5', label: 'Rating' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="text-center glass-card p-6"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

