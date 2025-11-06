'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const metricVariants = cva(
  "flex flex-col transition-all duration-300",
  {
    variants: {
      size: {
        sm: "gap-1",      // 8px gap (1x base)
        md: "gap-2",      // 16px gap (2x base)
        lg: "gap-3",      // 24px gap (3x base)
      },
      emphasis: {
        default: "",
        high: "bg-gradient-glass dark:bg-gradient-glass-dark rounded-2xl p-6 border border-white/5 dark:border-white/5",
      },
    },
    defaultVariants: {
      size: "md",
      emphasis: "default",
    },
  }
)

export interface MetricProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricVariants> {
  value: string | number
  label: string
  trend?: {
    value: number
    label?: string
    positive?: boolean
  }
  icon?: React.ReactNode
  delay?: number
}

const Metric = React.forwardRef<HTMLDivElement, MetricProps>(
  ({ className, size, emphasis, value, label, trend, icon, delay = 0, ...props }, ref) => {
    const classes = cn(metricVariants({ size, emphasis }), className)
    
    // Animation for metric appearance
    const containerVariants = {
      hidden: { opacity: 0, y: 8 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.35,
          delay,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    }
    
    return (
      <motion.div
        ref={ref}
        className={classes}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {icon && (
          <div className="mb-2 text-teal-500 dark:text-teal-400">
            {icon}
          </div>
        )}
        
        <div className="flex items-baseline gap-2">
          <motion.div
            className="text-3xl font-bold text-neutral-900 dark:text-white tabular-nums"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.1 }}
          >
            {value}
          </motion.div>
          
          {trend && (
            <motion.div
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend.positive !== false
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-error dark:text-error-300"
              )}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.15 }}
            >
              <span>{trend.positive !== false ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              {trend.label && (
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                  {trend.label}
                </span>
              )}
            </motion.div>
          )}
        </div>
        
        <motion.p
          className="text-sm text-neutral-600 dark:text-neutral-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
        >
          {label}
        </motion.p>
      </motion.div>
    )
  }
)
Metric.displayName = "Metric"

export { Metric, metricVariants }

