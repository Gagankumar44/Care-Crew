'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, Camera, Brain, Calendar, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Describe Your Symptoms',
    description: 'Enter your symptoms and medical concerns in plain language',
    gradient: 'from-primary to-primary-600',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Advanced AI analyzes your inputs and provides initial assessment',
    gradient: 'from-health to-health-600',
  },
  {
    icon: Camera,
    title: 'AR Guided Scan',
    description: 'Use your camera for guided physical examination with AR overlays',
    gradient: 'from-accent to-accent-600',
  },
  {
    icon: Calendar,
    title: 'Schedule Consultation',
    description: 'Book a virtual visit with a healthcare provider if needed',
    gradient: 'from-primary to-health',
  },
]

function StepCard({ step, index }: { step: typeof steps[0], index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
      style={{ opacity: 1 }}
    >
      {/* Connecting Line */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-neutral-300 dark:from-neutral-700 to-neutral-200 dark:to-neutral-800 z-0" />
      )}

      <div className="relative z-10">
        {/* Step Number Badge */}
        <div className="absolute -top-4 -left-4 z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
            className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-float-lg"
            style={{ scale: 1 }}
          >
            <span className="text-white font-bold text-lg">{index + 1}</span>
          </motion.div>
        </div>

        {/* Card */}
        <div className="glass-card p-8 hover:shadow-glass-lg transition-apple h-full">
          {/* Icon */}
          <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-float group-hover:scale-110 group-hover:shadow-float-lg transition-apple`}>
            <Icon className="w-10 h-10 text-white" />
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
            {step.title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function HowItWorksSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  return (
    <section id="how-it-works" ref={sectionRef} className="py-32 bg-gradient-apple relative w-full min-h-[500px]" style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}>
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-health/8 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ opacity: 1 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight">
              How{' '}
              <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
                Care Crew Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Get started in minutes with our simple 4-step process
            </p>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 flex items-center justify-center gap-3"
          style={{ opacity: 1 }}
        >
          <CheckCircle2 className="w-6 h-6 text-health" />
          <span className="text-lg text-neutral-700 dark:text-neutral-300 font-medium">
            Average time to complete: 2-3 minutes
          </span>
        </motion.div>
      </div>
    </section>
  )
}

