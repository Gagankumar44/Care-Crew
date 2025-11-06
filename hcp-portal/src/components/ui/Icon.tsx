/**
 * Icon Component
 * 
 * Reusable component for displaying Care Crew icons with proper sizing and alt text
 */

import Image from 'next/image'
import iconsMetadata from '@/data/icons.json'
import illustrationsMetadata from '@/data/illustrations.json'

type IconId = typeof iconsMetadata.icons[number]['id']
type IllustrationId = typeof illustrationsMetadata.illustrations[number]['id']

export interface IconProps {
  id: IconId
  size?: number
  className?: string
  priority?: boolean
  useSvg?: boolean
}

export function Icon({ 
  id, 
  size = 24, 
  className = '',
  priority = false,
  useSvg = true 
}: IconProps) {
  const iconData = iconsMetadata.icons.find(icon => icon.id === id)
  
  if (!iconData) {
    console.warn(`Icon with id "${id}" not found`)
    return null
  }

  const basePath = '/icons'
  const svgPath = `${basePath}/svg/${iconData.filename}.svg`
  const pngPath = `${basePath}/png/1x/${iconData.filename}.png`
  
  if (useSvg) {
    // Use Next.js Image for better performance with lazy loading
    return (
      <img
        src={svgPath}
        alt={iconData.altText}
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    )
  }

  return (
    <Image
      src={pngPath}
      srcSet={`
        ${basePath}/png/1x/${iconData.filename}.png 1x,
        ${basePath}/png/2x/${iconData.filename}@2x.png 2x,
        ${basePath}/png/3x/${iconData.filename}@3x.png 3x
      `}
      alt={iconData.altText}
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  )
}

/**
 * Illustration Component
 * 
 * Reusable component for displaying MediAR hero illustrations
 */

export interface IllustrationProps {
  id: IllustrationId
  width?: number
  height?: number
  className?: string
  priority?: boolean
  useSvg?: boolean
}

export function Illustration({
  id,
  width = 1200,
  height = 800,
  className = '',
  priority = false,
  useSvg = true
}: IllustrationProps) {
  const illustrationData = illustrationsMetadata.illustrations.find(
    ill => ill.id === id
  )
  
  if (!illustrationData) {
    console.warn(`Illustration with id "${id}" not found`)
    return null
  }

  const basePath = '/illustrations'
  const svgPath = `${basePath}/svg/${illustrationData.filename}.svg`
  const pngPath = `${basePath}/png/1x/${illustrationData.filename}.png`
  
  if (useSvg) {
    // Lazy load illustrations for performance
    return (
      <img
        src={svgPath}
        alt={illustrationData.altText}
        width={width}
        height={height}
        className={className}
        style={{ width, height }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    )
  }

  return (
    <Image
      src={pngPath}
      srcSet={`
        ${basePath}/png/1x/${illustrationData.filename}.png 1x,
        ${basePath}/png/2x/${illustrationData.filename}@2x.png 2x,
        ${basePath}/png/3x/${illustrationData.filename}@3x.png 3x
      `}
      alt={illustrationData.altText}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}

/**
 * Helper function to get icon metadata
 */
export function getIconMetadata(id: IconId) {
  return iconsMetadata.icons.find(icon => icon.id === id)
}

/**
 * Helper function to get illustration metadata
 */
export function getIllustrationMetadata(id: IllustrationId) {
  return illustrationsMetadata.illustrations.find(ill => ill.id === id)
}

/**
 * Helper function to get icons by category
 */
export function getIconsByCategory(category: string) {
  return iconsMetadata.icons.filter(icon => icon.category === category)
}

/**
 * Helper function to get illustrations by category
 */
export function getIllustrationsByCategory(category: string) {
  return illustrationsMetadata.illustrations.filter(
    ill => ill.category === category
  )
}

