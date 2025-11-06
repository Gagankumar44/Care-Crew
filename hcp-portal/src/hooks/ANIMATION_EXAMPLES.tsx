/**
 * Animation System - Practical Example
 * 
 * This file demonstrates how to use the animation system
 * in a real component context.
 */

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

// Import animation hooks
import {
  useHeroAnimations,
  useDemoAnimations,
  useCardAnimations,
  useCTAAnimations,
  useFeatureGridCards,
} from '@/hooks/useComponentAnimations'

// Example: Hero Section Implementation
export function ExampleHeroSection() {
  const animations = useHeroAnimations()
  
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div {...animations.badge}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-medium mb-8">
              AI-Powered Healthcare Platform
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h1 {...animations.title} className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Revolutionary Telehealth Platform
          </motion.h1>
          
          {/* Description */}
          <motion.p {...animations.description} className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
            Experience the future of telehealth with AI-powered symptom analysis and AR-guided medical examinations.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div {...animations.cta} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#demo">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div {...animations.stats} className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">50K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">HIPAA</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Compliant</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Example: Demo Section Implementation
export function ExampleDemoSection() {
  const animations = useDemoAnimations()
  const features = [
    { icon: '🎯', label: 'AR Guided Scanning' },
    { icon: '🧠', label: 'AI Symptom Analysis' },
    { icon: '📄', label: 'Instant Report' },
    { icon: '📹', label: 'Doctor Teleconsult' },
  ]
  
  return (
    <section id="demo" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...animations.header} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            See It In Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Watch how our platform transforms healthcare delivery
          </p>
        </motion.div>
        
        {/* Video Container */}
        <motion.div {...animations.video} className="relative aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl overflow-hidden mb-8">
          <video
            className="w-full h-full object-cover"
            poster="/demo-poster.jpg"
            muted
            playsInline
            loop
          >
            <source src="/demo.mp4" type="video/mp4" />
          </video>
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button {...animations.playButton} className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-primary ml-1" />
            </motion.button>
          </div>
        </motion.div>
        
        {/* Features */}
        <motion.div {...animations.features.container} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div key={i} {...animations.features.item} className="text-center p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{feature.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Example: Feature Cards Grid Implementation
interface Feature {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export function ExampleFeatureGrid({ features }: { features: Feature[] }) {
  const { ref, container, item } = useFeatureGridCards(0.1, 0.1)
  
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} {...container} className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            const cardAnimations = useCardAnimations(i, 0.1)
            
            return (
              <motion.div key={feature.id} {...cardAnimations}>
                <div className="glass-card p-8 h-full cursor-pointer overflow-hidden">
                  <motion.div {...cardAnimations.icon} className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// Example: CTA Section Implementation
export function ExampleCTASection() {
  const animations = useCTAAnimations()
  
  return (
    <motion.section {...animations.container} className="relative py-32 w-full min-h-[400px]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-health/10 to-accent/10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA Card */}
          <div className="glass-card p-12 md:p-16 relative overflow-hidden">
            {/* Badge */}
            <motion.div {...animations.badge} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 border border-primary/20">
              <span className="text-sm font-medium text-primary">Start Your Health Journey Today</span>
            </motion.div>
            
            {/* Heading */}
            <motion.h2 {...animations.heading} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Ready to Experience{' '}
              <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
                Better Healthcare?
              </span>
            </motion.h2>
            
            {/* Description */}
            <motion.p {...animations.description} className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of patients and healthcare providers using Care Crew to transform healthcare delivery
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div {...animations.buttons} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/auth/register">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo">
                  Schedule Demo
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div {...animations.trustIndicators} className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600 dark:text-neutral-400">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-600 dark:text-neutral-400">10,000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-600 dark:text-neutral-400">24/7 Support</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

