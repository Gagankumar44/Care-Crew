'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote, Shield } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Patient',
    image: '👩‍⚕️',
    rating: 5,
    text: 'Care Crew has revolutionized how I manage my health. The AR skin check feature helped me catch a condition early. Incredible technology!',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Healthcare Provider',
    image: '👨‍⚕️',
    rating: 5,
    text: 'As a physician, I\'m impressed by the accuracy of the AI triage system. It helps my patients get better care faster.',
  },
  {
    name: 'Emily Davis',
    role: 'Patient',
    image: '👩',
    rating: 5,
    text: 'The ROM analysis feature has been a game-changer for my physical therapy. I can track my progress from home!',
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-card p-8 hover:shadow-glass-lg transition-apple relative"
      style={{ opacity: 1 }}
    >
      <Quote className="w-12 h-12 text-primary/20 absolute top-6 right-6" />
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl shadow-float">
          {testimonial.image}
        </div>
        <div>
          <div className="font-semibold text-neutral-900 dark:text-white">{testimonial.name}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">{testimonial.role}</div>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-warning text-warning" />
        ))}
      </div>

      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
        "{testimonial.text}"
      </p>
    </motion.div>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 bg-gradient-apple relative w-full min-h-[500px]" style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ opacity: 1 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              See what our users are saying about Care Crew
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-6"
          style={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20">
            <Shield className="w-5 h-5 text-health" />
            <span className="text-neutral-700 dark:text-neutral-300">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20">
            <Shield className="w-5 h-5 text-health" />
            <span className="text-neutral-700 dark:text-neutral-300">FDA Approved</span>
          </div>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-health/20">
            <Shield className="w-5 h-5 text-health" />
            <span className="text-neutral-700 dark:text-neutral-300">SOC 2 Certified</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

