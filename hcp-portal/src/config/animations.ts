/**
 * Animation System Tokens & Configuration
 * 
 * Provides centralized animation tokens (easing & timing) and
 * reusable animation recipes for the entire application.
 */

import { Variants, Transition, Easing } from 'framer-motion'

// ============================================
// ANIMATION TIMING TOKENS
// ============================================

export const timing = {
  // Duration tokens (in seconds)
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  medium: 0.4,
  slow: 0.6,
  slower: 0.8,
  slowest: 1.0,

  // Delay tokens
  delayInstant: 0.05,
  delayShort: 0.1,
  delayMedium: 0.2,
  delayLong: 0.3,
  delayLonger: 0.5,
  
  // Stagger delays
  staggerFast: 0.05,
  staggerNormal: 0.1,
  staggerMedium: 0.15,
  staggerSlow: 0.2,
} as const

// ============================================
// ANIMATION EASING TOKENS
// ============================================

export const easing = {
  // Standard easing curves
  linear: [0, 0, 1, 1] as Easing,
  easeIn: [0.42, 0, 1, 1] as Easing,
  easeOut: [0, 0, 0.58, 1] as Easing,
  easeInOut: [0.42, 0, 0.58, 1] as Easing,
  
  // Custom easing curves (premium feel)
  smooth: [0.22, 1, 0.36, 1] as Easing, // Smooth, natural motion
  bounce: [0.68, -0.55, 0.265, 1.55] as Easing, // Subtle bounce
  elastic: [0.68, -0.6, 0.32, 1.6] as Easing, // Elastic feel
  
  // Material Design inspired
  standard: [0.4, 0, 0.2, 1] as Easing,
  decelerate: [0, 0, 0.2, 1] as Easing,
  accelerate: [0.4, 0, 1, 1] as Easing,
  
  // Custom healthcare/medical feel
  gentle: [0.25, 0.46, 0.45, 0.94] as Easing, // Gentle, caring motion
  confident: [0.16, 1, 0.3, 1] as Easing, // Confident, professional
} as const

// ============================================
// ANIMATION DISTANCE TOKENS
// ============================================

export const distance = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
} as const

// ============================================
// ANIMATION SCALE TOKENS
// ============================================

export const scale = {
  shrink: 0.9,
  small: 0.95,
  normal: 1,
  grow: 1.05,
  large: 1.1,
  xlarge: 1.15,
} as const

// ============================================
// BASE TRANSITIONS
// ============================================

export const transitions = {
  instant: {
    duration: timing.instant,
    ease: easing.linear,
  } as Transition,
  
  fast: {
    duration: timing.fast,
    ease: easing.easeOut,
  } as Transition,
  
  normal: {
    duration: timing.normal,
    ease: easing.smooth,
  } as Transition,
  
  medium: {
    duration: timing.medium,
    ease: easing.smooth,
  } as Transition,
  
  slow: {
    duration: timing.slow,
    ease: easing.smooth,
  } as Transition,
  
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  } as Transition,
  
  springBouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15,
  } as Transition,
  
  springGentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  } as Transition,
} as const

// ============================================
// BASE VARIANTS
// ============================================

export const baseVariants = {
  // Fade variants
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: transitions.normal,
    },
  },
  
  // Slide variants
  slideUp: {
    hidden: { opacity: 0, y: distance.medium },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.normal,
    },
  },
  
  slideDown: {
    hidden: { opacity: 0, y: -distance.medium },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.normal,
    },
  },
  
  slideLeft: {
    hidden: { opacity: 0, x: distance.medium },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: transitions.normal,
    },
  },
  
  slideRight: {
    hidden: { opacity: 0, x: -distance.medium },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: transitions.normal,
    },
  },
  
  // Scale variants
  scale: {
    hidden: { opacity: 0, scale: scale.small },
    visible: { 
      opacity: 1, 
      scale: scale.normal,
      transition: transitions.normal,
    },
  },
  
  // Rotate variants
  rotate: {
    hidden: { opacity: 0, rotate: -5 },
    visible: { 
      opacity: 1, 
      rotate: 0,
      transition: transitions.normal,
    },
  },
  
  // Combined variants
  fadeSlideUp: {
    hidden: { opacity: 0, y: distance.large },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.normal,
    },
  },
  
  fadeScale: {
    hidden: { opacity: 0, scale: scale.small },
    visible: { 
      opacity: 1, 
      scale: scale.normal,
      transition: transitions.normal,
    },
  },
} as const

// ============================================
// HOVER VARIANTS
// ============================================

export const hoverVariants = {
  lift: {
    rest: { y: 0, scale: scale.normal },
    hover: { 
      y: -distance.small,
      scale: scale.grow,
      transition: transitions.fast,
    },
  },
  
  scale: {
    rest: { scale: scale.normal },
    hover: { 
      scale: scale.grow,
      transition: transitions.fast,
    },
  },
  
  glow: {
    rest: { 
      opacity: 0.8,
      scale: scale.normal,
    },
    hover: { 
      opacity: 1,
      scale: scale.grow,
      transition: transitions.fast,
    },
  },
  
  slide: {
    rest: { x: 0 },
    hover: { 
      x: distance.small,
      transition: transitions.fast,
    },
  },
} as const

// ============================================
// FOCUS VARIANTS
// ============================================

export const focusVariants = {
  ring: {
    rest: { scale: scale.normal },
    focus: { 
      scale: scale.grow,
      transition: transitions.instant,
    },
  },
  
  glow: {
    rest: { opacity: 0.9 },
    focus: { 
      opacity: 1,
      transition: transitions.instant,
    },
  },
} as const

// ============================================
// SCROLL VARIANTS
// ============================================

export const scrollVariants = {
  fadeIn: {
    hidden: { opacity: 0, y: distance.large },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: timing.slow,
        ease: easing.smooth,
      },
    },
  },
  
  fadeInScale: {
    hidden: { opacity: 0, scale: scale.small, y: distance.medium },
    visible: { 
      opacity: 1, 
      scale: scale.normal,
      y: 0,
      transition: {
        duration: timing.slow,
        ease: easing.smooth,
      },
    },
  },
  
  slideInLeft: {
    hidden: { opacity: 0, x: -distance.xlarge },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: timing.slow,
        ease: easing.smooth,
      },
    },
  },
  
  slideInRight: {
    hidden: { opacity: 0, x: distance.xlarge },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: timing.slow,
        ease: easing.smooth,
      },
    },
  },
} as const

// ============================================
// STAGGER CONTAINER VARIANTS
// ============================================

export const staggerContainer = (staggerDelay: number = timing.staggerNormal) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
    },
  },
}) as Variants

export const staggerItem = {
  hidden: { opacity: 0, y: distance.medium },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
} as Variants

// ============================================
// TYPE EXPORTS
// ============================================

export type TimingToken = typeof timing[keyof typeof timing]
export type EasingToken = typeof easing[keyof typeof easing]
export type DistanceToken = typeof distance[keyof typeof distance]
export type ScaleToken = typeof scale[keyof typeof scale]

