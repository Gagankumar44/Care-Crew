'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Hook to determine if Theme V2 should be active
 * Checks both environment variable and query parameter
 * 
 * Priority:
 * 1. Query param ?theme=v2 (runtime override)
 * 2. Environment variable THEME_V2
 * 
 * @returns boolean indicating if Theme V2 is enabled
 */
export function useThemeV2(): boolean {
  const searchParams = useSearchParams()
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Check query parameter first (runtime override)
    const themeParam = searchParams?.get('theme')
    if (themeParam === 'v2') {
      setIsEnabled(true)
      return
    }

    // Check environment variable (client-side accessible via window)
    // Note: Server-side env vars need to be prefixed with NEXT_PUBLIC_ to be accessible client-side
    if (typeof window !== 'undefined') {
      // Check if we have it in sessionStorage (set by middleware or initial load)
      const stored = sessionStorage.getItem('theme_v2')
      if (stored === 'true') {
        setIsEnabled(true)
        return
      }
    }

    setIsEnabled(false)
  }, [searchParams])

  return isEnabled
}

/**
 * Get theme v2 status synchronously (for server components)
 * Checks environment variable
 */
export function getThemeV2Status(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: check environment variable
    // In Next.js, server-side env vars without NEXT_PUBLIC_ prefix are not accessible client-side
    // For server-side checks, use process.env.THEME_V2
    return process.env.THEME_V2 === 'true' || process.env.NEXT_PUBLIC_THEME_V2 === 'true'
  }

  // Client-side: check sessionStorage
  return sessionStorage.getItem('theme_v2') === 'true'
}

