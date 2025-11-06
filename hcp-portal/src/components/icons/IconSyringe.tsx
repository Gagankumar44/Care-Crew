import React, { forwardRef } from 'react'

interface IconSyringeProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconSyringe = forwardRef<SVGSVGElement, IconSyringeProps>(
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
        aria-label={title || "Syringe"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Syringe icon - Medical injection device</desc>
        <path d="M18 2h-3a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
        <path d="M12 6h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M10 12h4M12 10v4" />
      </svg>
    )
  }
)

IconSyringe.displayName = 'IconSyringe'

export default IconSyringe

