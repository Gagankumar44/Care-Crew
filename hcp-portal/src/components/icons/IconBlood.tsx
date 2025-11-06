import React, { forwardRef } from 'react'

interface IconBloodProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconBlood = forwardRef<SVGSVGElement, IconBloodProps>(
  ({ size = 24, className = '', title, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-label={title || "Blood"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Blood drop icon - Blood test and donation</desc>
        <path d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z" />
        <path d="M12 6v6M9 9h6" />
      </svg>
    )
  }
)

IconBlood.displayName = 'IconBlood'

export default IconBlood

