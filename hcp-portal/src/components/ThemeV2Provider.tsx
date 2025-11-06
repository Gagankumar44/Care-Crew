'use client'

import { createContext, useContext, useEffect, useState, ReactNode, Suspense } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'

interface ThemeV2ContextType {
  isThemeV2: boolean
  setThemeV2: (enabled: boolean) => void
}

const ThemeV2Context = createContext<ThemeV2ContextType | undefined>(undefined)

export function useThemeV2Context() {
  const context = useContext(ThemeV2Context)
  if (context === undefined) {
    throw new Error('useThemeV2Context must be used within ThemeV2Provider')
  }
  return context
}

interface ThemeV2ProviderProps {
  children: ReactNode
}

/**
 * Theme V2 Provider
 * 
 * Manages Theme V2 state across the application
 * Checks:
 * 1. Query param ?theme=v2 (highest priority)
 * 2. Environment variable NEXT_PUBLIC_THEME_V2
 */
function ThemeV2ProviderInner({ children }: ThemeV2ProviderProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isThemeV2, setIsThemeV2] = useState(false)

  useEffect(() => {
    // Check query parameter first (runtime override)
    const themeParam = searchParams?.get('theme')
    if (themeParam === 'v2') {
      setIsThemeV2(true)
      // Store in sessionStorage for persistence across navigation
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('theme_v2', 'true')
      }
      return
    }

    // Check environment variable (accessible via window.__NEXT_DATA__ or directly)
    // Next.js exposes env vars prefixed with NEXT_PUBLIC_ to the client
    // Also check THEME_V2 for server-side rendering compatibility
    const envValue = process.env.NEXT_PUBLIC_THEME_V2 || 
                     process.env.THEME_V2 ||
                     (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.THEME_V2) ||
                     (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_THEME_V2)
    if (envValue === 'true' || envValue === '1') {
      setIsThemeV2(true)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('theme_v2', 'true')
      }
      return
    }

    // Check sessionStorage (if query param was removed)
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('theme_v2')
      if (stored === 'true' && themeParam !== 'v1') {
        // Keep v2 if it was previously set, unless explicitly set to v1
        setIsThemeV2(true)
        return
      }
    }

    setIsThemeV2(false)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('theme_v2')
    }
  }, [searchParams, pathname])

  const setThemeV2 = (enabled: boolean) => {
    setIsThemeV2(enabled)
    if (typeof window !== 'undefined') {
      if (enabled) {
        sessionStorage.setItem('theme_v2', 'true')
      } else {
        sessionStorage.removeItem('theme_v2')
      }
    }
  }

  return (
    <ThemeV2Context.Provider value={{ isThemeV2, setThemeV2 }}>
      <div className={isThemeV2 ? 'theme-v2' : 'theme-v1'}>
        {children}
      </div>
    </ThemeV2Context.Provider>
  )
}

export function ThemeV2Provider({ children }: ThemeV2ProviderProps) {
  return (
    <Suspense fallback={<div className="theme-v1">{children}</div>}>
      <ThemeV2ProviderInner>{children}</ThemeV2ProviderInner>
    </Suspense>
  )
}

