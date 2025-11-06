'use client'

import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FindDoctorsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild>
            <Link href="/landing">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Live Doctor Map + Walk-in Queue
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Find real-time available doctors with instant queue booking and walk-in tokens.
        </p>

        {/* Map Placeholder */}
        <div className="glass-card p-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 mb-8 text-center">
          <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Interactive Doctor Map
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Map integration coming soon. Real-time doctor availability and queue management.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm">Live Queue Status</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm">Instant Booking</span>
            </div>
          </div>
        </div>

        <Button asChild size="lg" variant="gradient">
          <Link href="/auth/register">
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  )
}

