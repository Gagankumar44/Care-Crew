'use client'

import React, { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Lazy load lottie-react to reduce initial bundle size
const Lottie = lazy(() => import('lottie-react'))

interface LottieAnimationProps {
  animationData: object | string // JSON object or path to JSON file
  className?: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
  ariaLabel?: string
}

/**
 * LottieAnimation - Lazy-loaded Lottie animation component
 * Only loads after component is mounted
 */
export function LottieAnimation({
  animationData,
  className,
  loop = true,
  autoplay = true,
  speed = 1,
  ariaLabel,
}: LottieAnimationProps) {
  const [animationDataState, setAnimationDataState] = React.useState<object | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // If animationData is a string (path), fetch it
    if (typeof animationData === 'string') {
      fetch(animationData)
        .then((res) => res.json())
        .then((data) => {
          setAnimationDataState(data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error('Failed to load Lottie animation:', err)
          setIsLoading(false)
        })
    } else {
      // If it's already an object, use it directly
      setAnimationDataState(animationData)
      setIsLoading(false)
    }
  }, [animationData])

  if (isLoading || !animationDataState) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className={cn('flex items-center justify-center', className)}>
          <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
        </div>
      }
    >
      <div 
        className={cn('flex items-center justify-center', className)}
        role="img"
        aria-label={ariaLabel || 'Animated illustration'}
      >
        <Lottie
          animationData={animationDataState}
          loop={loop}
          autoplay={autoplay}
          speed={speed}
          className="w-full h-full"
        />
      </div>
    </Suspense>
  )
}

/**
 * Placeholder Lottie animations for micro-interactions
 * These are minimal animations for UI feedback
 */
export const MicroAnimations = {
  // Success checkmark
  success: {
    // In production, this would load from /animations/success.json
    animationData: null,
  },
  // Loading spinner
  loading: {
    animationData: null,
  },
  // Error cross
  error: {
    animationData: null,
  },
}
