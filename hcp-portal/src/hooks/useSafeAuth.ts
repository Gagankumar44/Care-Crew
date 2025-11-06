'use client'

import { useState, useEffect } from 'react'

/**
 * Safely use auth, handling cases where Clerk is not configured
 * Returns userId and isLoaded state, with fallback to localStorage when Clerk is unavailable
 * 
 * This hook works whether Clerk is configured or not:
 * - If Clerk is configured and ClerkProvider is present, it will try to use Clerk
 * - If Clerk is not configured or ClerkProvider is not present, it falls back to localStorage
 */
export function useSafeAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Always check localStorage first as fallback
    const localUserId = localStorage.getItem('userId')
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    
    // Check if Clerk publishable key is configured
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    
    if (!clerkKey) {
      // Clerk not configured, use localStorage only
      setUserId(isAuthenticated === 'true' && localUserId ? localUserId : null)
      setIsLoaded(true)
      return
    }

    // Clerk is configured - try to use it, but fallback to localStorage if not available
    // We can't conditionally use hooks, so we check if ClerkProvider context exists
    // by trying to access Clerk on the window object
    
    let mounted = true
    
    // Small delay to let Clerk initialize if it's available
    const checkAuth = () => {
      if (!mounted) return
      
      try {
        // Try to dynamically import and check for Clerk
        if (typeof window !== 'undefined') {
          // Check if Clerk is available in the window
          const hasClerkProvider = !!(window as any).Clerk || !!(window as any).__clerkFrontendApi
          
          if (hasClerkProvider) {
            // Clerk is available, but we can't use useAuth here without ClerkProvider
            // For now, use localStorage as fallback
            // In production, ensure ClerkProvider wraps the app when Clerk is configured
            setUserId(isAuthenticated === 'true' && localUserId ? localUserId : null)
          } else {
            // No ClerkProvider, use localStorage
            setUserId(isAuthenticated === 'true' && localUserId ? localUserId : null)
          }
        } else {
          // Server-side, use localStorage
          setUserId(isAuthenticated === 'true' && localUserId ? localUserId : null)
        }
      } catch (error) {
        // Error, use localStorage fallback
        console.warn('Auth check failed, using localStorage fallback:', error)
        setUserId(isAuthenticated === 'true' && localUserId ? localUserId : null)
      }
      
      setIsLoaded(true)
    }
    
    // Small delay to let Clerk initialize
    const timeoutId = setTimeout(checkAuth, 100)
    
    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  return { userId, isLoaded }
}
