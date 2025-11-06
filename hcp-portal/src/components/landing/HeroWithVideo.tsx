'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Brain, Camera, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroWithVideo() {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const features = [
    'AI-powered symptom analysis',
    'Real-time AR health scanning',
    'Instant medical insights',
    'HIPAA & FDA compliant',
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-vision" />
      <div className="absolute inset-0 bg-white dark:bg-neutral-900" />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          className="absolute top-20 left-10 w-16 h-16 opacity-20"
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
          className="absolute top-40 right-10 w-12 h-12 opacity-20"
        >
          <Camera className="w-full h-full text-secondary" />
        </motion.div>
        
        {/* Sparkles - Bottom Center */}
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
          className="absolute bottom-40 left-1/2 w-20 h-20 opacity-15"
        >
          <Sparkles className="w-full h-full text-accent" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-primary/20 shadow-depth"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Healthcare</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight"
            >
              <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
                Healthcare
              </span>
              <br />
              <span className="text-neutral-900 dark:text-white">Reimagined with AR</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed"
            >
              Experience the future of telehealth with AI-powered symptom analysis and 
              AR-guided medical examinations—all from the comfort of your home.
            </motion.p>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-health flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
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
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 text-sm"
            >
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20">
                <div className="w-2 h-2 bg-health rounded-full" />
                <span className="text-neutral-700 dark:text-neutral-300">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20">
                <div className="w-2 h-2 bg-health rounded-full" />
                <span className="text-neutral-700 dark:text-neutral-300">FDA Approved</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Video */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div
              className="relative group cursor-pointer rounded-3xl overflow-hidden glass-card border border-white/20 dark:border-neutral-700 shadow-glass-lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (videoRef.current) {
                    videoRef.current.play()
                  }
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Play product demo video"
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) {
                    videoRef.current.play()
                  } else {
                    videoRef.current.pause()
                  }
                }
              }}
            >
              {/* Video Container */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isHovered ? 'opacity-70 scale-[1.02]' : 'opacity-100 scale-100'
                  }`}
                  poster="/demo-poster.jpg"
                  muted
                  playsInline
                  loop
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  <source src="/demo.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                {/* Animated Play Button Overlay (shown on hover when paused) */}
                {isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative"
                    >
                      {/* Glow Pulse Effect */}
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-primary via-health to-accent rounded-full blur-xl"
                      />

                      {/* Play Button Circle */}
                      <div className="relative w-20 h-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glass-lg border-2 border-white/50">
                        <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Subtle Glow on Hover */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 0.6 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-health/20 to-accent/20 blur-2xl pointer-events-none"
                />
              </div>
            </div>

            {/* Floating Stats Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 glass-card border border-white/20 dark:border-neutral-700 shadow-glass-lg p-4 rounded-2xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-health to-accent rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">98%</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Accuracy Rate</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
