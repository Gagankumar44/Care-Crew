'use client'

import React from 'react'
import { MessageSquare, Mic, Brain, Camera, Activity, Heart, LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface AIToolCardProps {
  title: string
  desc?: string
  description?: string
  icon?: 'chat' | 'voice' | 'brain' | 'camera' | 'activity' | 'heart'
  href?: string
  color?: 'primary' | 'secondary'
}

export function AIToolCard({ title, desc, description, icon = 'chat', href, color }: AIToolCardProps) {
  // Support both new and old prop names
  const displayDesc = desc || description || ''
  
  // Icon mapping - support both new simple icons and old complex icons
  const iconMap: Record<string, LucideIcon> = {
    chat: MessageSquare,
    voice: Mic,
    brain: Brain,
    camera: Camera,
    activity: Activity,
    heart: Heart,
  }
  
  const Icon = iconMap[icon] || MessageSquare
  
  // If href is provided, wrap in Link, otherwise use div
  const cardContent = (
    <div className="glass-card p-5 flex items-start gap-4 hover:shadow-glass-lg transition-shadow">
      <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{displayDesc}</div>
        {href && (
          <div className="mt-3">
            <span className="text-sm text-primary font-medium hover:text-primary-600 transition-colors cursor-pointer">
              Start →
            </span>
          </div>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

