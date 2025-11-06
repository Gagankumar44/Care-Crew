import React, { forwardRef } from 'react'

interface IconInsuranceProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconInsurance = forwardRef<SVGSVGElement, IconInsuranceProps>(
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
        aria-label={title || "Insurance"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Insurance shield icon - Health coverage protection</desc>
        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  }
)

IconInsurance.displayName = 'IconInsurance'

export default IconInsurance

