/**
 * Medical Icon Components
 * 
 * Optimized React components for medical icons with:
 * - forwardRef support
 * - Tailwind CSS ready (currentColor)
 * - Accessibility built-in (title, desc, aria-label)
 * - Consistent 24x24 viewBox
 * - 2px stroke width for crisp rendering
 */

export { IconHospital, default as IconHospitalDefault } from './IconHospital'
export { IconDoctor, default as IconDoctorDefault } from './IconDoctor'
export { IconStethoscope, default as IconStethoscopeDefault } from './IconStethoscope'
export { IconAppointment, default as IconAppointmentDefault } from './IconAppointment'
export { IconPill, default as IconPillDefault } from './IconPill'
export { IconSyringe, default as IconSyringeDefault } from './IconSyringe'
export { IconAmbulance, default as IconAmbulanceDefault } from './IconAmbulance'
export { IconWheelchair, default as IconWheelchairDefault } from './IconWheelchair'
export { IconBed, default as IconBedDefault } from './IconBed'
export { IconSurgery, default as IconSurgeryDefault } from './IconSurgery'
export { IconECG, default as IconECGDefault } from './IconECG'
export { IconLab, default as IconLabDefault } from './IconLab'
export { IconTelehealth, default as IconTelehealthDefault } from './IconTelehealth'
export { IconChat, default as IconChatDefault } from './IconChat'
export { IconInsurance, default as IconInsuranceDefault } from './IconInsurance'
export { IconBlood, default as IconBloodDefault } from './IconBlood'
export { IconOxygen, default as IconOxygenDefault } from './IconOxygen'
export { IconIV, default as IconIVDefault } from './IconIV'
export { IconPharmacy, default as IconPharmacyDefault } from './IconPharmacy'
export { IconARScan, default as IconARScanDefault } from './IconARScan'

// Type exports
export type IconProps = {
  size?: number | string
  className?: string
  title?: string
} & React.SVGProps<SVGSVGElement>

