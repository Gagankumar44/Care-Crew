'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Sparkles, Brain, FileText, Video } from 'lucide-react'

export function DemoSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false)
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Handle video play/pause in modal
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.play()
    } else if (!isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.pause()
    }
  }, [isModalOpen])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    if (modalVideoRef.current) {
      modalVideoRef.current.pause()
      modalVideoRef.current.currentTime = 0
    }
  }

  const features = [
    { icon: Sparkles, label: 'AR Guided Scanning', color: 'from-purple-500 to-purple-600' },
    { icon: Brain, label: 'AI Symptom Analysis', color: 'from-blue-500 to-blue-600' },
    { icon: FileText, label: 'Instant Report', color: 'from-green-500 to-green-600' },
    { icon: Video, label: 'Doctor Teleconsult', color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <>
      <section className="py-20 md:py-32 relative bg-white dark:bg-neutral-900 w-full min-h-[400px]" style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}>
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-health/5 z-0" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] z-0" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-health/8 rounded-full blur-[120px] z-0" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 w-full"
            style={{ opacity: 1 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 text-gray-900 dark:text-white tracking-tight">
              See{' '}
              <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
                Care Crew
              </span>{' '}
              in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Experience AI-powered AR health scanning designed for everyone.
            </p>
          </motion.div>

          {/* Video Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)', scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto mb-12"
            style={{ opacity: 1 }}
          >
            <div
              className="relative group cursor-pointer rounded-3xl overflow-hidden glass-card border border-white/20 dark:border-neutral-700 shadow-glass-lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleOpenModal}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleOpenModal()
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Play product demo video"
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isHovered ? 'opacity-60' : 'opacity-100'
                  } ${!isVideoLoaded ? 'opacity-0' : ''}`}
                  poster="/demo-poster.jpg"
                  muted
                  playsInline
                  loop
                  onLoadedData={() => setIsVideoLoaded(true)}
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  <source src="/demo.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>

                {/* Loading Skeleton */}
                {!isVideoLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading video...</p>
                    </div>
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Animated Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: isHovered ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
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
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-20 h-20 md:w-24 md:h-24 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glass-lg border-2 border-white/50"
                    >
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-primary ml-1" fill="currentColor" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Hover Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                  <p className="text-white text-sm font-medium px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
                    Click to watch full demo
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Feature Highlights with Enhanced Animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
            role="list"
            aria-label="Key features demonstrated in video"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.li
                  key={feature.label}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.5 + index * 0.1,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: 'easeOut' }
                  }}
                  className="text-center group list-none"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      relative w-16 h-16 md:w-20 md:h-20 
                      bg-gradient-to-br ${feature.color} 
                      rounded-2xl flex items-center justify-center 
                      mx-auto mb-3 
                      shadow-float group-hover:shadow-float-lg 
                      transition-all
                      cursor-pointer
                    `}
                  >
                    {/* Glowing orb effect on hover */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}
                      aria-hidden="true"
                    />
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" />
                  </motion.div>
                  <p className="text-sm md:text-base font-semibold text-neutral-900 dark:text-white">
                    {feature.label}
                  </p>
                  {/* Tooltip on hover - hidden by default, shown on larger screens */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden md:block mt-2"
                  >
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {feature.label === 'AR Guided Scanning' && 'Real-time AR guidance'}
                      {feature.label === 'AI Symptom Analysis' && '95% accuracy'}
                      {feature.label === 'Instant Report' && 'Get results in seconds'}
                      {feature.label === 'Doctor Teleconsult' && 'Connect instantly'}
                    </p>
                  </motion.div>
                </motion.li>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
              onClick={handleCloseModal}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-4 md:inset-16 lg:inset-32 z-50 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-glass-heavy border border-white/10">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Close video"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Video Player */}
                <video
                  ref={modalVideoRef}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  <source src="/demo.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

