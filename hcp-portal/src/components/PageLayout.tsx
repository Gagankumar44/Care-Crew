'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FloatingAIButton } from '@/components/FloatingAIButton'
import { FloatingARScanner } from '@/components/FloatingARScanner'
import { EmergencyButton } from '@/components/EmergencyButton'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-green-50/50 dark:from-neutral-900 dark:via-blue-950/30 dark:to-green-950/30">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Breadcrumbs />
          {children}
        </main>
      </div>
      <FloatingAIButton />
      <FloatingARScanner />
      <EmergencyButton />
    </div>
  )
}

