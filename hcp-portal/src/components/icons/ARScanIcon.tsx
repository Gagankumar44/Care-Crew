'use client'

import React from 'react'

interface ARScanIconProps {
  size?: number
  className?: string
}

/**
 * Custom AR Scan Icon - 3D-style illustration
 * Features a camera/viewfinder with AR grid overlay
 */
export function ARScanIcon({ size = 24, className = '' }: ARScanIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Camera body with gradient */}
      <rect
        x="12"
        y="20"
        width="40"
        height="28"
        rx="4"
        fill="url(#arGradient)"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Viewfinder */}
      <rect
        x="18"
        y="26"
        width="28"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
      
      {/* AR Grid overlay */}
      <path
        d="M32 26 L32 42 M18 34 L46 34"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      
      {/* Corner brackets (AR tracking markers) */}
      <path
        d="M20 28 L24 28 L24 32 M44 28 L40 28 L40 32 M20 40 L24 40 L24 36 M44 40 L40 40 L40 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Lens */}
      <circle
        cx="32"
        cy="34"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      
      {/* Scan lines animation */}
      <rect
        x="18"
        y="26"
        width="28"
        height="2"
        fill="currentColor"
        opacity="0.3"
      >
        <animate
          attributeName="y"
          values="26;40;26"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      
      {/* Sparkles/particles */}
      <circle cx="24" cy="30" r="1.5" fill="currentColor" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="40" cy="38" r="1.5" fill="currentColor" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="arGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  )
}

