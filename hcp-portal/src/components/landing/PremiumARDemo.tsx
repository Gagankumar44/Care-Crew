'use client'

/**
 * Premium AR Demo Component
 * 
 * Features:
 * - 3-step onboarding flow
 * - Video + Lottie overlay support
 * - Mobile fallback with static image
 * - Progress tracking
 * - Premium overlay controls
 * - Framer Motion + GSAP animations
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, X, ArrowRight, CheckCircle2, Smartphone } from 'lucide-react'

// Onboarding steps configuration
const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Point Your Camera',
    description: 'Position your phone camera over the area you want to scan',
    icon: '📱',
    duration: 3000, // 3 seconds
  },
  {
    id: 2,
    title: 'AI Analysis',
    description: 'Our AI processes the scan in real-time with AR guidance',
    icon: '🤖',
    duration: 3000,
  },
  {
    id: 3,
    title: 'Get Results',
    description: 'Receive instant analysis and recommendations',
    icon: '✨',
    duration: 3000,
  },
]

interface PremiumARDemoProps {
  videoSrc?: string
  posterSrc?: string
  fallbackImageSrc?: string
  demoType?: 'video' | 'webgl'
  onComplete?: () => void
}

export function PremiumARDemo({
  videoSrc = '/demo.mp4',
  posterSrc = '/demo-poster.jpg',
  fallbackImageSrc = '/demo-poster.jpg',
  demoType = 'video',
  onComplete,
}: PremiumARDemoProps) {
  // State management
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Animation controls
  const playButtonControls = useAnimation()
  const overlayControls = useAnimation()
  const progressControls = useAnimation()

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle video metadata
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      if (progressRef.current) {
        const progress = (video.currentTime / video.duration) * 100
        progressControls.set({ scaleX: progress / 100 })
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (onComplete) onComplete()
    }

    const handleError = () => {
      setVideoError(true)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [progressControls, onComplete])

  // Onboarding flow
  useEffect(() => {
    if (!showOnboarding) return

    const timer = setTimeout(() => {
      if (currentStep < ONBOARDING_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        // Finish onboarding
        setTimeout(() => {
          setShowOnboarding(false)
          handlePlay()
        }, 500)
      }
    }, ONBOARDING_STEPS[currentStep].duration)

    return () => clearTimeout(timer)
  }, [showOnboarding, currentStep])

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && !isHovered) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    } else {
      setShowControls(true)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [isPlaying, isHovered])

  // Video controls
  const handlePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
      playButtonControls.start({ scale: 1 })
    } else {
      video.play()
      setIsPlaying(true)
      playButtonControls.start({ scale: [1, 1.2, 1] })
    }
  }, [isPlaying, playButtonControls])

  const handleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    const progressBar = e.currentTarget
    if (!video || !progressBar) return

    const rect = progressBar.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }, [])

  const handleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      setIsFullscreen(false)
    }
  }, [isFullscreen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Mobile fallback
  if (isMobile && videoError) {
    return (
      <div className="relative w-full max-w-6xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-glass-heavy">
        <img
          src={fallbackImageSrc}
          alt="AR Demo Preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
          <div className="text-center text-white px-6">
            <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Experience AR on Mobile</h3>
            <p className="text-lg opacity-90">Open this demo on a desktop for the full interactive experience</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Container */}
      <motion.div
        ref={containerRef}
        className="relative aspect-video rounded-3xl overflow-hidden shadow-glass-heavy bg-neutral-900 border border-white/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={() => setShowControls(true)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          loop={false}
          preload="metadata"
        />

        {/* Onboarding Overlay */}
        <AnimatePresence>
          {showOnboarding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-sm z-40 flex items-center justify-center"
            >
              <div className="text-center text-white px-6 max-w-2xl">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {ONBOARDING_STEPS.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: index <= currentStep ? 1 : 0.8,
                        opacity: index <= currentStep ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="w-8 h-8 text-health" />
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full border-2 ${
                            index === currentStep
                              ? 'border-health bg-health/20'
                              : 'border-white/30'
                          } flex items-center justify-center`}
                        >
                          {index === currentStep && (
                            <motion.div
                              className="w-3 h-3 rounded-full bg-health"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Current Step Content */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-6">{ONBOARDING_STEPS[currentStep].icon}</div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    {ONBOARDING_STEPS[currentStep].title}
                  </h3>
                  <p className="text-lg md:text-xl opacity-90">
                    {ONBOARDING_STEPS[currentStep].description}
                  </p>
                </motion.div>

                {/* Skip Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => {
                    setShowOnboarding(false)
                    handlePlay()
                  }}
                  className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-all flex items-center gap-2 mx-auto"
                >
                  Skip Tutorial
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 pointer-events-none" />

        {/* Progress Bar */}
        <motion.div
          ref={progressRef}
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30"
          initial={{ scaleX: 0 }}
          style={{ transformOrigin: 'left' }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-health to-accent"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: duration > 0 ? currentTime / duration : 0,
            }}
            transition={{ duration: 0.1 }}
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Controls Overlay */}
        <AnimatePresence>
          {(showControls || isHovered) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              {/* Center Play Button */}
              <motion.button
                animate={playButtonControls}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlay()
                }}
                className="pointer-events-auto relative group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulse Ring */}
                {!isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/20 blur-xl"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                {/* Button */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-glass-lg border-2 border-white/50">
                  {isPlaying ? (
                    <Pause className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                  ) : (
                    <Play className="w-10 h-10 md:w-12 md:h-12 text-primary ml-1" fill="currentColor" />
                  )}
                </div>
              </motion.button>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent pointer-events-auto">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <motion.button
                    onClick={handlePlay}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </motion.button>

                  {/* Time */}
                  <span className="text-white text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  {/* Progress Bar (Clickable) */}
                  <div
                    className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer relative group"
                    onClick={handleSeek}
                  >
                    <motion.div
                      className="absolute inset-0 h-full bg-gradient-to-r from-primary via-health to-accent rounded-full"
                      style={{
                        width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      }}
                    />
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-white/10" />
                  </div>

                  {/* Mute */}
                  <motion.button
                    onClick={handleMute}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </motion.button>

                  {/* Fullscreen */}
                  <motion.button
                    onClick={handleFullscreen}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Demo Type Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-3 left-6 px-4 py-2 bg-gradient-to-r from-primary/90 to-health/90 backdrop-blur-sm rounded-full text-white text-sm font-medium shadow-lg border border-white/20"
      >
        {demoType === 'video' ? '📹 Cinematic Demo' : '🎮 Interactive WebGL'}
      </motion.div>
    </div>
  )
}

