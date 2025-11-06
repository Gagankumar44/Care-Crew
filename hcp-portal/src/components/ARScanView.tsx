'use client'

import { motion } from 'framer-motion'
import { Camera, Activity, Play, CheckCircle, AlertCircle, Video, VideoOff, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react'
import clsx from 'clsx'
import { useEffect, useRef, useState, forwardRef } from 'react'

interface AnalysisResult {
  riskLevel?: string
  confidence?: number
  findings?: string[]
  recommendations?: string
  aiResponse?: string
}

interface ARScanViewProps {
  scanType: 'skin' | 'rom'
  isScanning: boolean
  scanComplete: boolean
  onStartScan: () => void
  onReset: () => void
  analysisResult?: AnalysisResult | null
}

export const ARScanView = forwardRef<HTMLVideoElement, ARScanViewProps>(({
  scanType,
  isScanning,
  scanComplete,
  onStartScan,
  onReset,
  analysisResult,
}, forwardedRef) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [guidanceDirection, setGuidanceDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(false)

  // Sync refs: when internal ref changes, update forwarded ref
  useEffect(() => {
    const video = internalVideoRef.current
    if (forwardedRef && video) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(video)
      } else if (forwardedRef && 'current' in forwardedRef) {
        forwardedRef.current = video
      }
    }
  }, [forwardedRef])

  // Request camera access on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user', // Front-facing camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
        
        const video = internalVideoRef.current
        if (video) {
          video.srcObject = stream
          streamRef.current = stream
          setCameraActive(true)
          setCameraError(null)
        }
      } catch (error) {
        console.error('Camera access error:', error)
        setCameraError('Camera access denied. Please allow camera permissions.')
        setCameraActive(false)
      }
    }

    startCamera()

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleStartScan = () => {
    if (cameraActive) {
      // Simulate scan progress
      setScanProgress(0)
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 300)
      
      onStartScan()
    } else {
      setCameraError('Please enable camera permissions to start scanning')
    }
  }

  return (
    <div className="relative">
      {/* AR View Container */}
      <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
        {/* Camera Feed */}
        {cameraActive && !cameraError ? (
          <video
            ref={internalVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            {cameraError ? (
              <div className="text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" aria-hidden="true" />
                <p className="text-white font-medium">Camera Error</p>
                <p className="text-gray-400 text-sm">{cameraError}</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <VideoOff className="w-20 h-20 text-gray-600 mx-auto animate-pulse" aria-hidden="true" />
                <p className="text-gray-400">Initializing camera...</p>
              </div>
            )}
          </div>
        )}

        {/* Scanning Overlay */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Scanning grid overlay */}
            <div className="absolute inset-0 border-2 border-primary/50 rounded-lg m-4 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 border-2 border-secondary/50 rounded-full"
              />
            </div>
            {/* Center focus point */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
              />
            </div>

            {/* Movement Guidance Arrows */}
            {scanType === 'rom' && (
              <>
                {/* Up Arrow */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-8 left-1/2 transform -translate-x-1/2"
                >
                  <ArrowUp className="w-8 h-8 text-primary drop-shadow-lg" />
                  <p className="text-white text-xs font-medium mt-1 text-center">Move Up</p>
                </motion.div>
                
                {/* Down Arrow */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                  <ArrowDown className="w-8 h-8 text-primary drop-shadow-lg" />
                  <p className="text-white text-xs font-medium mt-1 text-center">Move Down</p>
                </motion.div>
              </>
            )}

            {/* Audio Instructions Indicator */}
            {audioEnabled && (
              <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-medium">Audio Guide Active</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Scanning Status Overlay with Progress */}
        {isScanning && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              <span className="text-white text-sm font-medium">Scanning... {scanProgress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-neutral-700 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        )}

        {/* Scan Complete Overlay */}
        {scanComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-full p-6 shadow-xl"
            >
              <CheckCircle className="w-16 h-16 text-green-500" aria-hidden="true" />
            </motion.div>
          </motion.div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="flex gap-3">
            {scanComplete ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={onReset}
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
                aria-label="Reset scan"
              >
                <Camera className="w-5 h-5" />
                Scan Again
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartScan}
                  disabled={isScanning || !cameraActive}
                  className={clsx(
                    'px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg',
                    isScanning || !cameraActive
                      ? 'bg-gray-600 text-white cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  )}
                  aria-label={isScanning ? 'Scanning in progress' : 'Start scan'}
                >
                  {isScanning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" aria-hidden="true" />
                      Start Scan
                    </>
                  )}
                </motion.button>
                {/* Audio Instructions Toggle */}
                {scanType === 'rom' && (
                  <button
                    onClick={() => {
                      setAudioEnabled(!audioEnabled)
                      // In production, use Web Speech API or TTS service
                      if (!audioEnabled && 'speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(
                          'Position yourself in front of the camera. Move slowly through your range of motion.'
                        )
                        window.speechSynthesis.speak(utterance)
                      }
                    }}
                    className={clsx(
                      'px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg',
                      audioEnabled
                        ? 'bg-primary text-white'
                        : 'bg-white/90 text-gray-900 hover:bg-white'
                    )}
                    aria-label="Toggle audio instructions"
                  >
                    <Volume2 className="w-5 h-5" />
                    {audioEnabled ? 'Audio On' : 'Audio Off'}
                  </button>
                )}
              </>
            )}
          </div>
          
          {/* Instructions Text */}
          {!scanComplete && scanType === 'rom' && (
            <p className="text-white text-sm text-center bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg max-w-md">
              Follow the on-screen arrows to move through your range of motion
            </p>
          )}
        </div>
      </div>

      {/* Results Panel */}
      {scanComplete && analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mt-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Analysis Results</h3>
          {scanType === 'skin' ? (
            <div className="space-y-4">
              {/* Risk Assessment */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Risk Assessment</span>
                <span className={clsx(
                  'font-medium px-3 py-1 rounded-full',
                  analysisResult.riskLevel === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  analysisResult.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  analysisResult.riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                )}>
                  {analysisResult.riskLevel ? analysisResult.riskLevel.charAt(0).toUpperCase() + analysisResult.riskLevel.slice(1) + ' Risk' : 'Unknown'}
                </span>
              </div>
              
              {/* Confidence */}
              {analysisResult.confidence && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">AI Confidence</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(analysisResult.confidence * 100)}%
                  </span>
                </div>
              )}

              {/* Findings */}
              {analysisResult.findings && analysisResult.findings.length > 0 && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Findings:</h4>
                  <ul className="space-y-2">
                    {analysisResult.findings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {analysisResult.recommendations && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recommendations:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {analysisResult.recommendations}
                  </p>
                </div>
              )}

              {/* Full AI Response (collapsible) */}
              {analysisResult.aiResponse && (
                <details className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-600 dark:hover:text-primary-400">
                    View Full AI Response
                  </summary>
                  <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {analysisResult.aiResponse}
                    </p>
                  </div>
                </details>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Range of Motion</span>
                <span className="font-medium text-gray-900 dark:text-white">85°</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Previous Measurement</span>
                <span className="font-medium text-gray-900 dark:text-white">82°</span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ✓ Improvement detected. Continue with prescribed exercises.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
})

ARScanView.displayName = 'ARScanView'
