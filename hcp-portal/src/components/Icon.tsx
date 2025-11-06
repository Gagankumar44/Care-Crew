'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type IconName =
  | 'hospital'
  | 'doctor'
  | 'stethoscope'
  | 'ambulance'
  | 'heart-rate'
  | 'lab-test'
  | 'xray'
  | 'prescription'
  | 'wallet'
  | 'calendar'
  | 'messages'
  | 'settings'
  | 'emergency'
  | 'profile'
  | 'trends'
  | 'sleep'
  | 'meds'
  | 'breathing'
  | 'support'
  | 'map'

interface IconProps {
  name: IconName
  size?: 24 | 48
  className?: string
  ariaLabel?: string
}

/**
 * Icon component for inline SVG icons
 * Loads SVG icons from /public/icons/ directory
 */
export function Icon({ name, size = 24, className, ariaLabel }: IconProps) {
  const iconPath = `/icons/${name}-${size}.svg`

  return (
    <img
      src={iconPath}
      alt={ariaLabel || name}
      className={cn('inline-block', className)}
      width={size}
      height={size}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      loading="lazy"
    />
  )
}

// Fallback inline SVGs for critical icons (if needed for immediate rendering)
export function InlineIcon({ name, size = 24, className, ariaLabel }: IconProps) {
  // This would contain inline SVG code for immediate rendering
  // For now, we'll use the img approach above
  return <Icon name={name} size={size} className={className} ariaLabel={ariaLabel} />
}
