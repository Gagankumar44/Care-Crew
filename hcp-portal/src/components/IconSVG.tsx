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

interface IconSVGProps {
  name: IconName
  size?: 24 | 48
  className?: string
  ariaLabel?: string
  strokeWidth?: number
}

/**
 * IconSVG - Inline SVG icon component
 * Provides optimized, themeable SVG icons
 */
export function IconSVG({ 
  name, 
  size = 24, 
  className, 
  ariaLabel,
  strokeWidth = 1.8
}: IconSVGProps) {
  const icons: Record<IconName, (size: number, strokeWidth: number) => JSX.Element> = {
    hospital: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Hospital</title>
        <desc>Hospital building icon</desc>
        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h6M9 13h6M9 17h6"/>
      </svg>
    ),
    doctor: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Doctor</title>
        <desc>Doctor profile icon</desc>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
      </svg>
    ),
    stethoscope: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Stethoscope</title>
        <desc>Medical stethoscope icon</desc>
        <path d="M19 10c0 4.418-3.582 8-8 8s-8-3.582-8-8M11 10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1h1a1 1 0 0 1 1v2z"/>
        <path d="M11 10V8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M11 10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1M11 10a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1"/>
      </svg>
    ),
    ambulance: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Ambulance</title>
        <desc>Emergency ambulance icon</desc>
        <path d="M21 12h-4l-3 9H9l-3-9H2M5 12V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6M7 6h10M9 18h6"/>
      </svg>
    ),
    'heart-rate': (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Heart Rate</title>
        <desc>Heart rate monitor icon</desc>
        <path d="M12 5v14M7.5 12l2-2 2 2 3-3 2 2"/>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    'lab-test': (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Lab Test</title>
        <desc>Laboratory test tube icon</desc>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
    xray: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>X-Ray</title>
        <desc>X-ray scan icon</desc>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
      </svg>
    ),
    prescription: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Prescription</title>
        <desc>Medical prescription icon</desc>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
    wallet: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Wallet</title>
        <desc>Wallet icon</desc>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
    calendar: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Calendar</title>
        <desc>Calendar icon</desc>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    messages: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Messages</title>
        <desc>Message conversation icon</desc>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    settings: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Settings</title>
        <desc>Settings gear icon</desc>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6M5.636 5.636l4.243 4.243m4.242 4.242l4.243 4.243M1 12h6m6 0h6M5.636 18.364l4.243-4.243m4.242-4.242l4.243-4.243"/>
      </svg>
    ),
    emergency: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Emergency</title>
        <desc>Emergency alert icon</desc>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <path d="M12 9v4M12 17h.01"/>
      </svg>
    ),
    profile: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Profile</title>
        <desc>User profile icon</desc>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    trends: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Trends</title>
        <desc>Trending chart icon</desc>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    sleep: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Sleep</title>
        <desc>Sleep/moon icon</desc>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
    meds: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Medications</title>
        <desc>Medicine pills icon</desc>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12M6 12h12"/>
      </svg>
    ),
    breathing: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Breathing</title>
        <desc>Breathing/lungs icon</desc>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M3 21v-4m0 0v-4a4 4 0 0 1 4-4h4M21 3v4m0 4v4m-4-8h4M7 21H3"/>
      </svg>
    ),
    support: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Support</title>
        <desc>Support/help icon</desc>
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
      </svg>
    ),
    map: (s, sw) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <title>Map</title>
        <desc>Map location icon</desc>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <path d="M8 2v16M16 6v16"/>
      </svg>
    ),
  }

  const IconComponent = icons[name]
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <span
      className={cn('inline-flex items-center justify-center', className)}
      aria-label={ariaLabel || name}
      role="img"
    >
      {IconComponent(size, strokeWidth)}
    </span>
  )
}
