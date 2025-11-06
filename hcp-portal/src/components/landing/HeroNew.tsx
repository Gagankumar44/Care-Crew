'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Brain, Camera, Shield, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Production-ready Hero Section for MediAR Landing Page
 * 
 * Features:
 * - Conversion-optimized copy (Variant A: Benefit-focused)
 * - Smooth animation timeline (1.8s total)
 * - Full accessibility (ARIA, keyboard navigation)
 * - Responsive design (mobile-first)
 * - Trust indicators with microcopy
 * - Dual CTA layout with hover states
 */
export function HeroNew() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center pt-20 w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-gradient-vision z-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-white dark:bg-neutral-900 z-0" aria-hidden="true" />
      
      {/* Floating Background Orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] z-[1]"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-health/8 rounded-full blur-[120px] z-[1]"
        aria-hidden="true"
      />
      
      {/* Floating Icons - Subtle AR/Health Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
        {/* Brain Icon - Top Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 0.15,
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.2 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-20 left-10 w-20 h-20 hidden md:block"
        >
          <Brain className="w-full h-full text-primary" />
        </motion.div>
        
        {/* Camera Icon - Top Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 0.15,
            y: [0, 20, 0],
            x: [0, -10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.3 },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-40 right-20 w-16 h-16 hidden lg:block"
        >
          <Camera className="w-full h-full text-secondary" />
        </motion.div>
        
        {/* Sparkles Icon - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 0.12,
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.4 },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-40 left-1/4 w-24 h-24 hidden lg:block"
        >
          <Sparkles className="w-full h-full text-accent" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30 w-full max-w-7xl">
        <div className="max-w-4xl mx-auto text-center w-full relative z-20">
          
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-primary/20 shadow-depth bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md"
            role="status"
            aria-label="FDA-Approved Technology"
          >
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-primary">FDA-Approved Technology</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            <span 
              className="inline-block bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent animate-gradient-xy bg-[length:200%_auto]"
            >
              Transform Healthcare
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              with AI-Powered AR
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            Get instant symptom analysis and guided medical exams from home.{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              Trusted by 50,000+ patients.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            role="group"
            aria-label="Call to action buttons"
          >
            {/* Primary CTA */}
            <Button 
              variant="gradient" 
              size="lg" 
              asChild
              className="group relative overflow-hidden"
              aria-label="Start free trial - No credit card required"
            >
              <Link href="/auth/register">
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </span>
                {/* Hover gradient effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 to-health-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>

            {/* Secondary CTA */}
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              className="group border-2 hover:border-primary/50"
              aria-label="Watch 2-minute product demonstration video"
            >
              <Link href="#demo">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                Watch 2-Min Demo
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators with Microcopy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm"
            role="region"
            aria-label="Security and compliance information"
          >
            {/* HIPAA Compliant */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
              className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md group"
            >
              <CheckCircle2 className="w-4 h-4 text-health flex-shrink-0" aria-hidden="true" />
              <div className="flex flex-col items-start">
                <span className="text-gray-900 dark:text-gray-200 font-medium">
                  HIPAA Compliant
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
                  End-to-end encrypted
                </span>
              </div>
            </motion.div>

            {/* FDA Approved */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85, ease: 'easeOut' }}
              className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md group"
            >
              <Shield className="w-4 h-4 text-health flex-shrink-0" aria-hidden="true" />
              <div className="flex flex-col items-start">
                <span className="text-gray-900 dark:text-gray-200 font-medium">
                  FDA Approved
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
                  Medical grade technology
                </span>
              </div>
            </motion.div>

            {/* 24/7 Support */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
              className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md group"
            >
              <Clock className="w-4 h-4 text-health flex-shrink-0" aria-hidden="true" />
              <div className="flex flex-col items-start">
                <span className="text-gray-900 dark:text-gray-200 font-medium">
                  24/7 Support
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
                  Avg response: 2 minutes
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Microcopy - Additional Trust Statement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.95, ease: 'easeOut' }}
            className="mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
          >
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </motion.p>
        </div>
      </div>

    </section>
  )
}

