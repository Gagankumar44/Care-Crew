/**
 * Reusable Animation Hooks
 * 
 * Provides React hooks for common animation patterns:
 * - Entrance animations
 * - Hover animations
 * - Focus animations
 * - Scroll-triggered animations
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
  baseVariants,
  hoverVariants,
  focusVariants,
  scrollVariants,
  staggerContainer,
  staggerItem,
} from '@/config/animations'

// ============================================
// ENTRANCE ANIMATION HOOKS
// ============================================

/**
 * Hook for fade-in entrance animation
 */
export function useFadeIn(delay: number = 0) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      ...transitions.normal,
      delay,
    },
  } as MotionProps
}

/**
 * Hook for slide-up entrance animation
 */
export function useSlideUp(delay: number = 0, distance: number = 24) {
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: {
      ...transitions.normal,
      delay,
    },
  } as MotionProps
}

/**
 * Hook for scale entrance animation
 */
export function useScaleIn(delay: number = 0, scaleValue: number = 0.95) {
  return {
    initial: { opacity: 0, scale: scaleValue },
    animate: { opacity: 1, scale: 1 },
    transition: {
      ...transitions.normal,
      delay,
    },
  } as MotionProps
}

/**
 * Hook for combined fade + slide + scale entrance
 */
export function useEntrance(
  delay: number = 0,
  options: {
    y?: number
    scale?: number
    x?: number
  } = {}
) {
  const { y = distance.medium, scale: scaleValue = scale.small, x = 0 } = options
  
  return {
    initial: { opacity: 0, y, x, scale: scaleValue },
    animate: { opacity: 1, y: 0, x: 0, scale: 1 },
    transition: {
      ...transitions.normal,
      delay,
    },
  } as MotionProps
}

/**
 * Hook for staggered entrance animations
 */
export function useStaggeredEntrance(
  itemCount: number,
  staggerDelay: number = timing.staggerNormal,
  initialDelay: number = 0
) {
  const containerVariants = staggerContainer(staggerDelay)
  
  return {
    container: {
      variants: containerVariants,
      initial: 'hidden',
      animate: 'visible',
    },
    item: {
      variants: staggerItem,
    },
  }
}

// ============================================
// HOVER ANIMATION HOOKS
// ============================================

/**
 * Hook for lift-on-hover animation
 */
export function useHoverLift(scaleValue: number = scale.grow) {
  return {
    whileHover: {
      y: -distance.small,
      scale: scaleValue,
      transition: transitions.fast,
    },
  } as MotionProps
}

/**
 * Hook for scale-on-hover animation
 */
export function useHoverScale(scaleValue: number = scale.grow) {
  return {
    whileHover: {
      scale: scaleValue,
      transition: transitions.fast,
    },
  } as MotionProps
}

/**
 * Hook for glow-on-hover animation
 */
export function useHoverGlow() {
  return {
    whileHover: {
      opacity: 1,
      scale: scale.grow,
      transition: transitions.fast,
    },
    style: { opacity: 0.8 },
  } as MotionProps
}

/**
 * Hook for slide-on-hover animation
 */
export function useHoverSlide(direction: 'left' | 'right' | 'up' | 'down' = 'right') {
  const directions = {
    left: { x: -distance.small },
    right: { x: distance.small },
    up: { y: -distance.small },
    down: { y: distance.small },
  }
  
  return {
    whileHover: {
      ...directions[direction],
      transition: transitions.fast,
    },
  } as MotionProps
}

// ============================================
// FOCUS ANIMATION HOOKS
// ============================================

/**
 * Hook for focus ring animation
 */
export function useFocusRing() {
  return {
    whileFocus: {
      scale: scale.grow,
      transition: transitions.instant,
    },
  } as MotionProps
}

/**
 * Hook for focus glow animation
 */
export function useFocusGlow() {
  return {
    whileFocus: {
      opacity: 1,
      transition: transitions.instant,
    },
    style: { opacity: 0.9 },
  } as MotionProps
}

// ============================================
// SCROLL-TRIGGERED ANIMATION HOOKS
// ============================================

/**
 * Hook for scroll-triggered fade-in animation
 */
export function useScrollFadeIn(
  threshold: number = 0.1,
  once: boolean = true,
  distance: number = distance.large
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, y: distance },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    transition: {
      duration: timing.slow,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook for scroll-triggered fade-in with scale
 */
export function useScrollFadeScale(
  threshold: number = 0.1,
  once: boolean = true
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, scale: scale.small, y: distance.medium },
    animate: isInView 
      ? { opacity: 1, scale: 1, y: 0 }
      : { opacity: 0, scale: scale.small, y: distance.medium },
    transition: {
      duration: timing.slow,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook for scroll-triggered slide-in from left
 */
export function useScrollSlideLeft(
  threshold: number = 0.1,
  once: boolean = true
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, x: -distance.xlarge },
    animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -distance.xlarge },
    transition: {
      duration: timing.slow,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook for scroll-triggered slide-in from right
 */
export function useScrollSlideRight(
  threshold: number = 0.1,
  once: boolean = true
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, x: distance.xlarge },
    animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: distance.xlarge },
    transition: {
      duration: timing.slow,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook for scroll-triggered staggered animations
 */
export function useScrollStagger(
  threshold: number = 0.1,
  once: boolean = true,
  staggerDelay: number = timing.staggerNormal
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const containerVariants = staggerContainer(staggerDelay)
  
  return {
    ref,
    container: {
      variants: containerVariants,
      initial: 'hidden',
      animate: isInView ? 'visible' : 'hidden',
    },
    item: {
      variants: staggerItem,
    },
  }
}

// ============================================
// COMBINED ANIMATION HOOKS
// ============================================

/**
 * Hook combining entrance + hover animations
 */
export function useEntranceHover(
  delay: number = 0,
  hoverScale: number = scale.grow
) {
  return {
    initial: { opacity: 0, y: distance.medium, scale: scale.small },
    animate: { opacity: 1, y: 0, scale: 1 },
    whileHover: {
      y: -distance.small,
      scale: hoverScale,
      transition: transitions.fast,
    },
    transition: {
      ...transitions.normal,
      delay,
    },
  } as MotionProps
}

/**
 * Hook combining scroll + hover animations
 */
export function useScrollHover(
  threshold: number = 0.1,
  once: boolean = true,
  hoverScale: number = scale.grow
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })
  
  return {
    ref,
    initial: { opacity: 0, y: distance.large },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance.large },
    whileHover: {
      y: -distance.small,
      scale: hoverScale,
      transition: transitions.fast,
    },
    transition: {
      duration: timing.slow,
      ease: easing.smooth,
    },
  }
}

/**
 * Hook combining entrance + focus animations
 */
export function useEntranceFocus(
  delay: number = 0
) {
  return {
    initial: { opacity: 0, y: distance.medium },
    animate: { opacity: 1, y: 0 },
    whileFocus: {
      scale: scale.grow,
      transition: transitions.instant,
    },
    transition: {
      ...transitions.normal,
      delay,
    },
  } as MotionProps
}

