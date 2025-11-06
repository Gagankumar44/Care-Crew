'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/reusable'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('Register button clicked!')
    
    // Validate form
    if (!name || !email || !password) {
      console.log('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      console.log('Registration successful, redirecting to dashboard...')
      
      // Store registration state
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', email)
      
      // Force navigation - use window.location for full page reload
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Register error:', error)
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with Care Crew today"
      footer={
        <p className="text-sm" style={{ color: '#d1d5db' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium" style={{ color: '#0A84FF' }}>
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-3 pr-4 pl-[3.5rem] rounded-xl border transition-all duration-200"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(28, 28, 28, 0.7)',
                color: '#ffffff'
              }}
              placeholder="John Doe"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
            Password
          </label>
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
          <p className="mt-2 text-xs" style={{ color: '#9ca3af' }}>
            Must be at least 8 characters
          </p>
        </motion.div>

        <motion.div
          className="flex items-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <input
            id="terms"
            type="checkbox"
            required
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
          />
          <label htmlFor="terms" className="ml-2 text-sm" style={{ color: '#d1d5db' }}>
            I agree to the{' '}
            <Link href="/terms" className="font-medium" style={{ color: '#0A84FF' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium" style={{ color: '#0A84FF' }}>
              Privacy Policy
            </Link>
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="button"
            disabled={isLoading}
            className="w-full bg-gradient-primary text-base py-6 hover:opacity-90"
            size="lg"
            onClick={handleSubmit}
            style={{ 
              background: 'linear-gradient(135deg, #0A84FF 0%, #0869CC 100%)',
              color: '#ffffff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              pointerEvents: isLoading ? 'none' : 'auto'
            }}
          >
            {isLoading ? (
              'Creating account...'
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent" style={{ color: '#9ca3af' }}>
              Or sign up with
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
            Sign up with Google
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  )
}
