'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'saas-card',
        hover && 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  )
}

