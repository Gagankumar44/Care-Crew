'use client'

import React from 'react'
import { SidebarV2 } from '@/components/SidebarV2'
import { HeaderV2 } from '@/components/HeaderV2'
import { cn } from '@/lib/utils'

interface AppLayoutV2Props {
  children: React.ReactNode
  user?: {
    name: string
    id: string
    avatar?: string
  }
}

/**
 * AppLayoutV2 - New layout component for Theme V2
 * Includes compact accessible sidebar and modern header
 */
export function AppLayoutV2({ children, user }: AppLayoutV2Props) {
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Sidebar */}
      <SidebarV2 collapsed={true} />
      
      {/* Main Content Area */}
      <div className="ml-16">
        {/* Header */}
        <HeaderV2 user={user} />
        
        {/* Page Content */}
        <main 
          className="p-6"
          role="main"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
