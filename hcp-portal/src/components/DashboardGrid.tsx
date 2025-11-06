'use client'

import React from 'react'
import { MetricCard, MetricCardProps } from './MetricCard'

interface DashboardGridProps {
  metrics: Omit<MetricCardProps, 'delay'>[]
  className?: string
}

/**
 * DashboardGrid - Responsive grid for metric cards
 * - 4 columns >= 1200px
 * - 3 columns >= 992px
 * - 2 columns >= 768px
 * - 1 column mobile
 */
export function DashboardGrid({ metrics, className }: DashboardGridProps) {
  // Check if sleep quality is low (< 60)
  const sleepQualityMetric = metrics.find(m => m.title === 'Sleep Quality')
  const isSleepQualityLow = sleepQualityMetric && typeof sleepQualityMetric.value === 'string'
    ? parseInt(sleepQualityMetric.value.replace('%', '')) < 60
    : false

  return (
    <div
      className={`
        grid grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-4
        ${isSleepQualityLow ? 'xl:grid-cols-2 lg:grid-cols-2' : ''}
        ${className || ''}
      `}
      role="grid"
      aria-label="Dashboard metrics"
    >
      {metrics.map((metric, index) => {
        const isAlert = metric.title === 'Sleep Quality' && typeof metric.value === 'string'
          ? parseInt(metric.value.replace('%', '')) < 60
          : false
        
        return (
          <MetricCard
            key={metric.title}
            {...metric}
            delay={index * 0.1}
            isAlert={isAlert}
            className={isAlert ? 'xl:col-span-2 lg:col-span-2' : ''}
          />
        )
      })}
    </div>
  )
}
