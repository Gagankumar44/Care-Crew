'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Brain, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 w-full" style={{ display: 'flex', position: 'relative', zIndex: 10 }}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-vision z-0" style={{ zIndex: 0 }} />
      <div className="absolute inset-0 bg-white dark:bg-neutral-900 z-0" style={{ zIndex: 0 }} />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Brain - Top Left */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-20 h-20 opacity-20"
        >
          <Brain className="w-full h-full text-primary" />
        </motion.div>
        
        {/* Camera - Top Right */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-20 w-16 h-16 opacity-20"
        >
          <Camera className="w-full h-full text-secondary" />
        </motion.div>
        
        {/* Sparkles - Bottom Left */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-40 left-1/4 w-24 h-24 opacity-15"
        >
          <Sparkles className="w-full h-full text-accent" />
        </motion.div>
        
        {/* Additional Health Icons */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, 8, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-60 right-1/4 w-12 h-12 opacity-10"
        >
          <Sparkles className="w-full h-full text-success-500" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30 w-full max-w-7xl" style={{ zIndex: 30, position: 'relative' }}>
        <div className="max-w-5xl mx-auto text-center w-full relative z-20" style={{ zIndex: 20, position: 'relative' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 border border-primary/20 shadow-depth bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md"
            style={{ opacity: 1, padding: '0.5rem 1rem' }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Healthcare</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-[1.1] tracking-tight text-center text-gray-900 dark:text-white"
            style={{ 
              opacity: 1, 
              visibility: 'visible',
              zIndex: 50
            }}
          >
            <span 
              style={{ 
                background: 'linear-gradient(to right, #3b82f6, #22c55e, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block'
              }}
            >
              Healthcare
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Reimagined with AR
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300"
            style={{ 
              opacity: 1, 
              visibility: 'visible',
              zIndex: 50
            }}
          >
            Experience the future of telehealth with AI-powered symptom analysis and 
            AR-guided medical examinations—all from the comfort of your home.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            style={{ opacity: 1 }}
          >
            <Button variant="gradient" size="lg" asChild className="group">
              <Link href="/auth/register">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="group">
              <Link href="#demo">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
            style={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
              <div className="w-2 h-2 bg-health rounded-full" />
              <span className="text-gray-900 dark:text-gray-200">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
              <div className="w-2 h-2 bg-health rounded-full" />
              <span className="text-gray-900 dark:text-gray-200">FDA Approved</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
              <div className="w-2 h-2 bg-health rounded-full" />
              <span className="text-gray-900 dark:text-gray-200">24/7 Support</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

