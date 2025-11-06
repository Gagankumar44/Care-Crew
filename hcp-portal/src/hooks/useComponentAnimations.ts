/**
 * Component-Specific Animation Hooks
 * 
 * Provides specialized animation hooks for:
 * - Hero section
 * - Demo section
 * - Card components
 * - CTA sections
 */

'use client'

import { useRef } from 'react'
import { useInView, Variants, MotionProps } from 'framer-motion'
import {
  timing,
  easing,
  distance,
  scale,
  transitions,
} from '@/config/animations'

// ============================================
// HERO SECTION ANIMATIONS
// ============================================

/**
 * Hook for hero badge animation
 */
export function useHeroBadge(delay: number = timing.delayShort) {
  return {
    initial: { opacity: 0, scale: scale.small },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: timing.normal,
      delay,
      ease: easing.smooth,
    },
  } as MotionProps
}

/**
 * Hook for hero title animation
 */
export function useHeroTitle(delay: number = timing.delayMedium) {
  return {
    initial: { opacity: 0, y: distance.large },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: timing.slow,
      delay,
      ease: easing.confident,
    },
  } as MotionProps
}

/**
 * Hook for hero description animation
 */
export function useHeroDescription(delay: number = timing.delayLong) {
  return {
    initial: { opacity: 0, y: distance.medium },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: timing.slow,
      delay,
      ease: easing.smooth,
    },
  } as MotionProps
}

/**
 * Hook for hero CTA buttons animation
 */
export function useHeroCTA(delay: number = timing.delayLonger) {
  return {
    initial: { opacity: 0, scale: scale.small, y: distance.medium },
    animate: { opacity: 1, scale: 1, y: 0 },
    whileHover: {
      scale: scale.grow,
      y: -distance.tiny,
      transition: transitions.fast,
    },
    transition: {
      duration: timing.medium,
      delay,
      ease: easing.smooth,
    },
  } as MotionProps
}

/**
 * Hook for hero stats/trust indicators animation
 */
export function useHeroStats(delay: number = timing.delayLonger + timing.delayMedium) {
  return {
    initial: { opacity: 0, y: distance.medium },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: timing.slow,
      delay,
      ease: easing.smooth,
    },
  } as MotionProps
}

/**
 * Complete hero animation hook with staggered children
 */
export function useHeroAnimations() {
  return {
    badge: useHeroBadge(timing.delayShort),
    title: useHeroTitle(timing.delayMedium),
    description: useHeroDescription(timing.delayLong),
    cta: useHeroCTA(timing.delayLonger),
    stats: useHeroStats(timing.delayLonger + timing.delayMedium),
  }
}

// ============================================
// DEMO SECTION ANIMATIONS
// ============================================

/**
 * Hook for demo section header animation
 */
export function useDemoHeader(threshold: number = 0.1) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, y: distance.large },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance.large },
    transition: {
      duration: timing.slow,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook for demo video container animation
 */
export function useDemoVideo(threshold: number = 0.1) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, scale: scale.small },
    animate: isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: scale.small },
    transition: {
      duration: timing.slower,
      delay: timing.delayMedium,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook for demo play button animation
 */
export function useDemoPlayButton() {
  return {
    whileHover: {
      scale: scale.large,
      transition: transitions.fast,
    },
    whileTap: {
      scale: scale.small,
      transition: transitions.instant,
    },
  } as MotionProps
}

/**
 * Hook for demo feature badges animation
 */
export function useDemoFeatures(
  threshold: number = 0.1,
  itemCount: number = 4
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  
  return {
    ref,
    container: {
      initial: 'hidden',
      animate: isInView ? 'visible' : 'hidden',
      variants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: timing.staggerNormal,
          },
        },
      } as Variants,
    },
    item: {
      variants: {
        hidden: { opacity: 0, scale: scale.small },
        visible: {
          opacity: 1,
          scale: 1,
          transition: transitions.normal,
        },
      } as Variants,
    },
  }
}

/**
 * Complete demo animation hook
 */
export function useDemoAnimations() {
  return {
    header: useDemoHeader(),
    video: useDemoVideo(),
    playButton: useDemoPlayButton(),
    features: useDemoFeatures(),
  }
}

// ============================================
// CARD COMPONENT ANIMATIONS
// ============================================

/**
 * Hook for card entrance animation
 */
