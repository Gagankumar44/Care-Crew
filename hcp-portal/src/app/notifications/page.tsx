'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Bell, Calendar, Heart, FileText, AlertCircle, CheckCircle } from 'lucide-react'

const notifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Johnson tomorrow at 10 AM',
    time: '2h ago',
    unread: true,
    icon: Calendar,
  },
  {
    id: 2,
    type: 'health',
    title: 'New Test Results',
    message: 'Your recent lab results are now available',
    time: '5h ago',
    unread: true,
    icon: Heart,
  },
  {
    id: 3,
    type: 'report',
    title: 'Report Uploaded',
    message: 'Your medical report has been successfully uploaded',
    time: '1d ago',
    unread: false,
    icon: FileText,
  },
  {
    id: 4,
    type: 'alert',
    title: 'Health Alert',
    message: 'Your stress level has increased. Consider taking a break.',
    time: '2d ago',
    unread: false,
    icon: AlertCircle,
  },
]

export default function NotificationsPage() {
  const [allRead, setAllRead] = useState(false)

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Stay updated with your health alerts and reminders
            </p>
          </div>
          <button
            onClick={() => setAllRead(true)}
            className="px-4 py-2 glass border border-white/20 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon
            const isRead = allRead || !notification.unread
            return (
              <div
                key={notification.id}
                className={`glass-card p-6 cursor-pointer hover:shadow-glass-lg transition-all ${
                  !isRead ? 'bg-primary/5 border-primary/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    notification.type === 'alert' ? 'bg-red-500/10' :
                    notification.type === 'health' ? 'bg-green-500/10' :
                    notification.type === 'appointment' ? 'bg-blue-500/10' :
                    'bg-purple-500/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      notification.type === 'alert' ? 'text-red-500' :
                      notification.type === 'health' ? 'text-green-500' :
                      notification.type === 'appointment' ? 'text-blue-500' :
                      'text-purple-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      {!isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-neutral-500">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </PageLayout>
  )
}

