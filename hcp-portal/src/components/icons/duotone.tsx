/**
 * Duotone Medical Icons for Feature Cards
 * 
 * Two-tone filled icons suitable for feature cards and hero badges
 * Style: Base fill + neon accent, rounded corners, 32x32 grid
 */

import React, { forwardRef } from 'react'

interface DuotoneIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
  baseColor?: string
  accentColor?: string
}

// Base color: #E8F4FF (primary-50), Accent: #0A84FF (primary-500)
const DEFAULT_BASE = '#E8F4FF'
const DEFAULT_ACCENT = '#0A84FF'

export const IconHospitalDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Hospital"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Hospital building duotone icon</desc>
        <rect x="4" y="8" width="24" height="20" rx="2" fill={baseColor} />
        <path d="M4 8h24M16 8v20M12 14h8M12 18h8M12 22h8" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <rect x="14" y="14" width="4" height="8" fill={accentColor} rx="1" />
      </svg>
    )
  }
)

IconHospitalDuotone.displayName = 'IconHospitalDuotone'

export const IconTelehealthDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Telehealth"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Telehealth video call duotone icon</desc>
        <rect x="4" y="6" width="24" height="20" rx="2" fill={baseColor} />
        <rect x="8" y="4" width="16" height="4" rx="1" fill={accentColor} />
        <circle cx="16" cy="16" r="4" fill={accentColor} />
        <circle cx="16" cy="16" r="2" fill={baseColor} />
      </svg>
    )
  }
)

IconTelehealthDuotone.displayName = 'IconTelehealthDuotone'

export const IconAIInsightsDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "AI Insights"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>AI insights brain duotone icon</desc>
        <circle cx="16" cy="16" r="12" fill={baseColor} />
        <path d="M10 12c2 2 4 4 6 6M22 20c-2-2-4-4-6-6M16 8v6M16 18v6M8 16h6M18 16h6" stroke={accentColor} strokeWidth="2" />
        <circle cx="16" cy="16" r="8" fill={accentColor} opacity="0.2" />
      </svg>
    )
  }
)

IconAIInsightsDuotone.displayName = 'IconAIInsightsDuotone'

export const IconHolographicAnalyticsDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Analytics"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Holographic analytics radar duotone icon</desc>
        <circle cx="16" cy="16" r="14" fill={baseColor} />
        <path d="M16 2v28M2 16h28M6 6l20 20M26 6L6 26" stroke={accentColor} strokeWidth="2" />
        <circle cx="16" cy="16" r="6" fill={accentColor} opacity="0.3" />
        <circle cx="16" cy="16" r="3" fill={accentColor} />
      </svg>
    )
  }
)

IconHolographicAnalyticsDuotone.displayName = 'IconHolographicAnalyticsDuotone'

export const IconDemoVideoDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Demo Video"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Demo video play button duotone icon</desc>
        <circle cx="16" cy="16" r="14" fill={baseColor} />
        <polygon points="12,10 12,22 22,16" fill={accentColor} />
      </svg>
    )
  }
)

IconDemoVideoDuotone.displayName = 'IconDemoVideoDuotone'

export const IconSecureShieldDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Secure Shield"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Secure shield protection duotone icon</desc>
        <path d="M16 2L4 8v12c0 8 12 18 12 18s12-10 12-18V8L16 2z" fill={baseColor} />
        <path d="M16 2L4 8v12c0 8 12 18 12 18s12-10 12-18V8L16 2z" stroke={accentColor} strokeWidth="2" />
        <path d="M12 16l4 4 8-8" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )
  }
)

IconSecureShieldDuotone.displayName = 'IconSecureShieldDuotone'

export const IconAppointmentDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Appointment"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Appointment calendar duotone icon</desc>
        <rect x="6" y="6" width="20" height="22" rx="2" fill={baseColor} />
        <path d="M6 12h20M12 6v6M20 6v6" stroke={accentColor} strokeWidth="2" />
        <circle cx="13" cy="18" r="1.5" fill={accentColor} />
        <circle cx="16" cy="18" r="1.5" fill={accentColor} />
        <circle cx="19" cy="18" r="1.5" fill={accentColor} />
        <circle cx="13" cy="22" r="1.5" fill={accentColor} />
        <circle cx="16" cy="22" r="1.5" fill={accentColor} />
      </svg>
    )
  }
)

IconAppointmentDuotone.displayName = 'IconAppointmentDuotone'

export const IconPrescriptionDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Prescription"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Prescription pad duotone icon</desc>
        <rect x="8" y="6" width="16" height="20" rx="1" fill={baseColor} />
        <path d="M10 10h12M10 14h8M10 18h12M10 22h10" stroke={accentColor} strokeWidth="2" />
        <path d="M24 6l4 4-4 4" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
)

