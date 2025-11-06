'use client'

import { useState, useEffect, useRef } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Heart, Thermometer, Wind, Activity, Play, Square, AlertCircle, CheckCircle, Camera, CameraOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { HeartRateDetector } from '@/lib/vitals/heartRate'
import { BreathingRateDetector } from '@/lib/vitals/breathingRate'
import { StressLevelDetector } from '@/lib/vitals/stressLevel'

export default function VitalsPage() {
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const [breathingRate, setBreathingRate] = useState<number | null>(null)
  const [stressLevel, setStressLevel] = useState<number | null>(null)
  const [temperature, setTemperature] = useState<number | null>(null)
  const [isMeasuring, setIsMeasuring] = useState<'heart' | 'breathing' | 'stress' | null>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [measurementProgress, setMeasurementProgress] = useState(0)
  const [realtimeValue, setRealtimeValue] = useState<number | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const heartRateDetector = useRef<HeartRateDetector | null>(null)
  const breathingDetector = useRef<BreathingRateDetector | null>(null)
  const stressDetector = useRef<StressLevelDetector | null>(null)

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        setCameraError(null)
        
        // Request camera permissions
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            setVideoReady(true)
          }
          
          videoRef.current.play()
        }

        // Initialize detectors
        heartRateDetector.current = new HeartRateDetector()
        breathingDetector.current = new BreathingRateDetector()
        stressDetector.current = new StressLevelDetector()
      } catch (error: any) {
        console.error('Camera error:', error)
        setCameraError(
          error.name === 'NotAllowedError' 
            ? 'Camera permission denied. Please allow camera access to use vital measurements.'
            : error.name === 'NotFoundError'
            ? 'No camera found. Please connect a camera to use vital measurements.'
            : 'Failed to access camera. Please check your camera permissions.'
        )
        setVideoReady(false)
      }
    }

    initCamera()

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      heartRateDetector.current?.stop()
      breathingDetector.current?.stop()
      stressDetector.current?.stop()
    }
  }, [])

  const measureHeartRate = async () => {
    if (!videoRef.current || !videoReady || !heartRateDetector.current) {
      alert('Camera not ready. Please wait for camera to initialize.')
      return
    }

    try {
      setIsMeasuring('heart')
      setMeasurementProgress(0)
      setRealtimeValue(null)
      setHeartRate(null)

      const bpm = await heartRateDetector.current.startMeasurement(
        videoRef.current,
        15000, // 15 seconds
        (progress) => setMeasurementProgress(progress),
        (bpm) => setRealtimeValue(bpm)
      )

      setHeartRate(bpm)
      setRealtimeValue(null)
      setMeasurementProgress(0)
    } catch (error) {
      console.error('Heart rate measurement error:', error)
      alert('Failed to measure heart rate. Please try again.')
      setHeartRate(null)
    } finally {
      setIsMeasuring(null)
    }
  }

  const measureBreathingRate = async () => {
    if (!videoRef.current || !videoReady || !breathingDetector.current) {
      alert('Camera not ready. Please wait for camera to initialize.')
      return
    }

    try {
      setIsMeasuring('breathing')
      setMeasurementProgress(0)
      setRealtimeValue(null)
      setBreathingRate(null)

      const rate = await breathingDetector.current.startMeasurement(
        videoRef.current,
        30000, // 30 seconds
        (progress) => setMeasurementProgress(progress),
        (rate) => setRealtimeValue(rate)
      )

      setBreathingRate(rate)
      setRealtimeValue(null)
      setMeasurementProgress(0)
    } catch (error) {
      console.error('Breathing rate measurement error:', error)
      alert('Failed to measure breathing rate. Please try again.')
      setBreathingRate(null)
    } finally {
      setIsMeasuring(null)
    }
  }

  const measureStressLevel = async () => {
    if (!videoRef.current || !videoReady || !stressDetector.current) {
      alert('Camera not ready. Please wait for camera to initialize.')
      return
    }

    try {
      setIsMeasuring('stress')
      setMeasurementProgress(0)
      setRealtimeValue(null)
      setStressLevel(null)

      const level = await stressDetector.current.startMeasurement(
        videoRef.current,
        10000, // 10 seconds
        (progress) => setMeasurementProgress(progress),
        (level) => setRealtimeValue(level)
      )

      setStressLevel(level)
      setRealtimeValue(null)
      setMeasurementProgress(0)
    } catch (error) {
      console.error('Stress level measurement error:', error)
      alert('Failed to measure stress level. Please try again.')
      setStressLevel(null)
    } finally {
      setIsMeasuring(null)
    }
  }

  const retryCamera = async () => {
    setCameraError(null)
    setVideoReady(false)
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        
        videoRef.current.onloadedmetadata = () => {
          setVideoReady(true)
        }
        
        await videoRef.current.play()
      }
    } catch (error: any) {
      setCameraError('Failed to access camera. Please check permissions.')
    }
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Phone-Based Vital Measurements
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Measure your vital signs using your phone's camera
          </p>
        </div>

        {/* Camera Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Camera Feed
            </h2>
            <div className="flex items-center gap-2">
              {videoReady ? (
                <span className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Camera className="w-4 h-4" />
                  Camera Active
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm text-neutral-500">
                  <CameraOff className="w-4 h-4" />
                  Camera Inactive
                </span>
              )}
            </div>
          </div>
          
          {cameraError ? (
            <div className="aspect-video bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center p-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <p className="text-red-900 dark:text-red-300 font-medium mb-2">Camera Error</p>
                <p className="text-sm text-red-700 dark:text-red-400 mb-4">{cameraError}</p>
                <button
                  onClick={retryCamera}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Retry Camera Access
                </button>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!videoReady ? 'opacity-50' : ''}`}
              />
              {!videoReady && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-center text-white">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"
                    />
                    <p className="text-sm">Initializing camera...</p>
                  </div>
                </div>
              )}
              {isMeasuring && videoReady && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center text-white">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-20 h-20 border-4 border-white rounded-full mx-auto mb-4 flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-12 h-12 bg-white/20 rounded-full"
                      />
                    </motion.div>
                    <p className="text-lg font-semibold mb-2">
                      {isMeasuring === 'heart' && 'Measuring heart rate...'}
                      {isMeasuring === 'breathing' && 'Measuring breathing rate...'}
                      {isMeasuring === 'stress' && 'Analyzing stress level...'}
                    </p>
                    {realtimeValue !== null && (
                      <p className="text-2xl font-bold mb-2">
                        {realtimeValue}
                        {isMeasuring === 'heart' && ' bpm'}
                        {isMeasuring === 'breathing' && ' breaths/min'}
                        {isMeasuring === 'stress' && '%'}
                      </p>
                    )}
                    <div className="w-64 h-2 bg-white/20 rounded-full mx-auto mb-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${measurementProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-gray-300 mt-2">
                      {isMeasuring === 'heart' && 'Place your finger over the camera or keep your face steady'}
                      {isMeasuring === 'breathing' && 'Position your chest visible in the camera view'}
                      {isMeasuring === 'stress' && 'Look at the camera and remain still'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Vital Measurement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heart Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Heart Rate
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Face/finger camera detection
                  </p>
                </div>
              </div>
            </div>
            
            {heartRate ? (
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {heartRate}
                </div>
                <div className="text-lg text-neutral-600 dark:text-neutral-400 mb-3">bpm</div>
                <div className={`mt-3 flex items-center justify-center gap-2 text-sm ${
                  heartRate >= 60 && heartRate <= 100 
                    ? 'text-green-600 dark:text-green-400'
                    : heartRate < 60
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {heartRate >= 60 && heartRate <= 100 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Normal range (60-100 bpm)</span>
                    </>
                  ) : heartRate < 60 ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Below normal</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Elevated - Consult a doctor</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No measurement yet</p>
                <p className="text-xs mt-1 text-neutral-400 dark:text-neutral-500">
                  Click "Measure" to start
                </p>
              </div>
            )}

            <button
              onClick={measureHeartRate}
              disabled={isMeasuring !== null || !videoReady}
              className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              {isMeasuring === 'heart' ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Measuring...
                </>
              ) : !videoReady ? (
                <>
                  <CameraOff className="w-5 h-5" />
                  Camera Not Ready
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Measure Heart Rate
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-neutral-500 text-center">
              Place your finger on the camera or position your face in view
            </p>
          </motion.div>

          {/* Breathing Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Wind className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Breathing Rate
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Chest movement detection
                  </p>
                </div>
              </div>
            </div>
            
            {breathingRate ? (
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {breathingRate}
                </div>
                <div className="text-lg text-neutral-600 dark:text-neutral-400 mb-3">breaths/min</div>
                <div className={`mt-3 flex items-center justify-center gap-2 text-sm ${
                  breathingRate >= 12 && breathingRate <= 20 
                    ? 'text-green-600 dark:text-green-400'
                    : breathingRate < 12
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {breathingRate >= 12 && breathingRate <= 20 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Normal range (12-20 breaths/min)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>{breathingRate < 12 ? 'Below normal' : 'Above normal'}</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <Wind className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No measurement yet</p>
                <p className="text-xs mt-1 text-neutral-400 dark:text-neutral-500">
                  Click "Measure" to start
                </p>
              </div>
            )}

            <button
              onClick={measureBreathingRate}
              disabled={isMeasuring !== null || !videoReady}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              {isMeasuring === 'breathing' ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Measuring...
                </>
              ) : !videoReady ? (
                <>
                  <CameraOff className="w-5 h-5" />
                  Camera Not Ready
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Measure Breathing Rate
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-neutral-500 text-center">
              Position your chest visible in the camera view
            </p>
          </motion.div>

          {/* Stress Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Activity className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Stress Level
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Facial cue analysis
                  </p>
                </div>
              </div>
            </div>
            
            {stressLevel !== null ? (
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {stressLevel}%
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-4">
                  <div
                    className={`h-2 rounded-full ${
                      stressLevel < 40 ? 'bg-green-500' :
                      stressLevel < 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${stressLevel}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                  {stressLevel < 40 && (
                    <span className="text-green-600">Low stress</span>
                  )}
                  {stressLevel >= 40 && stressLevel < 60 && (
                    <span className="text-yellow-600">Moderate stress</span>
                  )}
                  {stressLevel >= 60 && (
                    <span className="text-red-600">High stress</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No measurement yet</p>
                <p className="text-xs mt-1 text-neutral-400 dark:text-neutral-500">
                  Click "Estimate" to start
                </p>
              </div>
            )}

            <button
              onClick={measureStressLevel}
              disabled={isMeasuring !== null || !videoReady}
              className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              {isMeasuring === 'stress' ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Analyzing...
                </>
              ) : !videoReady ? (
                <>
                  <CameraOff className="w-5 h-5" />
                  Camera Not Ready
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Estimate Stress Level
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-neutral-500 text-center">
              Look at the camera and remain still for analysis
            </p>
          </motion.div>

          {/* Temperature (Manual Input) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Thermometer className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Temperature
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Manual or external device input
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  value={temperature || ''}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  placeholder="98.6"
                  className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {temperature && (
                <div className="flex items-center gap-2 text-sm">
                  {temperature >= 98.6 && temperature <= 99.5 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Normal temperature
                    </span>
                  ) : temperature > 99.5 ? (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Elevated temperature
                    </span>
                  ) : (
                    <span className="text-blue-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Below normal
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900 dark:text-blue-200">
              <p className="font-semibold mb-2 text-base">Measurement Guidelines</p>
              <div className="space-y-2">
                <p className="font-medium">Camera Access:</p>
                <p>• Allow camera permissions when prompted</p>
                <p>• Ensure good lighting and stable camera position</p>
                <p className="font-medium mt-3">Heart Rate Measurement:</p>
                <p>• Place your finger over the camera lens OR position your face steady in view</p>
                <p>• Measurement takes ~15 seconds - stay still during the process</p>
                <p className="font-medium mt-3">Breathing Rate Measurement:</p>
                <p>• Position your chest/upper body visible in the camera view</p>
                <p>• Measurement takes ~30 seconds - breathe normally and remain still</p>
                <p className="font-medium mt-3">Stress Level Estimation:</p>
                <p>• Look directly at the camera and remain still</p>
                <p>• Analysis takes ~10 seconds - keep facial expressions natural</p>
                <p className="font-medium mt-3 text-orange-700 dark:text-orange-300">Important Notice:</p>
                <p className="text-orange-800 dark:text-orange-200">• These measurements are estimates based on camera analysis</p>
                <p className="text-orange-800 dark:text-orange-200">• Results should not replace professional medical assessments</p>
                <p className="text-orange-800 dark:text-orange-200">• For accurate temperature readings, use a calibrated thermometer</p>
                <p className="text-orange-800 dark:text-orange-200">• Consult a healthcare professional for medical decisions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}

