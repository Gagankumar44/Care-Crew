'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Star, MessageSquare, Send, User, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSafeAuth } from '@/hooks/useSafeAuth'
import { useSearchParams } from 'next/navigation'

export default function HospitalFeedbackPage() {
  const { userId } = useSafeAuth()
  const searchParams = useSearchParams()
  const hospitalId = searchParams.get('hospital') || ''
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedbacks, setFeedbacks] = useState<any[]>([])

  useEffect(() => {
    if (hospitalId) {
      fetchFeedbacks()
    }
  }, [hospitalId])

  const fetchFeedbacks = async () => {
    try {
      // In real app, fetch feedbacks from API
      // Mock data for now
      setFeedbacks([
        {
          id: '1',
          userName: 'John Doe',
          rating: 5,
          comments: 'Excellent service and care. Highly recommended!',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          userName: 'Jane Smith',
          rating: 4,
          comments: 'Good hospital with modern facilities.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ])
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !hospitalId) {
      alert('Please login to submit feedback')
      return
    }

    try {
      setSubmitting(true)
      // In real app, submit feedback to API
      // await submitFeedback({ hospitalId, userId, rating, comments })
      
      alert('Thank you for your feedback!')
      setRating(0)
      setComments('')
      fetchFeedbacks()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Star className="w-8 h-8 text-primary" />
            Hospital Feedback & Ratings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Share your experience and help others make informed decisions
          </p>
        </div>

        {/* Submit Feedback Form */}
        {userId && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Leave Your Feedback</h2>
            
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comments
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </section>
        )}

        {/* Existing Feedbacks */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Recent Feedback</h2>
          
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {feedback.userName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= feedback.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{feedback.comments}</p>
              </motion.div>
            ))}
          </div>

          {feedbacks.length === 0 && (
            <div className="glass-card p-12 text-center">
              <MessageSquare className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">No feedback yet</p>
              <p className="text-neutral-400 text-sm mt-2">Be the first to share your experience</p>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  )
}