export function useCardEntrance(
  index: number = 0,
  threshold: number = 0.1
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, y: distance.large, scale: scale.small },
    animate: isInView 
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 0, y: distance.large, scale: scale.small },
    transition: {
      duration: timing.slow,
      delay: index * timing.staggerNormal,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook for card hover animation
 */
export function useCardHover() {
  return {
    whileHover: {
      y: -distance.small,
      scale: scale.grow,
      transition: transitions.fast,
    },
    style: {
      transformStyle: 'preserve-3d' as const,
    },
  } as MotionProps
}

/**
 * Hook for card focus animation
 */
export function useCardFocus() {
  return {
    whileFocus: {
      scale: scale.grow,
      transition: transitions.instant,
    },
  } as MotionProps
}

/**
 * Hook for card icon animation
 */
export function useCardIcon() {
  return {
    whileHover: {
      scale: scale.large,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: timing.medium,
        ease: easing.elastic,
      },
    },
  } as MotionProps
}

/**
 * Complete card animation hook
 */
export function useCardAnimations(index: number = 0, threshold: number = 0.1) {
  const entrance = useCardEntrance(index, threshold)
  
  return {
    ...entrance,
    ...useCardHover(),
    ...useCardFocus(),
    icon: useCardIcon(),
  }
}

/**
 * Hook for feature grid card animations
 */
export function useFeatureGridCards(
  threshold: number = 0.1,
  staggerDelay: number = timing.staggerNormal
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  
  return {
    ref,
    container: {
      initial: 'hidden',
      animate: isInView ? 'visible' : 'hidden',
      variants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      } as Variants,
    },
    item: {
      variants: {
        hidden: { opacity: 0, y: distance.large, scale: scale.small },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: timing.slow,
            ease: easing.smooth,
          },
        },
      } as Variants,
    },
  }
}

// ============================================
// CTA SECTION ANIMATIONS
// ============================================

/**
 * Hook for CTA section container animation
 */
export function useCTAContainer(threshold: number = 0.1) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, y: distance.large },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance.large },
    transition: {
      duration: timing.slow,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook for CTA badge animation
 */
export function useCTABadge(delay: number = timing.delayShort) {
  return {
    initial: { opacity: 0, scale: scale.small },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: timing.normal,
      delay,
      ease: easing.smooth,
    },
  } as MotionProps
}

/**
 * Hook for CTA heading animation
 */
export function useCTAHeading(delay: number = timing.delayMedium) {
  return {
    initial: { opacity: 0, y: distance.medium },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: timing.slow,
      delay,
      ease: easing.confident,
    },
  } as MotionProps
}

/**
 * Hook for CTA description animation
 */
export function useCTADescription(delay: number = timing.delayLong) {
  return {
    initial: { opacity: 0, y: distance.medium },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: timing.slow,
      delay,
      ease: easing.smooth,
    },
  } as MotionProps
}

/**
 * Hook for CTA buttons animation
 */
export function useCTAButtons(delay: number = timing.delayLonger) {
  return {
    initial: { opacity: 0, scale: scale.small, y: distance.medium },
    animate: { opacity: 1, scale: 1, y: 0 },
    whileHover: {
      scale: scale.grow,
      y: -distance.tiny,
      transition: transitions.fast,
    },
    whileTap: {
      scale: scale.small,
      transition: transitions.instant,
    },
    transition: {
      duration: timing.medium,
      delay,
      ease: easing.smooth,
    },
  } as MotionProps
}

/**
 * Hook for CTA trust indicators animation
 */
export function useCTATrustIndicators(delay: number = timing.delayLonger + timing.delayShort) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: timing.slow,
      delay,
      ease: easing.smooth,
    },
  } as MotionProps
}

/**
 * Complete CTA animation hook
 */
export function useCTAAnimations() {
  const container = useCTAContainer()
  
  return {
    container,
    badge: useCTABadge(timing.delayShort),
    heading: useCTAHeading(timing.delayMedium),
    description: useCTADescription(timing.delayLong),
    buttons: useCTAButtons(timing.delayLonger),
    trustIndicators: useCTATrustIndicators(timing.delayLonger + timing.delayShort),
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Creates a delay multiplier for staggered animations
 */
export function createStaggerDelay(
  baseDelay: number,
  index: number,
  multiplier: number = timing.staggerNormal
) {
  return baseDelay + (index * multiplier)
}

/**
 * Creates a sequence of delays for consecutive elements
 */
export function createSequenceDelays(
  count: number,
  baseDelay: number = 0,
  staggerDelay: number = timing.staggerNormal
) {
  return Array.from({ length: count }, (_, i) => 
    baseDelay + (i * staggerDelay)
  )
}