IconPrescriptionDuotone.displayName = 'IconPrescriptionDuotone'

export const IconLabTestDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Lab Test"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Laboratory test microscope duotone icon</desc>
        <circle cx="16" cy="12" r="6" fill={baseColor} />
        <path d="M16 18v10M10 22h12" stroke={accentColor} strokeWidth="2" />
        <circle cx="16" cy="26" r="4" fill={accentColor} opacity="0.3" />
        <path d="M8 8l-2 2M26 8l2 2" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
)

IconLabTestDuotone.displayName = 'IconLabTestDuotone'

export const IconMRIDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "MRI"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>MRI scanner duotone icon</desc>
        <rect x="6" y="8" width="20" height="16" rx="2" fill={baseColor} />
        <rect x="8" y="10" width="16" height="12" rx="1" fill={accentColor} opacity="0.2" />
        <circle cx="16" cy="16" r="4" fill={accentColor} />
        <path d="M6 12h20M6 20h20" stroke={accentColor} strokeWidth="2" />
      </svg>
    )
  }
)

IconMRIDuotone.displayName = 'IconMRIDuotone'

export const IconAmbulanceDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = '#FF3B30', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Ambulance"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Ambulance vehicle duotone icon</desc>
        <rect x="4" y="14" width="24" height="12" rx="1" fill={baseColor} />
        <circle cx="10" cy="26" r="3" fill={accentColor} />
        <circle cx="22" cy="26" r="3" fill={accentColor} />
        <rect x="6" y="16" width="20" height="8" fill={accentColor} />
        <path d="M14 18h4M14 21h6" stroke={baseColor} strokeWidth="1.5" />
      </svg>
    )
  }
)

IconAmbulanceDuotone.displayName = 'IconAmbulanceDuotone'

export const IconDoctorDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Doctor"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Doctor profile duotone icon</desc>
        <circle cx="16" cy="12" r="6" fill={baseColor} />
        <path d="M8 24c0-4 3.5-8 8-8s8 4 8 8" fill={accentColor} opacity="0.3" />
        <path d="M12 16h8M16 12v8" stroke={accentColor} strokeWidth="2" />
      </svg>
    )
  }
)

IconDoctorDuotone.displayName = 'IconDoctorDuotone'

export const IconPaymentDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Payment"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Payment card duotone icon</desc>
        <rect x="6" y="10" width="20" height="14" rx="2" fill={baseColor} />
        <rect x="8" y="12" width="16" height="10" rx="1" fill={accentColor} opacity="0.2" />
        <path d="M8 18h16M8 22h12" stroke={accentColor} strokeWidth="2" />
      </svg>
    )
  }
)

IconPaymentDuotone.displayName = 'IconPaymentDuotone'

export const IconRatingStarDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = '#FFD700', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Rating Star"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Rating star duotone icon</desc>
        <path d="M16 2l4 8 9 1-6 6 1 9-8-4-8 4 1-9-6-6 9-1z" fill={baseColor} />
        <path d="M16 2l4 8 9 1-6 6 1 9-8-4-8 4 1-9-6-6 9-1z" fill={accentColor} opacity="0.6" />
      </svg>
    )
  }
)

IconRatingStarDuotone.displayName = 'IconRatingStarDuotone'

export const IconChatSupportDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Chat Support"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Chat support message duotone icon</desc>
        <path d="M6 8h20v14H10l-4 4V8z" fill={baseColor} />
        <path d="M6 8h20v14H10l-4 4V8z" stroke={accentColor} strokeWidth="2" />
        <circle cx="12" cy="15" r="1.5" fill={accentColor} />
        <circle cx="16" cy="15" r="1.5" fill={accentColor} />
        <circle cx="20" cy="15" r="1.5" fill={accentColor} />
      </svg>
    )
  }
)

IconChatSupportDuotone.displayName = 'IconChatSupportDuotone'

export const IconCalendarDuotone = forwardRef<SVGSVGElement, DuotoneIconProps>(
  ({ size = 32, className = '', title, baseColor = DEFAULT_BASE, accentColor = DEFAULT_ACCENT, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-label={title || "Calendar"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Calendar schedule duotone icon</desc>
        <rect x="6" y="8" width="20" height="18" rx="2" fill={baseColor} />
        <path d="M6 14h20M12 6v6M20 6v6" stroke={accentColor} strokeWidth="2" />
        <circle cx="11" cy="20" r="1.5" fill={accentColor} />
        <circle cx="16" cy="20" r="1.5" fill={accentColor} />
        <circle cx="21" cy="20" r="1.5" fill={accentColor} />
        <circle cx="11" cy="25" r="1.5" fill={accentColor} />
        <circle cx="16" cy="25" r="1.5" fill={accentColor} />
      </svg>
    )
  }
)

IconCalendarDuotone.displayName = 'IconCalendarDuotone'

