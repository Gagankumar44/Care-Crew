'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/PageLayout'
import { ARScanView } from '@/components/ARScanView'
import { Camera, Activity, X, AlertCircle } from 'lucide-react'

function ARScanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scanType = searchParams.get('type') || 'skin'
  const hasUploaded = searchParams.get('uploaded') === 'true'
  
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Check for uploaded image from floating scanner
  useEffect(() => {
    if (hasUploaded && typeof window !== 'undefined') {
      const storedImage = sessionStorage.getItem('uploadedImage')
      if (storedImage) {
        setUploadedImage(storedImage)
        sessionStorage.removeItem('uploadedImage')
      }
    }
  }, [hasUploaded])

  const handleStartScan = async () => {
    setIsScanning(true)
    setError(null)
    
    try {
      // Capture frame from video
      const video = videoRef.current
      if (!video) {
        throw new Error('Video element not found')
      }

      // Create canvas to capture frame
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to base64
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]

      // Call analysis API
      const response = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          scanType,
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAnalysisResult(data.analysis)
      setIsScanning(false)
      setScanComplete(true)
    } catch (err) {
      console.error('Scan error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze image')
      setIsScanning(false)
    }
  }

  const handleClose = () => {
    router.push('/messages')
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {scanType === 'skin' ? 'AR Skin Check' : 'ROM Analysis'}
              </h1>
              <p className="text-gray-600 dark:text-neutral-400">
                {scanType === 'skin'
                  ? 'Scan and analyze skin conditions with AI guidance'
                  : 'Measure and track your range of motion'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Close scan"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-neutral-400" aria-hidden="true" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
              <p className="text-red-800">{error}</p>
            </motion.div>
          )}

          {/* AR Scan View */}
          <ARScanView
            ref={videoRef}
            scanType={scanType as 'skin' | 'rom'}
            isScanning={isScanning}
            scanComplete={scanComplete}
            analysisResult={analysisResult}
            onStartScan={handleStartScan}
            onReset={() => {
              setScanComplete(false)
              setIsScanning(false)
              setAnalysisResult(null)
            }}
          />

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              How to use {scanType === 'skin' ? 'Skin Check' : 'ROM Analysis'}
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {scanType === 'skin' ? (
                <>
                  <li className="flex items-start gap-2">
                    <Camera className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>Position the affected area in the camera view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Camera className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>Ensure good lighting for accurate analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Camera className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>Follow the on-screen AR guidance for positioning</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <Activity className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>Stand in view of the camera</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Activity className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>Follow the AR exercise guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Activity className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>Move slowly through the range of motion</span>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
      </div>
    </PageLayout>
  )
}

export default function ARScanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ARScanContent />
    </Suspense>
  )
}
