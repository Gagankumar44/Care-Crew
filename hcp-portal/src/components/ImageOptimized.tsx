'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { generateSrcSet, getOptimalImageFormat } from '@/utils/performance'

interface ImageOptimizedProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  fill?: boolean
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

/**
 * ImageOptimized - Optimized Next.js Image component
 * Includes WebP support, lazy loading, and responsive images
 */
export function ImageOptimized({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  quality = 85,
  fill = false,
  objectFit = 'cover',
  ...props
}: ImageOptimizedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  // Generate WebP fallback
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  const format = getOptimalImageFormat()
  
  // If priority, preload
  React.useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    }
  }, [priority, src])
  
  if (fill) {
    return (
      <div className={cn('relative', className)} style={{ width, height }}>
        <Image
          src={hasError ? src : webpSrc}
          alt={alt}
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          priority={priority}
          quality={quality}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
          {...props}
        />
      </div>
    )
  }
  
  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <Image
        src={hasError ? src : webpSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        priority={priority}
        quality={quality}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        {...props}
      />
    </div>
  )
}
