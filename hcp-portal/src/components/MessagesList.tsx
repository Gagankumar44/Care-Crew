'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Clock } from 'lucide-react'
import { mockMessages } from '@/data/mockData'

export function MessagesList() {
  return (
    <div className="space-y-3">
      {mockMessages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-4 hover:shadow-glass-lg transition-shadow cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={`Message from ${message.from}`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{message.from}</p>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {message.time}
                </span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{message.preview}</p>
              {message.unread && (
                <span className="inline-block mt-2 w-2 h-2 bg-primary rounded-full" aria-label="Unread message" />
              )}
            </div>
          </div>
        </motion.div>
      ))}
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm text-primary hover:text-primary-600 font-medium transition-colors"
        aria-label="View all messages"
      >
        View all messages →
      </motion.button>
    </div>
  )
}

