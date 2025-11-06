'use client'

import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-3xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-elevation-1",
        glass: "glass-card border border-white/10 dark:border-white/5",
        elevated: "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-elevation-2 hover:shadow-elevation-hover",
        flat: "bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800",
      },
      size: {
        sm: "p-4",      // 16px (2x base)
        md: "p-6",      // 24px (3x base)
        lg: "p-8",      // 32px (4x base)
        xl: "p-10",     // 40px (5x base)
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface CardProps
  extends Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof cardVariants> {
  hover?: boolean
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover = true, children, ...props }, ref) => {
    const classes = cn(cardVariants({ variant, size }), className)
    
    // Motion variants for hover elevation
    const motionVariants = {
      initial: { y: 0 },
      hover: hover ? { 
        y: -4, // 4px lift (half of base unit)
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      } : {},
    }
    
    return (
      <motion.div
        ref={ref}
        className={classes}
        variants={motionVariants}
        initial="initial"
        whileHover={hover ? "hover" : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
Card.displayName = "Card"

// Card sub-components for hierarchy
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 mb-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
>(({ className, as: Component = 'h3', ...props }, ref) => (
  <Component
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight text-neutral-900 dark:text-white", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-600 dark:text-neutral-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center mt-6", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

