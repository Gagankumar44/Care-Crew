'use client'

import React, { useState, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, Loader2 } from 'lucide-react'

// Dynamically import model-viewer to reduce initial bundle size
const ModelViewer = lazy(() => 
  import('@google/model-viewer').then((mod) => ({ default: mod.ModelViewer }))
)

interface ARViewerProps {
  src: string
  alt: string
  poster?: string
  className?: string
  onClose?: () => void
}

/**
 * ARViewer - WebXR-enabled 3D model viewer
 * Uses @google/model-viewer for AR support
 * Lazy loads only after user interaction
 */
export function ARViewer({ 
  src, 
  alt, 
  poster,
  className,
  onClose 
}: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showAR, setShowAR] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleARClick = () => {
    setShowAR(true)
  }

  return (
    <div className={cn('relative', className)}>
      <Suspense fallback={
        <div className="w-full h-96 bg-neutral-800 rounded-xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
        </div>
      }>
        <div className="relative w-full h-96 bg-neutral-800 rounded-xl overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
            </div>
          )}
          
          {hasError && poster ? (
            <img
              src={poster}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <ModelViewer
              src={src}
              alt={alt}
              poster={poster}
              ar
              ar-modes="webxr scene-viewer"
              ar-scale="auto"
              camera-controls
              touch-action="pan-y"
              loading="lazy"
              onLoad={handleLoad}
              onError={handleError}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#171717',
              }}
            />
          )}

          {/* AR Button Overlay */}
          {!hasError && (
            <motion.button
              onClick={handleARClick}
              className={cn(
                'absolute bottom-4 right-4',
                'px-4 py-2 rounded-lg font-semibold text-sm',
                'bg-teal-500 hover:bg-teal-600 text-white',
                'flex items-center gap-2',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                'transition-all duration-200'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Try in AR"
            >
              <span>Try in AR</span>
            </motion.button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'absolute top-4 right-4',
                'p-2 rounded-lg',
                'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                'transition-all duration-200'
              )}
              aria-label="Close AR viewer"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </Suspense>
    </div>
  )
}

/**
 * ARViewerTrigger - Button that opens AR viewer on click
 * Only loads AR viewer after user clicks
 */
interface ARViewerTriggerProps {
  src: string
  alt: string
  poster?: string
  label?: string
  className?: string
}

export function ARViewerTrigger({
  src,
  alt,
  poster,
  label = 'Open AR',
  className,
}: ARViewerTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          'px-4 py-2 rounded-lg font-semibold text-sm',
          'bg-teal-500 hover:bg-teal-600 text-white',
          'flex items-center gap-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
          'transition-all duration-200',
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`${label} - ${alt}`}
      >
        <span>{label}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              <ARViewer
                src={src}
                alt={alt}
                poster={poster}
                onClose={() => setIsOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
