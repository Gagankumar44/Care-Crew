'use client'

import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // Build breadcrumbs array
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Always add Home as first breadcrumb
  breadcrumbs.push({ label: 'Home', href: '/dashboard' })
  
  // Add path segments, but skip 'dashboard' if it's the first segment to avoid duplicate
  pathSegments.forEach((segment, index) => {
    // Skip 'dashboard' segment to avoid duplicate with Home breadcrumb
    if (segment === 'dashboard' && index === 0) {
      return
    }
    
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href,
    })
  })

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        
        return (
          <div key={`${crumb.href}-${index}`} className="flex items-center gap-2">
            {index === 0 ? (
              <Link href={crumb.href} className="hover:text-primary transition-colors">
                <Home size={16} />
              </Link>
            ) : (
              <>
                <ChevronRight size={16} className="text-neutral-400" />
                {isLast ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}

