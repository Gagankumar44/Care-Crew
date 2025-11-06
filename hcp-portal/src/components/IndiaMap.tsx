'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, TrendingUp, Users, Plane, MapPin } from 'lucide-react'
import { getIndiaAnalytics, type StateStats } from '@/lib/api/india-analytics'

interface IndiaMapProps {
  onStateClick?: (stateCode: string) => void
  selectedState?: string | null
}

// Simplified India states map data (coordinates for SVG)
const INDIA_STATES = {
  'KA': { name: 'Karnataka', x: 350, y: 550, path: 'M350,550 L370,570 L380,560 L360,540 Z' },
  'TN': { name: 'Tamil Nadu', x: 380, y: 620, path: 'M380,620 L400,640 L410,630 L390,610 Z' },
  'MH': { name: 'Maharashtra', x: 280, y: 480, path: 'M280,480 L320,500 L330,490 L290,470 Z' },
  'DL': { name: 'Delhi', x: 300, y: 320, path: 'M300,320 L310,330 L305,325 L295,315 Z' },
  'UP': { name: 'Uttar Pradesh', x: 320, y: 360, path: 'M320,360 L360,380 L370,370 L330,350 Z' },
  'GJ': { name: 'Gujarat', x: 200, y: 420, path: 'M200,420 L240,440 L250,430 L210,410 Z' },
  'RJ': { name: 'Rajasthan', x: 240, y: 340, path: 'M240,340 L300,360 L310,350 L250,330 Z' },
  'WB': { name: 'West Bengal', x: 420, y: 400, path: 'M420,400 L450,420 L460,410 L430,390 Z' },
  'AP': { name: 'Andhra Pradesh', x: 360, y: 580, path: 'M360,580 L400,600 L410,590 L370,570 Z' },
  'TG': { name: 'Telangana', x: 340, y: 540, path: 'M340,540 L370,560 L380,550 L350,530 Z' },
  'KL': { name: 'Kerala', x: 360, y: 610, path: 'M360,610 L380,630 L390,620 L370,600 Z' },
  'OR': { name: 'Odisha', x: 380, y: 480, path: 'M380,480 L410,500 L420,490 L390,470 Z' },
  'MP': { name: 'Madhya Pradesh', x: 280, y: 400, path: 'M280,400 L320,420 L330,410 L290,390 Z' },
  'PB': { name: 'Punjab', x: 280, y: 280, path: 'M280,280 L310,300 L320,290 L290,270 Z' },
  'HR': { name: 'Haryana', x: 290, y: 310, path: 'M290,310 L310,330 L320,320 L300,300 Z' },
}

export default function IndiaMap({ onStateClick, selectedState }: IndiaMapProps) {
  const [analytics, setAnalytics] = useState<StateStats[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await getIndiaAnalytics()
      setAnalytics(data.state_stats)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStateData = (stateCode: string) => {
    return analytics.find(s => s.state_code === stateCode)
  }

  const getStateColor = (stateCode: string) => {
    if (selectedState === stateCode) return 'fill-blue-500'
    if (hoveredState === stateCode) return 'fill-blue-400'
    const data = getStateData(stateCode)
    if (!data) return 'fill-gray-300'
    
    // Color based on hospital count
    const maxHospitals = Math.max(...analytics.map(s => s.hospital_count), 1)
    const intensity = data.hospital_count / maxHospitals
    if (intensity > 0.7) return 'fill-green-500'
    if (intensity > 0.4) return 'fill-yellow-500'
    return 'fill-orange-500'
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        India Hospital Analytics Map
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="relative">
          {/* SVG Map */}
          <svg 
            viewBox="0 0 600 700" 
            className="w-full h-auto"
            style={{ maxHeight: '600px' }}
          >
            {Object.entries(INDIA_STATES).map(([code, state]) => {
              const data = getStateData(code)
              return (
                <g key={code}>
                  <rect
                    x={state.x - 20}
                    y={state.y - 20}
                    width="80"
                    height="60"
                    rx="4"
                    className={getStateColor(code)}
                    opacity={selectedState && selectedState !== code ? 0.3 : 0.8}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredState(code)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => onStateClick?.(code)}
                  />
                  <text
                    x={state.x + 20}
                    y={state.y + 10}
                    className="text-xs font-medium fill-white pointer-events-none"
                    textAnchor="middle"
                  >
                    {state.name}
                  </text>
                  {data && (
                    <text
                      x={state.x + 20}
                      y={state.y + 25}
                      className="text-xs font-bold fill-white pointer-events-none"
                      textAnchor="middle"
                    >
                      {data.hospital_count} Hospitals
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">High Density</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Medium Density</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Low Density</span>
            </div>
          </div>
        </div>
      )}

      {/* State Stats Grid */}
      {selectedState && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {(() => {
            const data = getStateData(selectedState)
            if (!data) return null
            return (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4"
                >
                  <Building2 className="w-6 h-6 text-primary mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.hospital_count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hospitals</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4"
                >
                  <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.total_surgeries}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Surgeries</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4"
                >
                  <Users className="w-6 h-6 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.city_count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Cities</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4"
                >
                  <Plane className="w-6 h-6 text-purple-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.air_ambulance_missions}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Air Missions</div>
                </motion.div>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

