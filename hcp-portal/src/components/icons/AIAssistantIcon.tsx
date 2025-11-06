'use client'

import React from 'react'

interface AIAssistantIconProps {
  size?: number
  className?: string
}

/**
 * Custom AI Assistant Icon - Friendly brain with circuit pattern
 * Features an animated brain with neural network connections
 */
export function AIAssistantIcon({ size = 24, className = '' }: AIAssistantIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain outline */}
      <path
        d="M32 8 C24 8, 16 12, 16 20 C16 22, 14 24, 14 28 C14 32, 16 34, 16 38 C16 44, 20 48, 24 50 C22 52, 22 54, 24 56 C26 58, 28 58, 30 56 C32 58, 36 58, 38 56 C40 54, 40 52, 38 50 C42 48, 46 44, 46 38 C46 34, 48 32, 48 28 C48 24, 46 22, 46 20 C46 12, 40 8, 32 8 Z"
        fill="url(#brainGradient)"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Neural network connections */}
      <path
        d="M20 28 Q26 24, 32 28 Q38 24, 44 28"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M22 38 Q28 34, 32 38 Q36 34, 42 38"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      
      {/* Circuit nodes */}
      <circle cx="22" cy="28" r="2" fill="currentColor" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="32" cy="28" r="2.5" fill="currentColor" opacity="0.7">
        <animate
          attributeName="opacity"
          values="0.7;1;0.7"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="42" cy="28" r="2" fill="currentColor" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="1.4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="26" cy="38" r="2" fill="currentColor" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="32" cy="38" r="2.5" fill="currentColor" opacity="0.7">
        <animate
          attributeName="opacity"
          values="0.7;1;0.7"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="38" cy="38" r="2" fill="currentColor" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="1.3s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Thought bubbles */}
      <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.3">
        <animate
          attributeName="opacity"
          values="0.3;0.6;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="46" cy="18" r="3" fill="currentColor" opacity="0.3">
        <animate
          attributeName="opacity"
          values="0.3;0.6;0.3"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  )
}

