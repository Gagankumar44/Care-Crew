'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { MediARLogo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [1, 0.95])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <motion.nav
      style={{ opacity }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-apple',
        isScrolled
          ? 'glass backdrop-blur-4xl shadow-depth'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
        <div className="flex items-center justify-between h-20 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <MediARLogo size={40} className="transition-transform group-hover:scale-110" animated={true} />
              <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse-slow" />
            </div>
            <span className="text-2xl font-bold bg-gradient-text-primary text-white dark:text-white">
              Care Crew
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#why-us" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Why Us
            </Link>
            <Link href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="gradient" size="lg" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            <Link href="#features" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Features
            </Link>
            <Link href="#testimonials" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Testimonials
            </Link>
            <Link href="#why-us" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Why Us
            </Link>
            <Link href="#pricing" className="block px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Pricing
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="gradient" className="w-full" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

