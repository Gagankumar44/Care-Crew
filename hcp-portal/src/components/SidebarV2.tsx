'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Calendar, 
  Stethoscope, 
  FlaskConical, 
  Wallet, 
  MessageSquare, 
  AlertCircle, 
  Settings,
  ChevronRight 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface SidebarItem {
  href: string
  label: string
  icon: React.ElementType
  ariaLabel: string
}

const sidebarItems: SidebarItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, ariaLabel: 'Go to Dashboard' },
  { href: '/appointments', label: 'Appointments', icon: Calendar, ariaLabel: 'Go to Appointments' },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope, ariaLabel: 'Go to Doctors' },
  { href: '/lab-tests', label: 'Labs', icon: FlaskConical, ariaLabel: 'Go to Lab Tests' },
  { href: '/health-wallet', label: 'Wallet', icon: Wallet, ariaLabel: 'Go to Health Wallet' },
  { href: '/messages', label: 'Messages', icon: MessageSquare, ariaLabel: 'Go to Messages' },
  { href: '/emergency', label: 'Emergency', icon: AlertCircle, ariaLabel: 'Emergency - Go to Emergency' },
  { href: '/settings', label: 'Settings', icon: Settings, ariaLabel: 'Go to Settings' },
]

interface SidebarV2Props {
  collapsed?: boolean
}

export function SidebarV2({ collapsed: initialCollapsed }: SidebarV2Props) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar_collapsed')
      return stored ? stored === 'true' : (initialCollapsed ?? true)
    }
    return initialCollapsed ?? true
  })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Persist collapse state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(isCollapsed))
    }
  }, [isCollapsed])

  const sidebarVariants = {
    collapsed: { width: 64 },
    expanded: { width: 256 },
  }

  const itemVariants = {
    collapsed: { x: 0 },
    expanded: (i: number) => ({
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  const labelVariants = {
    collapsed: { opacity: 0, x: -10 },
    expanded: { opacity: 1, x: 0 },
  }

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={prefersReducedMotion ? {} : sidebarVariants}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed left-0 top-0 h-screen z-40',
        'bg-neutral-900/95 backdrop-blur-xl',
        'border-r border-neutral-800',
        'flex flex-col'
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      aria-label="Main navigation"
    >
      {/* Logo/Header */}
      <div className="flex items-center justify-center h-16 border-b border-neutral-800">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-4"
          aria-label="Care Crew Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-white font-semibold text-lg"
              >
                Care Crew
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1" aria-label="Sidebar navigation">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const isEmergency = item.href === '/emergency'

          return (
            <motion.div
              key={item.href}
              custom={index}
              initial="collapsed"
              animate={isCollapsed ? 'collapsed' : 'expanded'}
              variants={prefersReducedMotion ? {} : itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
                  isCollapsed && 'justify-center',
                  isActive
                    ? isEmergency
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-teal-500/20 text-teal-400'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800',
                  isEmergency && !isActive && 'hover:bg-red-500/10 hover:text-red-400'
                )}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon 
                  size={24} 
                  className={cn(
                    'flex-shrink-0',
                    isEmergency && !isActive && 'text-red-500'
                  )}
                  aria-hidden="true"
                />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isEmergency && !isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-auto"
                  >
                    <ChevronRight size={16} className="text-red-500" />
                  </motion.span>
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </motion.aside>
  )
}
