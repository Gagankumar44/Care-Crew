'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DoctorAICopilotPage() {
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
          Doctor AI Co-Pilot
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Time-saving medical assistant for healthcare professionals.
        </p>

        <div className="glass-card p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Features for Healthcare Professionals
          </h2>
          <ul className="space-y-4 text-gray-600 dark:text-gray-300">
            <li>• Auto note-taking from patient audio</li>
            <li>• Convert visits to structured SOAP notes</li>
            <li>• Smart prescription suggestions</li>
            <li>• Risk alerts based on symptom history</li>
          </ul>
        </div>

        <div className="mt-8">
          <Button asChild size="lg" variant="gradient">
            <Link href="/auth/register?role=doctor">
              Sign Up for Doctors
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

