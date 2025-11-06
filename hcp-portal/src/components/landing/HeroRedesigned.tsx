'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Brain, Camera, Shield, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

/**
 * Production-Ready Redesigned Hero Section for MediAR Landing Page
 * 
 * Features:
 * - 3 headline variants (selectable via prop)
 * - Conversion-optimized copy with emotional hooks
 * - Pixel-perfect responsive design (mobile/tablet/desktop)
 * - Smooth Framer Motion animations (1.8s entrance timeline)
 * - Full accessibility (ARIA labels, keyboard navigation)
 * - Trust indicators with microcopy
 * - Dual CTA with microcopy
 * 
 * Usage:
 * <HeroRedesigned variant="a" /> // or "b" or "c"
 */

// Copy variants configuration with headline parts for gradient effect
const copyVariants = {
  a: {
    headlineGradient: "Transform Healthcare",
    headlineSolid: "with AI-Powered AR",
    subheadline: "Get instant symptom analysis and guided medical exams from home. Trusted by 50,000+ patients and leading healthcare providers.",
  },
  b: {
    headlineGradient: "Skip the Waiting Room.",
    headlineSolid: "Get Instant Medical Care.",
    subheadline: "AI-powered AR technology brings expert healthcare to your home. No appointments. No waiting. Just instant, trusted medical guidance.",
  },
  c: {
    headlineGradient: "Your Health, Your Way.",
    headlineSolid: "Always Available.",
    subheadline: "Experience compassionate, AI-enhanced healthcare that comes to you. Real doctors. Real care. Real results—available 24/7.",
  },
}

interface HeroRedesignedProps {
  variant?: 'a' | 'b' | 'c'
}

export function HeroRedesigned({ variant = 'a' }: HeroRedesignedProps) {
  const [isHoveredPrimary, setIsHoveredPrimary] = useState(false)
  const [isHoveredSecondary, setIsHoveredSecondary] = useState(false)
  
  const copy = copyVariants[variant]

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center pt-20 w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* 
        Background Layers
        =================
        - Base background with gradient vision effect
        - Floating gradient orbs for depth
        - Subtle floating icons for visual interest
      */}
      
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-vision z-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-white dark:bg-neutral-900 z-0" aria-hidden="true" />
      
      {/* Floating Background Gradient Orbs */}
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
        {/* Brain Icon - Top Left (6s float animation) */}
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
        
        {/* Camera Icon - Top Right (8s float animation) */}
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
        
        {/* Sparkles Icon - Bottom Left (7s float animation) */}
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

      {/* 
        Main Content Container
        =======================
        - Centered max-width container
        - Responsive padding (mobile/tablet/desktop)
        - All content stacked vertically
      */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-30 w-full max-w-7xl">
        <div className="max-w-4xl mx-auto text-center w-full relative z-20">
          
          {/* 
            Trust Badge
            ===========
            - Animated entrance (0.3s - 0.8s)
            - Scale + fade animation
            - Glassmorphism styling
          */}
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

          {/* 
            Main Headline
            =============
            - Animated entrance (0.4s - 1.0s)
            - Slide up + fade
            - Gradient text effect on first line
            - Responsive typography (40px mobile → 72px desktop)
          */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            {/* Gradient first part of headline */}
            <span 
              className="inline-block bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent animate-gradient-xy bg-[length:200%_auto]"
            >
              {copy.headlineGradient}
            </span>
            {/* Solid second part of headline */}
            {copy.headlineSolid && (
              <>
                <br />
                <span className="text-gray-900 dark:text-white">
                  {copy.headlineSolid}
                </span>
              </>
            )}
          </motion.h1>

          {/* 
            Subheadline
            ===========
            - Animated entrance (0.5s - 1.1s)
            - Slide up + fade
            - Responsive typography (18px mobile → 24px desktop)
            - Max-width for readability
          */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            {copy.subheadline}
          </motion.p>

          {/* 
            CTA Buttons Container
            =====================
            - Animated entrance (0.6s - 1.2s)
            - Scale + fade animation
            - Responsive layout (stacked mobile, side-by-side desktop)
            - Staggered button animations
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-12"
            role="group"
            aria-label="Call to action buttons"
          >
            {/* Primary CTA */}
            <div className="flex flex-col items-center gap-2">
              <Button 
                variant="gradient" 
                size="lg" 
                asChild
                className="group relative overflow-hidden w-full sm:w-auto"
                onMouseEnter={() => setIsHoveredPrimary(true)}
                onMouseLeave={() => setIsHoveredPrimary(false)}
                aria-label="Start free trial - No credit card required"
              >
                <Link href="/auth/register">
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <motion.div
                      animate={isHoveredPrimary ? { x: 4 } : { x: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="ml-2"
                    >
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </motion.div>
                  </span>
                  {/* Hover gradient effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-health-600"
                    initial={{ x: '-100%' }}
                    animate={isHoveredPrimary ? { x: 0 } : { x: '-100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </Link>
              </Button>
              
              {/* Primary CTA Microcopy */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center"
              >
                No credit card required • Begin in 30 seconds • Cancel anytime
              </motion.p>
            </div>

            {/* Secondary CTA */}
            <div className="flex flex-col items-center gap-2">
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="group border-2 hover:border-primary/50 w-full sm:w-auto"
                onMouseEnter={() => setIsHoveredSecondary(true)}
                onMouseLeave={() => setIsHoveredSecondary(false)}
                aria-label="Watch 2-minute product demonstration video"
              >
                <Link href="#demo">
                  <motion.div
                    animate={isHoveredSecondary ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="mr-2"
                  >
                    <Play className="w-5 h-5" aria-hidden="true" />
                  </motion.div>
                  Watch 2-Min Demo
                </Link>
              </Button>
              
              {/* Secondary CTA Microcopy */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.75, ease: 'easeOut' }}
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center"
              >
                See AR in action • 2 minutes • No sign-up required
              </motion.p>
            </div>
          </motion.div>

          {/* 
            Trust Indicators
            ================
            - Animated entrance (0.7s - 1.3s)
            - Staggered animations (80ms delay per badge)
            - Glassmorphism styling
            - Microcopy on each badge (hidden on mobile)
            - Hover effects
          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8"
            role="region"
            aria-label="Security and compliance information"
          >
            {/* HIPAA Compliant */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 glass px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md group cursor-pointer transition-shadow duration-300 hover:shadow-glass-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-health flex-shrink-0" aria-hidden="true" />
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200">
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
              transition={{ duration: 0.5, delay: 0.88, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 glass px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md group cursor-pointer transition-shadow duration-300 hover:shadow-glass-lg"
            >
              <Shield className="w-4 h-4 text-health flex-shrink-0" aria-hidden="true" />
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200">
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
              transition={{ duration: 0.5, delay: 0.96, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 glass px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-health/20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md group cursor-pointer transition-shadow duration-300 hover:shadow-glass-lg"
            >
              <Clock className="w-4 h-4 text-health flex-shrink-0" aria-hidden="true" />
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200">
                  24/7 Support
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
                  Avg response: 2 minutes
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* 
            Additional Microcopy
            ====================
            - Animated entrance (0.95s - 1.45s)
            - Final trust statement
            - Fade in only
          */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.95, ease: 'easeOut' }}
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
          >
            30-day money-back guarantee • Trusted by 50,000+ patients
          </motion.p>
        </div>
      </div>
    </section>
  )
}

