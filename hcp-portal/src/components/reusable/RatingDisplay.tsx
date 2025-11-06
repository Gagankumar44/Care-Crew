'use client'

import React from 'react'
import { Star } from 'lucide-react'

interface RatingDisplayProps {
  rating: number
  reviewCount: number
  size?: 'sm' | 'md' | 'lg'
  showStars?: boolean
}

export function RatingDisplay({ rating, reviewCount, size = 'md', showStars = true }: RatingDisplayProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const sizeClasses = {
    sm: { star: 'w-3 h-3', text: 'text-sm' },
    md: { star: 'w-4 h-4', text: 'text-base' },
    lg: { star: 'w-5 h-5', text: 'text-lg' }
  }

  const classes = sizeClasses[size]

  return (
    <div className="flex items-center gap-2">
      {showStars && (
        <div className="flex items-center gap-0.5">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className={`${classes.star} text-yellow-400 fill-yellow-400`} />
          ))}
          {hasHalfStar && (
            <div className="relative">
              <Star className={`${classes.star} text-gray-300 fill-gray-300`} />
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star className={`${classes.star} text-yellow-400 fill-yellow-400`} />
              </div>
            </div>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className={`${classes.star} text-gray-300 fill-gray-300`} />
          ))}
        </div>
      )}
      <div className="flex items-center gap-1">
        <span className={`font-semibold text-gray-900 dark:text-white ${classes.text}`}>
          {rating.toFixed(1)}
        </span>
        <span className={`text-neutral-500 dark:text-neutral-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviewCount.toLocaleString()} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    </div>
  )
}
