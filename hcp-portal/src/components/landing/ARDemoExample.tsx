/**
 * Complete Example: Premium AR Demo with Lottie Overlays
 * 
 * This example shows how to integrate the Premium AR Demo component
 * with optional Lottie animations, GSAP effects, and custom styling.
 */

'use client'

import { useState } from 'react'
import { PremiumARDemo } from './PremiumARDemo'
import { motion } from 'framer-motion'

// Example: Lottie React integration (requires: npm install lottie-react)
// import Lottie from 'lottie-react'
// import loadingAnimation from '@/public/animations/loading.json'
// import playButtonHover from '@/public/animations/play-hover.json'

export function ARDemoExample() {
  const [demoCompleted, setDemoCompleted] = useState(false)

  const handleDemoComplete = () => {
    setDemoCompleted(true)
    console.log('Demo playback completed!')
    // Track analytics, show CTA, etc.
  }

  return (
    <section className="py-20 md:py-32 relative bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-health/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            Experience{' '}
            <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
              AR-Powered Healthcare
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See how our AI analyzes symptoms in real-time using augmented reality technology
          </p>
        </motion.div>

        {/* Premium AR Demo Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PremiumARDemo
            videoSrc="/demo.mp4"
            posterSrc="/demo-poster.jpg"
            fallbackImageSrc="/demo-poster.jpg"
            demoType="video"
            onComplete={handleDemoComplete}
          />
        </motion.div>

        {/* Post-Demo CTA (shown after completion) */}
        {demoCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-center"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of users experiencing healthcare reimagined
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-primary to-health text-white rounded-full font-semibold hover:shadow-lg transition-all">
                Start Free Trial
              </button>
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all">
                Learn More
              </button>
            </div>
          </motion.div>
        )}

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 glass-card rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              95% accuracy rate with real-time symptom analysis
            </p>
          </div>

          <div className="text-center p-6 glass-card rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-health to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              AR Guidance
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Step-by-step visual guidance for accurate scanning
            </p>
          </div>

          <div className="text-center p-6 glass-card rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Instant Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get analysis and recommendations in seconds
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Alternative: With Lottie Overlays
 * 
 * To use Lottie animations, first install:
 * npm install lottie-react
 * 
 * Then uncomment the Lottie imports and use:
 */

/*
export function ARDemoWithLottie() {
  const [isHovered, setIsHovered] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  return (
    <div className="relative">
      {/* Loading Lottie Overlay */}
      {showLoading && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            autoplay={true}
            style={{ width: 200, height: 200 }}
          />
        </div>
      )}

      {/* Video Player with Hover Lottie */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        {isHovered && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Lottie
              animationData={playButtonHover}
              loop={false}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
        <PremiumARDemo
          videoSrc="/demo.mp4"
          onVideoLoaded={() => setShowLoading(false)}
        />
      </div>
    </div>
  )
}
*/

