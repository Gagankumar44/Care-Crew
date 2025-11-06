'use client'

import Link from 'next/link'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HealthScorePage() {
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
          Personal Health Performance Score
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Your health credit score with comprehensive breakdown and personalized recommendations.
        </p>

        <div className="glass-card p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <TrendingUp className="w-12 h-12 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Health Score
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Score breakdown by category
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Activity', 'Sleep', 'Stress', 'Labs', 'Lifestyle', 'Preventive'].map((category) => (
              <div key={category} className="p-4 glass rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{category}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">--</div>
              </div>
            ))}
          </div>
        </div>

        <Button asChild size="lg" variant="gradient">
          <Link href="/auth/register">
            View Your Score
          </Link>
        </Button>
      </div>
    </div>
  )
}

