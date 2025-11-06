'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Upload, Pin, History, X, Paperclip, Sparkles, AlertCircle, Phone, MapPin } from 'lucide-react'
import { PageLayout } from '@/components/PageLayout'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isPinned?: boolean
  isEmergency?: boolean
}

const QUICK_PROMPTS = [
  { id: 'symptoms', label: 'Check Symptoms', icon: '🤒', prompt: 'I\'m experiencing symptoms, can you help me understand what might be wrong?' },
  { id: 'diet', label: 'Diet Advice', icon: '🥗', prompt: 'What dietary recommendations do you have for my condition?' },
  { id: 'mental', label: 'Mental Health', icon: '🧠', prompt: 'I\'ve been feeling stressed lately, what can I do?' },
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Assistant. I can help you with symptom assessment, health advice, and medical information. How can I assist you today?',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; messages: Message[] }[]>([])
  const [pinnedChats, setPinnedChats] = useState<string[]>([])
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Check for emergency keywords
    const emergencyKeywords = ['emergency', 'chest pain', 'can\'t breathe', 'severe', 'dying', '911']
    const hasEmergency = emergencyKeywords.some(keyword => input.toLowerCase().includes(keyword))

    if (hasEmergency) {
      setTimeout(() => {
        setIsLoading(false)
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I understand you\'re experiencing a potential emergency. Please call 911 immediately. I\'ve prepared emergency resources for you.',
          timestamp: new Date(),
          isEmergency: true,
        }])
        setShowEmergencyModal(true)
      }, 1000)
      return
    }

    // Simulate AI response
    setTimeout(() => {
      setIsLoading(false)
      const responses = [
        'Based on your symptoms, I recommend monitoring your condition and consulting with a healthcare professional if symptoms persist. Would you like me to help you schedule an appointment?',
        'Thank you for sharing. While I can provide general health information, it\'s important to consult with a licensed healthcare provider for personalized medical advice. I can help you connect with a doctor.',
        'I understand your concern. For accurate assessment, I\'d recommend a consultation with a healthcare provider. In the meantime, here are some general tips: [health advice based on the query].',
      ]
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }])
    }, 1500)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const handlePin = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    ))
    setPinnedChats(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true)
      // In a real app, this would start speech recognition
      setTimeout(() => {
        setIsRecording(false)
        setInput('This is a voice input demo. In production, this would transcribe your speech.')
      }, 2000)
    } else {
      setIsRecording(false)
    }
  }

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/pdf,image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'user',
          content: `Uploaded report: ${file.name}`,
          timestamp: new Date(),
        }])
        setIsLoading(true)
        setTimeout(() => {
          setIsLoading(false)
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'I\'ve received your report. Let me analyze it... [Report analysis would appear here in production]',
            timestamp: new Date(),
          }])
        }, 2000)
      }
    }
    input.click()
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-180px)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Health Assistant
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Get instant medical guidance from our AI-powered assistant
          </p>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Sidebar - Quick Prompts & History */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass-card p-6 h-full overflow-y-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Prompts</h3>
              <div className="space-y-2 mb-6">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <span className="text-2xl mr-2">{prompt.icon}</span>
                    <span className="text-sm text-gray-900 dark:text-white">{prompt.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Chat History</h3>
                <div className="space-y-2">
                  {chatHistory.length === 0 ? (
                    <p className="text-sm text-neutral-500">No chat history yet</p>
                  ) : (
                    chatHistory.map((chat) => (
                      <button
                        key={chat.id}
                        className="w-full text-left p-2 rounded-lg hover:bg-white/50 dark:hover:bg-neutral-800/50 text-sm"
                      >
                        {chat.title}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {pinnedChats.length > 0 && (
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Pin className="w-4 h-4" />
                    Pinned
                  </h3>
                  <div className="space-y-2">
                    {messages
                      .filter(msg => msg.isPinned)
                      .map((msg) => (
                        <div key={msg.id} className="p-2 rounded-lg bg-primary/10 text-sm">
                          {msg.content.substring(0, 50)}...
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col glass-card min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-3xl p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-primary text-white'
                          : message.isEmergency
                          ? 'bg-red-500/10 border-2 border-red-500/30 text-gray-900 dark:text-white'
                          : 'glass border border-white/20 dark:border-white/10 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.isEmergency && (
                        <div className="flex items-center gap-2 mb-2 text-red-500">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-semibold">Emergency Response</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        <button
                          onClick={() => handlePin(message.id)}
                          className={`ml-2 p-1 rounded hover:bg-white/20 transition-colors ${
                            message.isPinned ? 'text-yellow-400' : 'opacity-50'
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="glass rounded-3xl p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 dark:border-white/5 p-4">
              <div className="flex items-end gap-2">
                <button
                  onClick={handleFileUpload}
                  className="p-2 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
                  aria-label="Upload report"
                >
                  <Upload className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Type your health question or describe your symptoms..."
                  className="flex-1 min-h-[60px] max-h-[120px] px-4 py-3 glass border border-white/20 dark:border-white/10 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-neutral-500"
                  rows={1}
                />
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'hover:bg-white/50 dark:hover:bg-neutral-800/50'
                  }`}
                  aria-label="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-xs text-neutral-500 flex items-center gap-2">
                <Upload className="w-3 h-3" />
                <span>Upload report to analyze</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmergencyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Emergency Response
                </h2>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="p-2 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-900 dark:text-white mb-6">
                If you're experiencing a medical emergency, please:
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = 'tel:911'}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call 911
                </button>
                <button
                  onClick={() => {
                    // In production, this would send location
                    alert('Location sharing would be enabled here')
                  }}
                  className="w-full flex items-center justify-center gap-2 glass border border-white/20 dark:border-white/10 py-3 rounded-xl font-semibold text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Send My Location
                </button>
              </div>
              <p className="text-sm text-neutral-500 mt-4 text-center">
                Your safety is our priority. Please seek immediate medical attention.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

