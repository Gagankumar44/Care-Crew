/**
 * Design System Components
 * 
 * Component-driven design system following design principles:
 * - Minimal palette: dark neutrals + teal/violet accents
 * - 8px baseline grid for spacing
 * - High information density with clear hierarchy
 * - Subtle glass effects (backdrop-blur + faint borders)
 * - Micro-interactions: 200-380ms transitions with Framer Motion
 * - Accessible contrast: AA/AAA compliant
 * - Performance-first: lazy loading, SVG icons
 */

export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card'
export type { CardProps } from './card'

export { Metric, metricVariants } from './metric'
export type { MetricProps } from './metric'

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from './modal'

export { 
  Icon, 
  Illustration, 
  getIconMetadata, 
  getIllustrationMetadata,
  getIconsByCategory,
  getIllustrationsByCategory 
} from './Icon'
export type { IconProps, IllustrationProps } from './Icon'

