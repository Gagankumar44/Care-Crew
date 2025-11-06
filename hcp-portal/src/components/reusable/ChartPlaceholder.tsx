'use client'

import { Card } from './Card'
import { cn } from '@/lib/utils'

interface ChartPlaceholderProps {
  title?: string
  className?: string
  height?: string
}

export function ChartPlaceholder({
  title,
  className,
  height = 'h-64'
}: ChartPlaceholderProps) {
  return (
    <Card className={cn('p-6', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div className={cn(
        'bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-xl flex items-center justify-center',
        height
      )}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-300 dark:bg-neutral-600 mx-auto mb-3 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-neutral-500 dark:text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Chart placeholder
          </p>
        </div>
      </div>
    </Card>
  )
}

