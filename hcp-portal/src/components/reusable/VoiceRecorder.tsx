'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Loader } from 'lucide-react'
import { motion } from 'framer-motion'

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
  onError?: (error: string) => void
}

export function VoiceRecorder({ onTranscript, onError }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        
        // Convert to base64 for API call (simplified - in production, use proper audio transcription API)
        setIsProcessing(true)
        
        // Simulate transcription (in production, use Web Speech API or cloud service)
        setTimeout(() => {
          const simulatedTranscript = "I've been experiencing headaches and fatigue for the past few days."
          onTranscript(simulatedTranscript)
          setIsProcessing(false)
        }, 1500)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      onError?.('Microphone access denied. Please allow microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {!isRecording && !isProcessing ? (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          aria-label="Start voice recording"
        >
          <Mic className="w-5 h-5" />
          <span>Record Voice</span>
        </button>
      ) : isRecording ? (
        <motion.button
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          onClick={stopRecording}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          aria-label="Stop recording"
        >
          <Square className="w-5 h-5" />
          <span>Stop Recording</span>
          <motion.div
            className="ml-2 w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.button>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-200 rounded-lg">
          <Loader className="w-5 h-5 animate-spin text-primary" />
          <span className="text-neutral-600">Processing...</span>
        </div>
      )}
    </div>
  )
}

