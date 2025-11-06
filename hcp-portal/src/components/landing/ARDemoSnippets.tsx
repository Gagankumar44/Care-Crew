/**
 * Code Snippets for AR Demo Animations
 * 
 * Copy-paste ready snippets for:
 * - Framer Motion animations
 * - GSAP animations
 * - Lottie overlays
 * - CSS keyframes
 */

// ============================================
// FRAMER MOTION: Thumbnail Hover
// ============================================

export function ThumbnailHoverSnippet() {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative cursor-pointer group"
    >
      {/* Video Preview */}
      <motion.div
        whileHover={{ opacity: 0.7 }}
        transition={{ duration: 0.3 }}
      >
        <video poster="/demo-poster.jpg" />
      </motion.div>
      
      {/* Play Button Overlay */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0.8 }}
        whileHover={{ 
          scale: 1.1, 
          opacity: 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
          <PlayIcon className="w-10 h-10 text-primary ml-1" />
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// FRAMER MOTION: Play Button Pulse
// ============================================

export function PlayButtonPulseSnippet() {
  return (
    <motion.div
      className="relative"
      animate={{
        scale: [1, 1.15, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Pulse Ring */}
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
      
      {/* Play Button */}
      <div className="relative w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
        <PlayIcon className="w-12 h-12 text-primary ml-1" />
      </div>
    </motion.div>
  )
}

// ============================================
// GSAP: Progress Bar Animation
// ============================================

export function GSAPProgressBarSnippet() {
  // Use in useEffect or event handler
  /*
  import { gsap } from 'gsap'
  import { useRef, useEffect } from 'react'

  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !progressRef.current) return

    const updateProgress = () => {
      const progress = video.currentTime / video.duration
      
      gsap.to(progressRef.current, {
        scaleX: progress,
        duration: 0.1,
        ease: 'none',
        transformOrigin: 'left',
      })
    }

    video.addEventListener('timeupdate', updateProgress)
    
    return () => video.removeEventListener('timeupdate', updateProgress)
  }, [])
  */

  return (
    <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
      <div
        ref={progressRef}
        className="absolute inset-0 h-full bg-gradient-to-r from-primary via-health to-accent"
        style={{ transformOrigin: 'left' }}
      />
    </div>
  )
}

// ============================================
// GSAP: Step Transition
// ============================================

export function GSAPStepTransitionSnippet() {
  /*
  import { gsap } from 'gsap'

  const handleStepTransition = (currentStep: number, nextStep: number) => {
    // Fade out current step
    gsap.to(`.step-${currentStep}`, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        // Fade in next step
        gsap.fromTo(`.step-${nextStep}`, 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5,
            ease: 'power2.out'
          }
        )
      }
    })
  }
  */

  return null
}

// ============================================
// LOTTIE: Loading Animation Overlay
// ============================================

export function LottieLoadingSnippet() {
  /*
  import Lottie from 'lottie-react'
  import loadingAnimation from '@/public/animations/loading.json'

  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            autoplay={true}
            style={{ width: 200, height: 200 }}
            onComplete={() => setIsLoading(false)}
          />
        </div>
      )}
      <video onLoadedData={() => setIsLoading(false)} />
    </>
  )
  */
  return null
}

// ============================================
// LOTTIE: Play Button Hover
// ============================================

export function LottiePlayButtonHoverSnippet() {
  /*
  import Lottie from 'lottie-react'
  import playButtonHover from '@/public/animations/play-hover.json'

  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {isHovered && (
        <Lottie
          animationData={playButtonHover}
          loop={false}
          autoplay={true}
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />
      )}
      <PlayIcon />
    </div>
  )
  */
  return null
}

// ============================================
// CSS KEYFRAMES: Pulse Ring
// ============================================

export const CSSKeyframesSnippet = `
/* Add to your global CSS or Tailwind config */
@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

@keyframes play-button-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

@keyframes progress-glow {
  0% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
}

/* Usage in Tailwind */
.play-button-pulse {
  animation: play-button-pulse 2s ease-in-out infinite;
}

.pulse-ring {
  animation: pulse-ring 2s ease-in-out infinite;
}

.progress-glow {
  animation: progress-glow 2s ease-in-out infinite;
}
`

// ============================================
// MOCK HTML STRUCTURE
// ============================================

export const MockHTMLStructure = `
<!-- Premium AR Demo - HTML Structure -->
<div class="relative aspect-video rounded-3xl overflow-hidden bg-neutral-900">
  <!-- Video Element -->
  <video
    src="/demo.mp4"
    poster="/demo-poster.jpg"
    class="w-full h-full object-cover"
    muted
    playsinline
  />

  <!-- Gradient Overlay -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

  <!-- Onboarding Overlay (shown initially) -->
  <div class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
    <div class="text-center text-white px-6">
      <!-- Progress Steps -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="w-8 h-8 rounded-full border-2 border-health bg-health/20">
          <div class="w-3 h-3 rounded-full bg-health animate-pulse"></div>
        </div>
        <!-- More steps... -->
      </div>
      
      <!-- Current Step Content -->
      <div>
        <div class="text-6xl mb-6">📱</div>
        <h3 class="text-3xl font-bold mb-4">Point Your Camera</h3>
        <p class="text-lg opacity-90">Position your phone camera over the area</p>
      </div>
    </div>
  </div>

  <!-- Progress Bar (Bottom Edge) -->
  <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
    <div class="h-full bg-gradient-to-r from-primary via-health to-accent" 
         style="width: 45%"></div>
  </div>

  <!-- Controls Overlay -->
  <div class="absolute inset-0 flex items-center justify-center">
    <!-- Center Play Button -->
    <button class="relative">
      <!-- Pulse Ring -->
      <div class="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse"></div>
      
      <!-- Button -->
      <div class="relative w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
        <svg class="w-12 h-12 text-primary ml-1" fill="currentColor">
          <polygon points="10,5 25,15 10,25" />
        </svg>
      </div>
    </button>

    <!-- Bottom Controls -->
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
      <div class="flex items-center gap-4">
        <!-- Play/Pause -->
        <button>▶️</button>
        
        <!-- Time -->
        <span class="text-white text-sm">1:23 / 2:45</span>
        
        <!-- Progress Bar (Clickable) -->
        <div class="flex-1 h-2 bg-white/20 rounded-full cursor-pointer">
          <div class="h-full bg-gradient-to-r from-primary via-health to-accent rounded-full" 
               style="width: 45%"></div>
        </div>
        
        <!-- Mute -->
        <button>🔊</button>
        
        <!-- Fullscreen -->
        <button>⛶</button>
      </div>
    </div>
  </div>
</div>

<!-- Mobile Fallback -->
<img src="/demo-poster.jpg" alt="AR Demo Preview" class="w-full aspect-video object-cover rounded-3xl" />
`

