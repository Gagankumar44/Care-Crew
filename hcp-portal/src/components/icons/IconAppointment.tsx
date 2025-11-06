import React, { forwardRef } from 'react'

interface IconAppointmentProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconAppointment = forwardRef<SVGSVGElement, IconAppointmentProps>(
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
        aria-label={title || "Appointment"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Appointment calendar icon - Schedule medical visit</desc>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </svg>
    )
  }
)

IconAppointment.displayName = 'IconAppointment'

export default IconAppointment

