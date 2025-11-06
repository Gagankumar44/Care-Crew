'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Sparkles, Activity, Heart, Brain, Zap, TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface KPIBlockProps {
  label: string
  value: number
  unit?: string
  icon: React.ElementType
  color: 'blue' | 'green' | 'purple' | 'orange'
  delay?: number
}

interface RadarDataPoint {
  label: string
  value: number
  maxValue: number
}

interface HolographicHealthAnalysisProps {
  kpis?: Array<{
    label: string
    value: number
    unit?: string
    icon: React.ElementType
    color: 'blue' | 'green' | 'purple' | 'orange'
  }>
  radarData?: RadarDataPoint[]
  aiInsight?: string
  className?: string
}

// Number counter animation hook
function useCountUp(end: number, duration: number = 1.5, delay: number = 0) {
  const [count, setCount] = useState(0)
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true

    const timer = setTimeout(() => {
      const startTime = Date.now()
      const startValue = 0

      const updateCount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const current = Math.floor(startValue + (end - startValue) * easeOutCubic)
        
        setCount(current)

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        } else {
          setCount(end)
        }
      }

      requestAnimationFrame(updateCount)
    }, delay * 1000)

    return () => {
      clearTimeout(timer)
      ref.current = false
    }
  }, [end, duration, delay])

  return count
}

