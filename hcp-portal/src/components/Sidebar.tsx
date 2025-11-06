'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronRight } from 'lucide-react'
import { MediARLogo } from '@/components/Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { getNavigationGroups, getQuickActions } from '@/config/navigation'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Overview', 'Health Tools', 'System']))

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navigationGroups = getNavigationGroups()
  const quickActions = getQuickActions()

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupTitle)) {
        next.delete(groupTitle)
      } else {
        next.add(groupTitle)
      }
      return next
    })
  }

  const isGroupExpanded = (groupTitle: string) => expandedGroups.has(groupTitle)

  const sidebarContent = (
    <>
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Care Crew Home">
            <MediARLogo size={40} animated={true} />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Care Crew</span>
          </Link>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-3 px-4">Quick Actions</h3>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={isMobile ? onClose : undefined}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary transition-colors group"
                  title={action.description}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-2" aria-label="Sidebar navigation">
          {navigationGroups.map((group) => {
            const isExpanded = isGroupExpanded(group.title)
            const hasActiveItem = group.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))
            
            return (
              <div 
                key={group.title} 
                className={clsx(
                  'group-container rounded-lg transition-all duration-200',
                  isExpanded && hasActiveItem && 'bg-primary/5 dark:bg-primary/10',
                  isExpanded && 'border border-neutral-200/50 dark:border-neutral-700/50'
                )}
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={clsx(
                    'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200',
                    'text-xs font-bold uppercase tracking-wider',
                    'hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50',
                    'relative',
                    isExpanded 
                      ? 'bg-neutral-50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-200 border-b border-neutral-200/50 dark:border-neutral-700/50' 
                      : 'text-neutral-500 dark:text-neutral-400',
                    hasActiveItem && !isExpanded && 'text-primary dark:text-primary-400',
                    hasActiveItem && isExpanded && 'text-primary dark:text-primary-300'
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* Visual indicator for group */}
                    <div className={clsx(
                      'w-1 h-5 rounded-full transition-all duration-200 flex-shrink-0',
                      isExpanded 
                        ? 'bg-primary w-1.5' 
                        : 'bg-neutral-300 dark:bg-neutral-600'
                    )} />
                    <span className="truncate">{group.title}</span>
                  </div>
                  <div className={clsx(
                    'flex items-center gap-1 transition-transform duration-200 flex-shrink-0',
                    isExpanded && 'rotate-180'
                  )}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                {/* Group Items - Animated Container */}
                <div
                  className={clsx(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-2 py-2 space-y-0.5">
                    {group.items.map((item, index) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={isMobile ? onClose : undefined}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm relative group/item',
                            'hover:pl-5', // Subtle slide effect on hover
                            isActive
                              ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold'
                              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white'
                          )}
                          style={{
                            animationDelay: isExpanded ? `${index * 30}ms` : '0ms'
                          }}
                          aria-current={isActive ? 'page' : undefined}
                          title={item.description}
                        >
                          {/* Active indicator line */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                          )}
                          
                          {/* Sub-item indent indicator */}
                          <div className={clsx(
                            'w-1 h-1 rounded-full transition-all duration-200 flex-shrink-0',
                            isActive 
                              ? 'bg-white/80' 
                              : 'bg-neutral-400 dark:bg-neutral-500 group-hover/item:bg-primary group-hover/item:w-1.5'
                          )} />
                          
                          <Icon className={clsx(
                            'flex-shrink-0 transition-transform duration-200',
                            isActive ? 'w-5 h-5' : 'w-4 h-4 group-hover/item:scale-110'
                          )} aria-hidden="true" />
                          
                          <span className="font-medium flex-1 truncate">{item.label}</span>
                          
                          {item.badge && (
                            <span className={clsx(
                              'px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 transition-all duration-200',
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400 group-hover/item:bg-primary/20 group-hover/item:scale-105'
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        {/* Sidebar */}
        <aside
          className={clsx(
            'fixed top-0 left-0 h-full w-64 glass border-r border-white/10 dark:border-white/5 shadow-glass-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          aria-label="Sidebar"
        >
          {sidebarContent}
        </aside>
      </>
    )
  }

  // Desktop sidebar
  return (
    <aside className="hidden lg:block w-64 glass border-r border-white/10 dark:border-white/5 min-h-screen shadow-glass" aria-label="Sidebar">
      {sidebarContent}
    </aside>
  )
}
