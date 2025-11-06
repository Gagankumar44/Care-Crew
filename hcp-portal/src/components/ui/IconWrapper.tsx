/**
 * Icon Wrapper Component
 * Wraps custom Icon component to work with navigation and other components
 * that expect a React component with className prop
 */

import { Icon as CustomIcon } from '@/components/ui/Icon'

interface WrappedIconProps {
  className?: string
  size?: number
}

/**
 * Creates a wrapped icon component from a custom icon ID
 * Use this in navigation and other places that expect React.ComponentType
 */
export function createIconComponent(iconId: string, defaultSize: number = 20) {
  return function WrappedIcon({ className, size }: WrappedIconProps) {
    try {
      return (
        <CustomIcon 
          id={iconId as any} 
          size={size || defaultSize}
          className={className || ''}
        />
      )
    } catch (error) {
      console.warn(`Icon "${iconId}" not found, returning null`)
      return null
    }
  }
}

/**
 * Icon mapping for navigation
 * Maps common icon names to custom icon IDs
 */
export const iconMap = {
  'hospital': 'hospital-building',
  'doctor': 'doctor-profile-new',
  'nurse': 'nurse-avatar',
  'appointment': 'appointment-calendar',
  'stethoscope': 'stethoscope-new',
  'pill': 'pill-medicine',
  'syringe': 'syringe-vaccine',
  'ambulance': 'ambulance-new',
  'wheelchair': 'wheelchair',
  'bed': 'bed-admission',
  'scalpel': 'surgery-scalpel',
  'ecg': 'ecg-heartbeat',
  'heartbeat': 'ecg-heartbeat',
  'mri': 'mri-scanner',
  'microscope': 'lab-test-microscope',
  'lab': 'lab-test-microscope',
  'prescription': 'prescription-rx',
  'rx': 'prescription-rx',
  'video-call': 'telehealth-video-call',
  'telehealth': 'telehealth-video-call',
  'chat': 'chat-medical-support',
  'message': 'chat-medical-support',
  'insurance': 'insurance-shield',
  'shield': 'insurance-shield',
  'blood': 'blood-drop',
  'oxygen': 'oxygen-mask',
  'iv': 'iv-drip',
  'drip': 'iv-drip',
  'report': 'health-report-pdf',
  'health-report': 'health-report-pdf',
  'analytics': 'analytics-hologram-radar',
  'radar': 'analytics-hologram-radar',
  'ai': 'ai-brain-circuit',
  'brain': 'ai-brain-circuit',
  'map': 'map-hospital-locator',
  'locator': 'map-hospital-locator',
  'emergency': 'emergency-siren',
  'siren': 'emergency-siren',
  'pharmacy': 'pharmacy-mortar-pestle',
}

/**
 * Get icon component from icon name or ID
 */
export function getIconComponent(iconName: string, defaultSize: number = 20) {
  const iconId = iconMap[iconName.toLowerCase() as keyof typeof iconMap] || iconName
  return createIconComponent(iconId, defaultSize)
}