function KPIBlock({ label, value, unit, icon: Icon, color, delay = 0 }: KPIBlockProps) {
  const animatedValue = useCountUp(value, 1.5, delay)
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10',
      icon: 'text-blue-400',
      glow: 'shadow-blue-500/20',
      border: 'border-blue-500/20',
    },
    green: {
      bg: 'bg-green-500/10',
      icon: 'text-green-400',
      glow: 'shadow-green-500/20',
      border: 'border-green-500/20',
    },
    purple: {
      bg: 'bg-purple-500/10',
      icon: 'text-purple-400',
      glow: 'shadow-purple-500/20',
      border: 'border-purple-500/20',
    },
    orange: {
      bg: 'bg-orange-500/10',
      icon: 'text-orange-400',
      glow: 'shadow-orange-500/20',
      border: 'border-orange-500/20',
    },
  }

  const scheme = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`relative p-4 rounded-2xl border ${scheme.border} ${scheme.bg} backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${scheme.bg} ${scheme.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={`absolute inset-0 rounded-2xl ${scheme.glow} shadow-lg blur-xl opacity-50`} />
      </div>
      
      <div className="relative z-10">
        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span 
            className="text-2xl font-bold text-white dark:text-white tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {animatedValue}
          </span>
          {unit && (
            <span className="text-sm text-neutral-400 dark:text-neutral-500">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Holographic shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'linear',
        }}
      />
    </motion.div>
  )
}

// SVG Radar Chart Component
function RadarChart({ data }: { data: RadarDataPoint[] }) {
  const size = 200
  const center = size / 2
  const radius = 80
  const numPoints = data.length
  const angleStep = (2 * Math.PI) / numPoints

  // Calculate points for radar chart
  const points = data.map((point, index) => {
    const angle = angleStep * index - Math.PI / 2 // Start from top
    const distance = (point.value / point.maxValue) * radius
    const x = center + distance * Math.cos(angle)
    const y = center + distance * Math.sin(angle)
    return { x, y, label: point.label, value: point.value }
  })

  // Create path string for the polygon
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  // Grid circles
  const gridLevels = 5
  const gridCircles = Array.from({ length: gridLevels }, (_, i) => {
    const r = (radius / gridLevels) * (i + 1)
    return r
  })

  return (
    <div className="relative flex items-center justify-center p-6">
      <svg width={size} height={size} className="drop-shadow-lg">
        <defs>
          {/* Gradient for the radar area */}
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid circles */}
        {gridCircles.map((r, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines from center */}
        {data.map((_, index) => {
          const angle = angleStep * index - Math.PI / 2
          const x2 = center + radius * Math.cos(angle)
          const y2 = center + radius * Math.sin(angle)
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          )
        })}

        {/* Radar polygon */}
        <motion.path
          d={pathData}
          fill="url(#radarGradient)"
          stroke="#3b82f6"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Data points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#60a5fa"
            filter="url(#glow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          />
        ))}

        {/* Labels */}
        {points.map((point, index) => {
          const angle = angleStep * index - Math.PI / 2
          const labelRadius = radius + 25
          const labelX = center + labelRadius * Math.cos(angle)
          const labelY = center + labelRadius * Math.sin(angle)
          return (
            <text
              key={index}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-xs font-medium"
            >
              {point.label}
            </text>
          )
        })}
      </svg>

      {/* Center glow effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-4 h-4 rounded-full bg-blue-400 blur-md" />
      </motion.div>
    </div>
  )
}

function AIInsightPill({ insight }: { insight: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm"
    >
      <Sparkles className="w-4 h-4 text-purple-400" />
      <span className="text-sm font-medium text-white dark:text-white">
        {insight}
      </span>
      
      {/* Pulsing glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

export function HolographicHealthAnalysis({
  kpis = [
    { label: 'Heart Rate', value: 72, unit: 'bpm', icon: Heart, color: 'red' as const },
    { label: 'Activity', value: 8500, unit: 'steps', icon: Activity, color: 'green' as const },
    { label: 'Mental State', value: 85, unit: '%', icon: Brain, color: 'purple' as const },
    { label: 'Energy', value: 92, unit: '%', icon: Zap, color: 'orange' as const },
  ],
  radarData = [
    { label: 'HR', value: 72, maxValue: 100 },
    { label: 'Stress', value: 35, maxValue: 100 },
    { label: 'Sleep', value: 85, maxValue: 100 },
    { label: 'Energy', value: 92, maxValue: 100 },
    { label: 'Mood', value: 78, maxValue: 100 },
    { label: 'Fitness', value: 65, maxValue: 100 },
  ],
  aiInsight = 'Optimal health pattern detected',
  className = '',
}: HolographicHealthAnalysisProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5]))
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]))

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    mouseX.set(x - 0.5)
    mouseY.set(y - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`relative w-full ${className}`}
    >
      {/* Glass card with holographic effects */}
      <div className="relative glass-card p-6 md:p-8 overflow-hidden">
        {/* Radial hologram gradient background */}
        <div className="absolute inset-0 bg-gradient-radial opacity-60" />
        
        {/* Radial glow rings */}
        <div className="absolute inset-0 overflow-hidden">
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{
                scale: ring * 1.5,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [ring * 1.5, ring * 1.6, ring * 1.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: ring * 0.5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Soft glow shadow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white dark:text-white mb-1">
                Holographic Health Analysis
              </h3>
              <p className="text-sm text-neutral-400 dark:text-neutral-500">
                Real-time biometric insights
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </motion.div>
          </div>

          {/* KPI Blocks Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <KPIBlock
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                icon={kpi.icon}
                color={kpi.color}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Radar Chart and AI Insight Row */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Radar Chart */}
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <RadarChart data={radarData} />
              </motion.div>
            </div>

            {/* AI Insight Pill */}
            <div className="flex flex-col items-center md:items-start justify-center gap-4">
              <AIInsightPill insight={aiInsight} />
              <div 
                className="text-xs text-neutral-400 dark:text-neutral-500 max-w-xs text-center md:text-left"
                aria-live="polite"
              >
                AI analysis updates every 30 seconds
              </div>
            </div>
          </div>
        </div>

        {/* Holographic shimmer overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
          }}
          animate={{
            x: ['-200%', '200%'],
            y: ['-200%', '200%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Accessibility: Screen reader announcements */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        id="health-metrics-announcements"
      />
    </motion.div>
  )
}

