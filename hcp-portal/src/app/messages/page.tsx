'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Plus, MessageSquare, Send, Search, Clock, User, Paperclip } from 'lucide-react'
import { mockMessages } from '@/data/mockData'
import Link from 'next/link'

type TabType = 'inbox' | 'sent' | 'archived'

type MessageListItem = {
  id: string
  from?: string
  to?: string
  preview: string
  time: string
  unread: boolean
}

const mockSentMessages: MessageListItem[] = [
  { id: 's1', to: 'Dr. Sarah Johnson', preview: 'I have a question about my test results', time: '1d ago', unread: false },
  { id: 's2', to: 'MediAR Support', preview: 'How do I reset my password?', time: '2d ago', unread: false },
]

const mockArchivedMessages: MessageListItem[] = [
  { id: 'a1', from: 'Dr. Michael Chen', preview: 'Follow-up appointment reminder', time: '1w ago', unread: false },
]

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Verify mockMessages is available
      if (!mockMessages) {
        setError('Messages data not available')
        console.error('mockMessages is undefined')
      }
    } catch (err) {
      setError('Failed to load messages')
      console.error('Error loading messages:', err)
    }
  }, [])

  const tabs = [
    { id: 'inbox' as TabType, label: 'Inbox', count: (mockMessages || []).filter(m => m?.unread).length },
    { id: 'sent' as TabType, label: 'Sent', count: mockSentMessages.length },
    { id: 'archived' as TabType, label: 'Archived', count: mockArchivedMessages.length },
  ]

  const getMessages = (): MessageListItem[] => {
    try {
      if (!mockMessages) return []
      
      switch (activeTab) {
        case 'inbox':
          return mockMessages.filter(m => 
            searchQuery === '' || (m?.from || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
            (m?.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
          ).map(m => ({ ...m, from: m.from }))
        case 'sent':
          return mockSentMessages.filter(m => 
            searchQuery === '' || (m.to || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
            (m.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
        case 'archived':
          return mockArchivedMessages.filter(m => 
            searchQuery === '' || (m.from || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
            (m.preview || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
        default:
          return (mockMessages || []).map(m => ({ ...m, from: m.from }))
      }
    } catch (err) {
      console.error('Error in getMessages:', err)
      return []
    }
  }

  const messages = getMessages()
  const selectedMessageData = messages.find(m => m.id === selectedMessage)

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="glass-card bg-white/80 dark:bg-neutral-800/80 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)] w-full p-6">
        {/* Messages List */}
        <div className="lg:w-1/3 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">Messages</h1>
              <p className="text-gray-600 dark:text-gray-300">Communicate with your healthcare team</p>
            </div>
            <Link
              href="/messages/new"
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus size={20} />
            </Link>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 dark:border-neutral-700 mb-4">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent hover:text-primary text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message.id)}
                className={`glass-card p-4 cursor-pointer hover:shadow-glass-lg transition-all ${
                  selectedMessage === message.id ? 'ring-2 ring-primary' : ''
                } ${message.unread ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate text-gray-900 dark:text-white">
                        {activeTab === 'sent' ? message.to || '' : message.from || ''}
                      </p>
                      <span className="text-xs flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {message.time}
                      </span>
                    </div>
                    <p className="text-sm truncate text-gray-600 dark:text-gray-300">{message.preview}</p>
                    {message.unread && (
                      <span className="inline-block mt-2 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:w-2/3 flex flex-col glass-card p-6">
          {selectedMessageData ? (
            <>
              <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {activeTab === 'sent' ? selectedMessageData.to || '' : selectedMessageData.from || ''}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMessageData.time}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
                    Archive
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="leading-relaxed text-gray-700 dark:text-gray-200">
                    {selectedMessageData.preview}
                  </p>
                  <p className="leading-relaxed mt-4 text-gray-700 dark:text-gray-200">
                    This is a detailed message content. In a real application, this would contain the full message text from your healthcare provider.
                  </p>
                </div>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-6">
                <div className="flex gap-4">
                  <textarea
                    rows={3}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Type your reply..."
                  />
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
                      <Send size={16} />
                    </button>
                    <button className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      <Paperclip size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-500 dark:text-gray-400">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

