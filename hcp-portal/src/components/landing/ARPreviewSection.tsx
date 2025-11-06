'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ScanLine, Activity, Heart, Brain, Zap, Cpu } from 'lucide-react'

export function ARPreviewSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2])

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-gradient-to-b from-white via-neutral-50 to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 w-full min-h-[600px]" style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}>
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(10, 132, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(52, 199, 89, 0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: `translateY(${y1}px)`
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="particle-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
          style={{ opacity: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-primary/20"
            style={{ opacity: 1 }}
          >
            <Cpu className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AR Technology Preview</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-neutral-900 dark:text-white tracking-tight">
            Experience{' '}
            <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent holographic">
              Holographic
            </span>{' '}
            Health Analysis
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Step into the future of medical diagnostics with our cutting-edge AR interface
          </p>
        </motion.div>

        {/* Main AR Preview Container */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
            style={{ opacity: 1 }}
          >
            {/* Holographic Border Container */}
            <div className="holographic-border rounded-3xl p-8 md:p-12 relative overflow-hidden">
              {/* Data Stream Effects */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="data-stream" style={{ left: '10%', animationDelay: '0s' }} />
                <div className="data-stream" style={{ left: '30%', animationDelay: '0.5s' }} />
                <div className="data-stream" style={{ left: '50%', animationDelay: '1s' }} />
                <div className="data-stream" style={{ left: '70%', animationDelay: '1.5s' }} />
                <div className="data-stream" style={{ left: '90%', animationDelay: '2s' }} />
              </div>

              {/* Inner Glass Container */}
              <div className="glass rounded-2xl p-8 md:p-12 relative backdrop-blur-xl bg-white/5 dark:bg-neutral-900/5">
                {/* AR UI Mockup */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left Side - UI Elements */}
                  <div className="space-y-6">
                    <ARCard
                      icon={ScanLine}
                      title="Real-Time Scanning"
                      subtitle="AR-guided body analysis"
                      status="Active"
                      delay={0}
                      isInView={isInView}
                    />
                    <ARCard
                      icon={Heart}
                      title="Vital Signs"
                      subtitle="Continuous monitoring"
                      status="Processing"
                      delay={0.2}
                      isInView={isInView}
                    />
                    <ARCard
                      icon={Brain}
                      title="AI Analysis"
                      subtitle="Deep learning insights"
                      status="Complete"
                      delay={0.4}
                      isInView={isInView}
                    />
                  </div>

                  {/* Right Side - 3D Holographic Display */}
                  <motion.div
                    initial={{ opacity: 0, x: 50, rotateY: -15 }}
                    animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="relative"
                    style={{ perspective: '1000px', opacity: 1 }}
                  >
                    {/* 3D Holographic Cylinder */}
                    <div className="relative h-64 md:h-80 flex items-center justify-center">
                      {/* Rotating Hologram */}
                      <motion.div
                        style={{ rotateY: rotate }}
                        className="relative w-48 h-48 md:w-64 md:h-64"
                      >
                        {/* Outer Rings */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 border-2 border-primary/30 rounded-full"
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-4 border-2 border-health/30 rounded-full"
                        />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-8 border-2 border-accent/30 rounded-full"
                        />

                        {/* Center Holographic Scan */}
                        <div className="absolute inset-12 glass rounded-full holographic">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                              className="w-24 h-24 bg-gradient-to-br from-primary via-health to-accent rounded-full blur-xl"
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Activity className="w-12 h-12 text-primary animate-pulse" />
                          </div>
                        </div>

                        {/* Scanning Beam */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0"
                        >
                          <div className="absolute top-0 left-1/2 w-1 h-1/2 bg-gradient-to-b from-primary via-transparent to-transparent rounded-full blur-sm" />
                        </motion.div>
                      </motion.div>

                      {/* Glow Orbs */}
                      <motion.div
                        animate={{
                          x: [0, 30, 0],
                          y: [0, -30, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-full blur-xl opacity-50"
                      />
                      <motion.div
                        animate={{
                          x: [0, -30, 0],
                          y: [0, 30, 0],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-health rounded-full blur-xl opacity-50"
                      />
                    </div>

                    {/* Data Visualization Lines */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full">
                        {[...Array(12)].map((_, i) => (
                          <motion.line
                            key={i}
                            x1="50%"
                            y1="50%"
                            x2={`${50 + Math.cos((i * Math.PI * 2) / 12) * 100}%`}
                            y2={`${50 + Math.sin((i * Math.PI * 2) / 12) * 100}%`}
                            stroke="rgba(10, 132, 255, 0.3)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 + i * 0.05 }}
                            style={{ opacity: 1 }}
                          />
                        ))}
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Stats Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
                  style={{ opacity: 1 }}
                >
                  <StatCard value="98%" label="Accuracy" delay={0} isInView={isInView} />
                  <StatCard value="<5s" label="Scan Time" delay={0.1} isInView={isInView} />
                  <StatCard value="AI" label="Powered" delay={0.2} isInView={isInView} />
                  <StatCard value="∞" label="Medical Data" delay={0.3} isInView={isInView} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center mt-12"
          style={{ opacity: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-gradient-to-r from-primary via-health to-accent text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Try AR Demo
              <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// AR Card Component
function ARCard({ 
  icon: Icon, 
  title, 
  subtitle, 
  status, 
  delay,
  isInView 
}: { 
  icon: any
  title: string
  subtitle: string
  status: string
  delay: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass-card p-6 hover:shadow-glass-lg transition-all group relative overflow-hidden"
      style={{ opacity: 1 }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      />

      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-health rounded-xl flex items-center justify-center shadow-float group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-neutral-900 dark:text-white">{title}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '100%' } : { width: '100%' }}
        transition={{ duration: 1.5, delay: delay + 0.5, ease: 'easeInOut' }}
        className="mt-4 h-1 bg-gradient-to-r from-primary to-health rounded-full"
        style={{ width: '100%' }}
      />
    </motion.div>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const colors = {
    Active: 'from-health to-health-600',
    Processing: 'from-primary to-primary-600',
    Complete: 'from-accent to-accent-600',
  }

  return (
    <span className={`text-xs px-3 py-1 bg-gradient-to-r ${colors[status as keyof typeof colors]} text-white rounded-full font-medium`}>
      {status}
    </span>
  )
}

// Stat Card Component
function StatCard({ value, label, delay, isInView }: { value: string; label: string; delay: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="text-center p-4 glass-card rounded-xl hover:shadow-glass-lg transition-all"
      style={{ opacity: 1 }}
    >
      <div className="text-3xl font-bold bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-sm text-neutral-600 dark:text-neutral-400">{label}</div>
    </motion.div>
  )
}

