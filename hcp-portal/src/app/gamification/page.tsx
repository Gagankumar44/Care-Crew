'use client'

import Link from 'next/link'
import { ArrowLeft, Trophy, Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GamificationPage() {
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
        <div className="flex items-center gap-4 mb-6">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Gamified Health Universe
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Earn health coins for healthy activities and redeem for rewards.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="glass-card p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              Earn Coins
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Steps & Activity</li>
              <li>• Health Scans</li>
              <li>• Checkups</li>
              <li>• Uploading Reports</li>
              <li>• Breathing Exercises</li>
            </ul>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Redeem Rewards
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Consultation Discounts</li>
              <li>• Lab Test Coupons</li>
              <li>• Pharmacy Cashback</li>
              <li>• Premium Features</li>
            </ul>
          </div>
        </div>

        <Button asChild size="lg" variant="gradient">
          <Link href="/auth/register">
            Start Earning Coins
          </Link>
        </Button>
      </div>
    </div>
  )
}

