'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/reusable'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check Clerk first if configured
      const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      
      if (clerkKey) {
        // If Clerk is configured, check for Clerk session
        // We'll handle this in the dashboard redirect logic
        return
      }
      
      // If Clerk is not configured, check localStorage
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      if (isAuthenticated === 'true') {
        console.log('✅ User already authenticated, redirecting to dashboard...')
        router.push('/dashboard')
        // Use setTimeout to ensure navigation happens
        setTimeout(() => {
          if (window.location.pathname === '/auth/login') {
            window.location.href = '/dashboard'
          }
        }, 100)
      }
    }
    
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setError(null)
    
    console.log('=== LOGIN FORM SUBMITTED ===')
    console.log('Email:', email)
    console.log('Password:', password ? '***' : 'empty')
    
    // Validate form
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      console.log('❌ Validation failed: missing fields')
      return
    }
    
    setIsLoading(true)
    console.log('✅ Validation passed, starting login...')
    
    try {
      // Check if Clerk is configured
      let useClerk = false
      let clerkSignIn: any = null
      let clerkSetActive: any = null

      try {
        const clerk = require('@clerk/nextjs')
        const { useAuth, useSignIn } = clerk
        
        // Try to use Clerk if available
        if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
          useClerk = true
          // Note: We can't call hooks conditionally, so we'll use direct Clerk API
          // For now, use localStorage fallback
          useClerk = false // Fallback to localStorage for now
        }
      } catch (e) {
        // Clerk not available, use localStorage
        console.log('Clerk not configured, using localStorage')
      }

      if (useClerk && clerkSignIn) {
        // Use Clerk authentication
        console.log('🔐 Using Clerk authentication...')
        
        const result = await clerkSignIn.create({
          identifier: email,
          password: password,
        })

        if (result.status === 'complete' && clerkSetActive) {
          await clerkSetActive({ session: result.createdSessionId })
          console.log('✅ Clerk login successful!')
          router.push('/dashboard')
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 100)
          return
        }
      } else {
        // Fallback: Use localStorage authentication (development mode)
        console.log('🔓 Using localStorage authentication (development mode)...')
        
        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Store login state in localStorage
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', email)
        
        console.log('✅ Login successful!')
        console.log('🔄 Attempting navigation to /dashboard...')
        
        // Reset form state before redirect
        setIsLoading(false)
        setEmail('')
        setPassword('')
        
        // Use window.location for full page reload (most reliable)
        // Add a small delay to ensure localStorage is set
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 100)
      }
    } catch (err: any) {
      console.error('❌ Login error:', err)
      
      // Extract error message
      let errorMessage = 'Login failed. Please try again.'
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors[0].message || errorMessage
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Care Crew account"
      footer={
        <p className="text-sm" style={{ color: '#d1d5db' }}>
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium" style={{ color: '#0A84FF' }}>
            Sign up for free
          </Link>
        </p>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pr-4 pl-[3.5rem] rounded-xl border transition-all duration-200"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(28, 28, 28, 0.7)',
                color: '#ffffff'
              }}
              placeholder="name@company.com"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#ffffff' }}>
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pr-4 pl-[3.5rem] rounded-xl border transition-all duration-200"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(28, 28, 28, 0.7)',
                color: '#ffffff'
              }}
              placeholder="••••••••"
            />
          </div>
        </motion.div>

        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember" className="ml-2 text-sm" style={{ color: '#d1d5db' }}>
            Remember me for 30 days
          </label>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-primary text-base py-6 hover:opacity-90 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: 'linear-gradient(135deg, #0A84FF 0%, #0869CC 100%)',
              color: '#ffffff',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            aria-label="Sign in to your account"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </motion.div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent" style={{ color: '#9ca3af' }}>
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="button"
            variant="outline"
            className="w-full py-6 border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            size="lg"
            onClick={() => {
              // Google login handler
              console.log('Google login clicked')
            }}
          >
            <svg className="mr-3 w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  )
}