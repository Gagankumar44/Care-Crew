'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Feature Detail Pages
 * Handles all feature routes dynamically
 */

const featureRoutes: Record<string, { title: string; description: string; comingSoon?: boolean }> = {
  'neural-care': {
    title: 'Neural-Care Mode',
    description: 'Continuous AI Health Guardian - Always-on health context memory that detects patterns and provides proactive alerts.',
  },
  'voice-assistant': {
    title: 'Voice-First Medical Assistant',
    description: 'Talk faster than you type - Voice history of symptoms, doctor notes narration, and voice emergency mode.',
  },
  'ai-copilot': {
    title: 'Doctor AI Co-Pilot',
    description: 'Time-saving medical assistant for doctors - Auto note-taking, SOAP notes, prescription suggestions.',
  },
  'digital-twin': {
    title: 'Genomic + Lifestyle Digital Twin',
    description: 'Preview your health future with AI predictions and personalized insights.',
  },
  'ar-scan': {
    title: 'AI Medical Camera + 3D Body Scan',
    description: 'Full body health tracking with 3D mesh, wound healing monitoring, and skin lesion AI analysis.',
  },
  'medicine-scanner': {
    title: 'Smart Medicine Scanner',
    description: 'Scan, identify, and track medicines with dosage reminders and drug interaction alerts.',
  },
  'health-score': {
    title: 'Personal Health Performance Score',
    description: 'Health credit score with comprehensive breakdown and personalized recommendations.',
  },
  'care-circle': {
    title: 'Care-Circle System',
    description: 'Family health platform with multi-user tracking and shared health reports.',
  },
  'virtual-nurse': {
    title: 'Virtual Nurse Avatar',
    description: '3D/AR health guide for medicine reminders, exercise coaching, and mental wellness support.',
  },
  'find-doctors': {
    title: 'Live Doctor Map + Walk-in Queue',
    description: 'Real-time map of doctors with instant queue booking and walk-in tokens.',
  },
  'hospital-lobby': {
    title: 'Digital Hospital Lobby',
    description: 'Hospital from home - Pre-check health, fill forms, and get queue tokens before your visit.',
  },
  'security': {
    title: 'Zero-Knowledge Medical Locker',
    description: 'Future-proof privacy with end-to-end encryption and user-controlled keys.',
  },
  'offline-kit': {
    title: 'Offline-First Micro-Health Kit',
    description: 'Rural health solution with offline functionality and auto-sync capabilities.',
  },
  'gamification': {
    title: 'Gamified Health Universe',
    description: 'Earn health coins for healthy activities and redeem for rewards.',
  },
  'bill-decoder': {
    title: 'AI Insurance & Bill Decoder',
    description: 'Transparent healthcare costs with bill analysis and insurance claim assistance.',
  },
}

interface FeaturePageProps {
  params: Promise<{ slug: string }>
}

export default function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = use(params)
  const feature = featureRoutes[slug]

  if (!feature) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Feature Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The feature you're looking for doesn't exist yet.
          </p>
          <Button asChild>
            <Link href="/landing">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Landing
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
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

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-4xl">
        {feature.comingSoon && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ This feature is coming soon. Stay tuned!
            </p>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {feature.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {feature.description}
        </p>

        {/* Feature Details */}
        <div className="space-y-6 mb-12">
          <div className="glass-card p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              About This Feature
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Key Benefits
            </h2>
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-health flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Feature benefit {i} - Detailed description of how this helps you.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" variant="gradient">
            <Link href="/auth/register">
              Try This Feature Free
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/landing">
              Explore More Features
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

