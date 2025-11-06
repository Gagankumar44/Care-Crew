'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { ArrowLeft, Send, User, Paperclip } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NewMessagePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    message: '',
  })
  const [isSending, setIsSending] = useState(false)

  const recipients = [
    { id: '1', name: 'Dr. Sarah Johnson', type: 'Cardiologist' },
    { id: '2', name: 'Dr. Michael Chen', type: 'Dermatologist' },
    { id: '3', name: 'MediAR Support', type: 'Support Team' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      router.push('/messages')
    }, 1500)
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">New Message</h1>
          <p className="text-neutral-600">Send a message to your healthcare team</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-glass p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              To
            </label>
            <div className="space-y-2">
              {recipients.map((recipient) => (
                <button
                  key={recipient.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, recipient: recipient.id })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.recipient === recipient.id
                      ? 'border-primary bg-primary/10'
                      : 'border-neutral-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{recipient.name}</div>
                      <div className="text-sm text-neutral-500">{recipient.type}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="What is this message about?"
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={8}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your message here..."
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <button
              type="button"
              className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
            >
              <Paperclip size={20} />
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending || !formData.recipient || !formData.subject || !formData.message}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} />
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </PageLayout>
  )
}

