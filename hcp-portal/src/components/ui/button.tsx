'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-teal-500 text-white hover:bg-teal-600 shadow-elevation-1 hover:shadow-elevation-2 active:scale-[0.98]",
        destructive:
          "bg-error text-white hover:bg-error-600 shadow-elevation-1 hover:shadow-elevation-2 active:scale-[0.98]",
        outline:
          "border-2 border-neutral-200 dark:border-neutral-800 bg-background hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white",
        secondary:
          "bg-violet-500 text-white hover:bg-violet-600 shadow-elevation-1 hover:shadow-elevation-2 active:scale-[0.98]",
        ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white",
        link: "text-teal-600 dark:text-teal-400 underline-offset-4 hover:underline",
        gradient: "bg-gradient-teal-violet text-white hover:opacity-90 shadow-elevation-2 hover:shadow-elevation-3 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2", // 8px vertical padding
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base", // 24px vertical padding (3x base)
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))
    
    // Motion variants for micro-interactions
    const motionVariants = {
      initial: { scale: 1 },
      hover: { scale: 1.02, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
      tap: { scale: 0.98, transition: { duration: 0.2 } },
    }
    
    if (asChild) {
      return (
        <Slot className={classes} {...props}>
          {children}
        </Slot>
      )
    }
    
    return (
      <motion.button
        ref={ref}
        className={classes}
        variants={motionVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
