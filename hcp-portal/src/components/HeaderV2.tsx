'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, AlertCircle, Moon, Sun, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeV2Context } from '@/components/ThemeV2Provider'
import { useTheme } from '@/components/ThemeProvider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface HeaderV2Props {
  user?: {
    name: string
    id: string
    avatar?: string
  }
}

export function HeaderV2({ user = { name: 'Jane Doe', id: 'P01234567' } }: HeaderV2Props) {
  const { isThemeV2, setThemeV2 } = useThemeV2Context()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [showEmergency, setShowEmergency] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleThemeToggle = () => {
    const newThemeV2 = !isThemeV2
    setThemeV2(newThemeV2)
    
    // Update URL with query param
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (newThemeV2) {
      params.set('theme', 'v2')
    } else {
      params.delete('theme')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleEmergencyClick = () => {
    setShowEmergency(true)
  }

  return (
    <header 
      className={cn(
        'sticky top-0 z-50',
        'bg-neutral-900/95 backdrop-blur-xl',
        'border-b border-neutral-800',
        'h-16 flex items-center px-4'
      )}
      role="banner"
    >
      <div className="flex items-center justify-between w-full gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" 
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search appointments, messages, health data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-lg',
                'bg-neutral-800/50 border border-neutral-700',
                'text-neutral-200 placeholder-neutral-500',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500',
                'transition-all duration-200'
              )}
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className={cn(
              'p-2 rounded-lg',
              'bg-neutral-800/50 hover:bg-neutral-800',
              'text-neutral-400 hover:text-neutral-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
              'transition-all duration-200'
            )}
            aria-label={isThemeV2 ? 'Switch to Legacy Theme' : 'Switch to V2 Theme'}
            title={isThemeV2 ? 'Legacy Theme' : 'V2 Theme'}
          >
            {isThemeV2 ? (
              <span className="text-xs font-semibold text-teal-400">V2</span>
            ) : (
              <span className="text-xs font-semibold text-neutral-500">V1</span>
            )}
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'p-2 rounded-lg',
              'bg-neutral-800/50 hover:bg-neutral-800',
              'text-neutral-400 hover:text-neutral-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
              'transition-all duration-200'
            )}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Emergency Button */}
          <button
            onClick={handleEmergencyClick}
            className={cn(
              'px-4 py-2 rounded-lg font-semibold text-sm',
              'bg-red-500 hover:bg-red-600 text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
              'transition-all duration-200',
              'flex items-center gap-2'
            )}
            aria-label="Emergency - Get Help"
          >
            <AlertCircle size={18} />
            <span className="hidden sm:inline">Emergency</span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg',
                'bg-neutral-800/50 hover:bg-neutral-800',
                'text-neutral-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
                'transition-all duration-200'
              )}
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-neutral-500">ID: {user.id}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User size={18} className="text-white" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 overflow-hidden"
                  role="menu"
                >
                  <div className="p-4 border-b border-neutral-700">
                    <div className="font-medium text-neutral-200">{user.name}</div>
                    <div className="text-sm text-neutral-500">ID: {user.id}</div>
                  </div>
                  <div className="py-2">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white"
                      role="menuitem"
                    >
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white"
                      role="menuitem"
                    >
                      Settings
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmergency(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-800 rounded-xl p-8 max-w-md w-full border border-neutral-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Emergency SOS
                </h2>
                <button
                  onClick={() => setShowEmergency(false)}
                  className="p-2 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-neutral-200"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="text-neutral-300 mb-6">
                If you're experiencing a medical emergency, please:
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = 'tel:911'}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Call 911
                </button>
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((position) => {
                        const { latitude, longitude } = position.coords
                        alert(`Location: ${latitude}, ${longitude}\n\nIn production, this would send your location to emergency services.`)
                      })
                    }
                  }}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Send My Location
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
