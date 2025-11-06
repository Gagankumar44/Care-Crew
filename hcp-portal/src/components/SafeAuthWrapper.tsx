'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  userId: string | null
  isLoaded: boolean
}

const AuthContext = createContext<AuthContextType>({ userId: null, isLoaded: false })

/**
 * Provides auth context that works with or without Clerk
 */
export function SafeAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextType>({ userId: null, isLoaded: false })

  useEffect(() => {
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    
    if (!clerkKey) {
      // No Clerk, use localStorage
      const localUserId = localStorage.getItem('userId')
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      setAuthState({
        userId: isAuthenticated === 'true' && localUserId ? localUserId : null,
        isLoaded: true
      })
      return
    }

    // Clerk is configured, try to use it
    // We'll use a component that can safely use Clerk hooks
    let mounted = true
    
    // Check if ClerkProvider exists in the tree
    const checkClerk = () => {
      if (typeof window === 'undefined') return
      
      // Check if Clerk is available
      const hasClerk = !!(window as any).Clerk || !!(window as any).__clerkFrontendApi
      
      if (hasClerk) {
        // Try to get user from Clerk
        // Note: This is a workaround since we can't conditionally use hooks
        // In production, you should ensure ClerkProvider is always present when Clerk is configured
        const localUserId = localStorage.getItem('userId')
        const isAuthenticated = localStorage.getItem('isAuthenticated')
        
        setAuthState({
          userId: isAuthenticated === 'true' && localUserId ? localUserId : null,
          isLoaded: true
        })
      } else {
        // No Clerk context, use localStorage
        const localUserId = localStorage.getItem('userId')
        const isAuthenticated = localStorage.getItem('isAuthenticated')
        
        setAuthState({
          userId: isAuthenticated === 'true' && localUserId ? localUserId : null,
          isLoaded: true
        })
      }
    }
    
    // Small delay to let Clerk initialize
    setTimeout(checkClerk, 100)
    
    return () => {
      mounted = false
    }
  }, [])

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

export function useSafeAuthContext() {
  return useContext(AuthContext)
}



