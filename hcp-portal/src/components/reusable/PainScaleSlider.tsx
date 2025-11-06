'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface PainScaleSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
}

const painLabels = [
  { value: 0, label: 'No Pain' },
  { value: 2, label: 'Mild' },
  { value: 4, label: 'Discomforting' },
  { value: 6, label: 'Distressing' },
  { value: 8, label: 'Intense' },
  { value: 10, label: 'Unbearable' },
]

export function PainScaleSlider({ value, onChange, label = 'Pain Level' }: PainScaleSliderProps) {
  const getColorForValue = (val: number) => {
    if (val <= 2) return 'bg-green-500'
    if (val <= 4) return 'bg-yellow-500'
    if (val <= 6) return 'bg-orange-500'
    if (val <= 8) return 'bg-red-500'
    return 'bg-red-700'
  }

  const currentLabel = painLabels.reduce((prev, curr) => 
    Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${getColorForValue(value).replace('bg-', 'text-')}`}>
            {value}
          </span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">/ 10</span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${getColorForValue(value)} 0%, ${getColorForValue(value)} ${(value / 10) * 100}%, rgb(229, 231, 235) ${(value / 10) * 100}%, rgb(229, 231, 235) 100%)`
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {painLabels.map((item, idx) => (
            <span key={idx} className={value === item.value ? 'font-semibold text-primary' : ''}>
              {item.value}
            </span>
          ))}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLabel.label}
        </span>
      </motion.div>
    </div>
  )
}

