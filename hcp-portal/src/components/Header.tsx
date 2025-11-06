'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, Phone, Search, Menu, X, HelpCircle, Settings, LogOut, User, Moon, Sun, MapPin, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { MediARLogo } from '@/components/Logo'
import { useTheme } from '@/components/ThemeProvider'
import { motion, AnimatePresence } from 'framer-motion'

interface User {
  name: string
  id: string
  avatar: string
}

interface HeaderProps {
  user?: User
  onMobileMenuToggle?: () => void
}

function EmergencyButton() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        aria-label="Emergency call" 
        className="px-3 py-2 rounded-lg bg-[#FF5B5B] text-white text-sm flex items-center gap-2 hover:bg-[#FF4444] transition-colors"
      >
        <Phone size={16} />
        <span className="hidden sm:inline">Emergency</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Emergency SOS
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-900 dark:text-white mb-6">
                If you're experiencing a medical emergency, please:
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = 'tel:911'}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call 911
                </button>
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((position) => {
                        const { latitude, longitude } = position.coords
                        alert(`Location: ${latitude}, ${longitude}\n\nIn production, this would send your location to emergency services.`)
                      })
                    } else {
                      alert('Location services not available')
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 glass border border-white/20 dark:border-white/10 py-3 rounded-xl font-semibold text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Send My Location
                </button>
              </div>
              <p className="text-sm text-neutral-500 mt-4 text-center">
                Your safety is our priority. Please seek immediate medical attention.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Header({ user = { name: 'Jane Doe', id: 'P01234567', avatar: '/images/avatar.jpg' }, onMobileMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [avatarError, setAvatarError] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu)
    onMobileMenuToggle?.()
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const avatarSrc = avatarError 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0057D9&color=fff&size=128`
    : user.avatar

  const notifications = [
    { id: 1, text: 'Appointment reminder: Tomorrow at 10 AM', time: '2h ago', unread: true },
    { id: 2, text: 'New test results available', time: '5h ago', unread: true },
    { id: 3, text: 'Dr. Johnson sent you a message', time: '1d ago', unread: false },
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 dark:border-white/5 backdrop-blur-3xl">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Logo & Mobile Menu */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <MediARLogo size={32} animated={true} />
              <div className="flex flex-col">
                <span className="text-primary font-semibold text-lg">Care Crew</span>
                <div className="hidden md:block text-xs text-neutral-500">AR-guided self-checks • Telehealth</div>
              </div>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search appointments, messages, health data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass border border-white/20 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-neutral-500"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              ) : (
                <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              )}
            </button>

            {/* Help Button */}
            <button 
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm glass border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
              aria-label="Help"
            >
              <HelpCircle size={16} />
              <span className="hidden md:inline">Help</span>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setShowUserMenu(false)
                }}
                className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-neutral-600" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-glass-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50">
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer ${
                          notification.unread ? 'bg-primary/5 dark:bg-primary/10' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.text}</p>
                        <p className="text-xs font-medium text-gray-600 dark:text-neutral-300 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                    <button className="text-sm text-primary dark:text-primary-400 font-medium w-full text-center">
                      View all notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Button */}
            <EmergencyButton />

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu)
                  setShowNotifications(false)
                }}
                className="flex items-center gap-3 glass rounded-xl p-2 border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
                aria-label="User menu"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">ID: {user.id}</div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative">
                  <Image 
                    src={avatarSrc} 
                    alt={`${user.name}'s avatar`} 
                    width={40} 
                    height={40}
                    className="object-cover"
                    onError={() => setAvatarError(true)}
                    unoptimized={avatarError}
                  />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-glass-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50">
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-neutral-300">{user.id}</div>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                    >
                      <User size={16} className="text-gray-700 dark:text-neutral-300" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                    >
                      <Settings size={16} className="text-gray-700 dark:text-neutral-300" />
                      Settings
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                    >
                      <HelpCircle size={16} className="text-gray-700 dark:text-neutral-300" />
                      Help & Support
                    </Link>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-700 py-2">
                    <Link
                      href="/landing"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                    >
                      <LogOut size={16} />
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass border border-white/20 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-neutral-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
