'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote, Verified } from 'lucide-react'

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company?: string
  avatar?: string
  image?: string
  rating?: number
  verified?: boolean
  featured?: boolean
  tags?: string[]
}

interface TestimonialTemplateProps {
  testimonial: Testimonial
  variant?: 'short' | 'medium' | 'long' | 'featured'
  className?: string
  index?: number
}

export function TestimonialTemplate({
  testimonial,
  variant = 'medium',
  className = '',
  index = 0,
}: TestimonialTemplateProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const variants = {
    short: {
      card: 'p-4',
      quote: 'text-sm',
      author: 'text-xs',
      spacing: 'mb-2',
    },
    medium: {
      card: 'p-6',
      quote: 'text-base',
      author: 'text-sm',
      spacing: 'mb-4',
    },
    long: {
      card: 'p-8',
      quote: 'text-lg',
      author: 'text-base',
      spacing: 'mb-6',
    },
    featured: {
      card: 'p-10',
      quote: 'text-xl',
      author: 'text-lg',
      spacing: 'mb-8',
    },
  }

  const style = variants[variant]
  const isFeatured = variant === 'featured' || testimonial.featured

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative ${className}`}
      aria-labelledby={`testimonial-${testimonial.id}-author`}
    >
      <div
        className={`
          glass-card border border-neutral-200 dark:border-neutral-800
          hover:shadow-glass-lg transition-all duration-300 relative
          ${style.card}
          ${isFeatured ? 'ring-2 ring-primary/30 md:-mt-4 md:mb-4' : ''}
        `}
      >
        {/* Quote Icon */}
        <Quote className="w-6 h-6 text-primary/20 absolute top-4 right-4" />

        {/* Rating */}
        {testimonial.rating !== undefined && (
          <div className={`flex gap-1 ${style.spacing}`} role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating!
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-neutral-300 dark:text-neutral-700'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quote Text */}
        <blockquote className={`${style.quote} text-neutral-700 dark:text-neutral-300 leading-relaxed ${style.spacing} ${variant === 'featured' ? 'pr-12' : 'pr-8'}`}>
          "{testimonial.quote}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={testimonial.author}
              className={`${variant === 'featured' ? 'w-14 h-14' : variant === 'short' ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover shadow-lg`}
            />
          ) : (
            <div
              className={`
                ${variant === 'featured' ? 'w-14 h-14' : variant === 'short' ? 'w-8 h-8' : 'w-10 h-10'}
                rounded-full bg-gradient-primary flex items-center justify-center
                ${variant === 'featured' ? 'text-lg' : 'text-sm'}
                font-semibold text-white shadow-lg
              `}
            >
              {testimonial.avatar || testimonial.author.charAt(0)}
            </div>
          )}

          {/* Author Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div
                id={`testimonial-${testimonial.id}-author`}
                className={`font-semibold text-neutral-900 dark:text-white ${style.author}`}
              >
                {testimonial.author}
              </div>
              {testimonial.verified && (
                <Verified className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              )}
            </div>
            <div className={`${style.author} text-neutral-500 dark:text-neutral-500`}>
              {testimonial.role}
              {testimonial.company && ` • ${testimonial.company}`}
            </div>
          </div>
        </div>

        {/* Tags */}
        {testimonial.tags && testimonial.tags.length > 0 && variant !== 'short' && (
          <div className={`flex flex-wrap gap-2 mt-4 ${style.spacing}`}>
            {testimonial.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary dark:text-primary-400 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute -top-3 left-4">
            <div className="px-3 py-1 bg-gradient-to-r from-primary to-purple-600 rounded-full text-xs font-semibold text-white shadow-lg">
              Featured
            </div>
          </div>
        )}
      </div>
    </motion.article>
  )
}

// Short Testimonial Grid Component
interface TestimonialGridProps {
  testimonials: Testimonial[]
  variant?: 'short' | 'medium' | 'long' | 'featured'
  columns?: 2 | 3 | 4
  className?: string
  title?: string
  description?: string
}

export function TestimonialGrid({
  testimonials,
  variant = 'medium',
  columns = 3,
  className = '',
  title,
  description,
}: TestimonialGridProps) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <section
      ref={sectionRef}
      className={`py-32 bg-gradient-apple relative w-full ${className}`}
      aria-labelledby={title ? 'testimonials-title' : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            {title && (
              <h2
                id="testimonials-title"
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </p>
            )}
          </motion.div>
        )}

        <div
          className={`grid ${gridClass} gap-6 lg:gap-8`}
          role="list"
          aria-label="Customer testimonials"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialTemplate
              key={testimonial.id}
              testimonial={testimonial}
              variant={variant}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

