'use client'

import { Activity } from 'lucide-react'
import { createIconComponent } from '@/components/ui/IconWrapper'
import Link from 'next/link'
import { motion } from 'framer-motion'

const quickActions = [
  {
    label: 'New Appointment',
    icon: createIconComponent('appointment-calendar', 20),
    href: '/appointments/new',
    color: 'primary',
    description: 'Schedule a visit',
  },
  {
    label: 'Send Message',
    icon: createIconComponent('chat-medical-support', 20),
    href: '/messages/new',
    color: 'secondary',
    description: 'Contact your doctor',
  },
  {
    label: 'AR Skin Check',
    icon: createIconComponent('ar-scan-camera-person', 20),
    href: '/ar-scan?type=skin',
    color: 'primary',
    description: 'Scan skin condition',
  },
  {
    label: 'ROM Analysis',
    icon: Activity,
    href: '/ar-scan?type=rom',
    color: 'secondary',
    description: 'Track movement',
  },
  {
    label: 'AI Triage',
    icon: createIconComponent('ai-brain-circuit', 20),
    href: '/triage',
    color: 'primary',
    description: 'Get health guidance',
  },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-glass">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          const colorClass = action.color === 'primary' ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' : 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white'
          
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-200 hover:shadow-md transition-all group"
              >
                <div className={`p-3 rounded-lg ${colorClass} transition-colors`}>
                  <Icon size={20} />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{action.label}</div>
                  <div className="text-xs text-neutral-500 mt-1">{action.description}</div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

