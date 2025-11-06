'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SkipLinkProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

/**
 * SkipLink - Accessibility skip navigation link
 * Allows keyboard users to skip to main content
 */
export function SkipLink({ 
  href = '#main-content', 
  children = 'Skip to main content',
  className 
}: SkipLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'sr-only focus:not-sr-only',
        'absolute top-4 left-4 z-[100]',
        'px-4 py-2 bg-teal-500 text-white rounded-lg font-medium',
        'focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2',
        'transition-all duration-200',
        className
      )}
      aria-label="Skip to main content"
    >
      {children}
    </Link>
  )
}

export default SkipLink