'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Sparkles, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  return (
    <section ref={sectionRef} className="relative py-32 w-full min-h-[400px]" style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-health/10 to-accent/10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-health/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
          style={{ opacity: 1 }}
        >
          {/* Main CTA Card */}
          <div className="glass-card p-12 md:p-16 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 border border-primary/20"
                style={{ opacity: 1 }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Start Your Health Journey Today</span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight"
                style={{ opacity: 1 }}
              >
                Ready to Experience{' '}
                <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
                  Better Healthcare?
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                style={{ opacity: 1 }}
              >
                Join thousands of patients and healthcare providers using Care Crew to transform healthcare delivery
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                style={{ opacity: 1 }}
              >
                <Button variant="gradient" size="lg" asChild className="group">
                  <Link href="/auth/register">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="group">
                  <Link href="/demo">
                    <Sparkles className="mr-2 w-5 h-5" />
                    Schedule Demo
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-6 text-sm"
                style={{ opacity: 1 }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-health" />
                  <span className="text-neutral-600 dark:text-neutral-400">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health rounded-full animate-pulse" />
                  <span className="text-neutral-600 dark:text-neutral-400">10,000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full" />
                  <span className="text-neutral-600 dark:text-neutral-400">24/7 Support</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-center"
            style={{ opacity: 1 }}
          >
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

