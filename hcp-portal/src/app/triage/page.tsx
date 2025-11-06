'use client'

import { useState, useEffect, Suspense } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Brain, MessageSquare, AlertCircle, CheckCircle, Loader, ArrowRight, Mic, Volume2, Building2, Stethoscope, Sparkles, Star, Calendar, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { VoiceRecorder } from '@/components/reusable/VoiceRecorder'
import { PainScaleSlider } from '@/components/reusable/PainScaleSlider'
import { SymptomTimeline } from '@/components/reusable/SymptomTimeline'
import { mockHospitals, mockDoctors } from '@/data/mockData'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const symptoms = [
  'Fever', 'Cough', 'Headache', 'Nausea', 'Chest Pain', 'Shortness of Breath',
  'Dizziness', 'Fatigue', 'Sore Throat', 'Body Aches', 'Rash', 'Joint Pain'
]

const severityLevels = [
  { level: 'Mild', description: 'Barely noticeable, doesn\'t interfere with daily activities', color: 'green' },
  { level: 'Moderate', description: 'Noticeable, some interference with daily activities', color: 'yellow' },
  { level: 'Severe', description: 'Significant, major interference with daily activities', color: 'orange' },
  { level: 'Critical', description: 'Extreme, unable to perform daily activities', color: 'red' },
]

function TriageContent() {
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get('appointmentId')
  const specialty = searchParams.get('specialty')
  const provider = searchParams.get('provider')
  const reason = searchParams.get('reason')
  
  const [step, setStep] = useState(1)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [symptomSeverity, setSymptomSeverity] = useState<Record<string, string>>({})
  const [painLevel, setPainLevel] = useState(0)
  const [voiceInput, setVoiceInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  // Pre-fill symptoms from appointment reason
  useEffect(() => {
    if (reason) {
      setVoiceInput(reason)
      // Auto-detect symptoms from reason text
      const reasonLower = reason.toLowerCase()
      const detectedSymptoms = symptoms.filter(s => 
        reasonLower.includes(s.toLowerCase())
      )
      if (detectedSymptoms.length > 0) {
        setSelectedSymptoms(detectedSymptoms)
      }
    }
  }, [reason])

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
      const { [symptom]: _, ...rest } = symptomSeverity
      setSymptomSeverity(rest)
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    
    try {
      const symptomsText = selectedSymptoms.join(', ');
      const severity = Object.values(symptomSeverity)[0] || 'moderate';
      
      const response = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptomsText,
          severity: severity.toLowerCase(),
          age: 30, // TODO: Get from user profile
          gender: 'not specified', // TODO: Get from user profile
          medical_history: '',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult({
          recommendation: data.data.urgency === 'critical' 
            ? 'Emergency Care Required' 
            : data.data.urgency === 'high' 
            ? 'Urgent Care Recommended'
            : 'Routine Care Recommended',
          urgency: data.data.urgency.charAt(0).toUpperCase() + data.data.urgency.slice(1),
          description: data.data.message,
          specialty: data.data.suggested_specialties?.[0] || 'General Medicine',
          nextSteps: data.data.next_action || [],
        });
      } else {
        throw new Error('Failed to get triage result');
      }
    } catch (error) {
      console.error('Triage error:', error);
      // Fallback to basic recommendation
      const detectedSpecialty = detectSpecialtyFromSymptoms(selectedSymptoms);
      setResult({
        recommendation: 'Consultation Recommended',
        urgency: 'Moderate',
        description: 'Based on your symptoms, we recommend scheduling a consultation with a healthcare provider.',
        specialty: detectedSpecialty,
        nextSteps: [
          'Schedule an appointment',
          'Monitor symptoms closely',
        ],
      });
    } finally {
      setIsProcessing(false);
      setStep(3);
    }
  }
  
  // Helper function to detect specialty from symptoms
  const detectSpecialtyFromSymptoms = (symptoms: string[]): string => {
    const symptomMap: Record<string, string> = {
      'Chest Pain': 'Cardiology',
      'Shortness of Breath': 'Cardiology',
      'Headache': 'Neurology',
      'Dizziness': 'Neurology',
      'Joint Pain': 'Orthopedics',
      'Rash': 'Dermatology',
      'Sore Throat': 'ENT',
      'Fever': 'General Medicine',
      'Cough': 'Pulmonology',
    }
    
    for (const symptom of symptoms) {
      if (symptomMap[symptom]) {
        return symptomMap[symptom]
      }
    }
    return 'General Medicine'
  }
  
  // Get recommended hospitals based on triage result
  const getRecommendedHospitals = () => {
    if (!result?.specialty) return []
    return mockHospitals
      .filter(h => h.specialties.some(s => 
        s.toLowerCase().includes(result.specialty.toLowerCase())
      ))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
  }
  
  // Get recommended doctors based on triage result
  const getRecommendedDoctors = () => {
    if (!result?.specialty) return []
    return mockDoctors
      .filter(d => d.specialty.toLowerCase().includes(result.specialty.toLowerCase()))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Health Triage</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Get instant health guidance based on your symptoms</p>
        </div>

        {/* Appointment Context */}
        {(appointmentId || provider || specialty) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Appointment Context</h3>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  {provider && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span><strong>Provider:</strong> {provider}</span>
                    </div>
                  )}
                  {specialty && (
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      <span><strong>Specialty:</strong> {specialty}</span>
                    </div>
                  )}
                  {reason && (
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                      <span><strong>Reason for Visit:</strong> {reason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-primary text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
              }`}>
                {step > s ? <CheckCircle size={20} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 ${step > s ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Symptoms */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-glass p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Your Symptoms</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">Choose all symptoms that apply to you, or use voice input</p>
            
            {/* Voice Input Section */}
            <div className="mb-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30">
              <div className="flex items-center gap-2 mb-3">
                <Mic className="w-5 h-5 text-primary" />
                <h3 className="font-medium text-gray-900 dark:text-white">Voice Input</h3>
              </div>
              <VoiceRecorder 
                onTranscript={(text) => {
                  setVoiceInput(text)
                  // Auto-detect symptoms from voice input
                  const detectedSymptoms = symptoms.filter(s => 
                    text.toLowerCase().includes(s.toLowerCase())
                  )
                  detectedSymptoms.forEach(s => {
                    if (!selectedSymptoms.includes(s)) {
                      setSelectedSymptoms([...selectedSymptoms, s])
                    }
                  })
                }}
                onError={(error) => console.error(error)}
              />
              {voiceInput && (
                <p className="mt-3 text-sm text-gray-600 dark:text-neutral-300 italic">"{voiceInput}"</p>
              )}
            </div>

            {/* Manual Symptom Selection */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {symptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSymptoms.includes(symptom)
                      ? 'border-primary bg-primary/10 text-primary dark:text-primary-300'
                      : 'border-neutral-200 dark:border-neutral-600 hover:border-primary/50 dark:hover:border-primary/50 text-gray-900 dark:text-white bg-transparent'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>

            {/* Pain Scale */}
            <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
              <PainScaleSlider 
                value={painLevel}
                onChange={setPainLevel}
                label="Overall Pain Level"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={selectedSymptoms.length === 0 && painLevel === 0}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Rate Severity */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-glass p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rate Symptom Severity</h2>
            <div className="space-y-4">
              {selectedSymptoms.map((symptom) => (
                <div key={symptom} className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">{symptom}</h3>
                  <div className="mb-3">
                    <PainScaleSlider 
                      value={Number(symptomSeverity[symptom]?.replace(/\D/g, '')) || 0}
                      onChange={(value) => {
                        const levelMap = ['Mild', 'Mild', 'Mild', 'Moderate', 'Moderate', 'Moderate', 'Severe', 'Severe', 'Severe', 'Critical', 'Critical']
                        setSymptomSeverity({ ...symptomSeverity, [symptom]: levelMap[value] })
                      }}
                      label={`Pain level for ${symptom}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {severityLevels.map((level) => (
                      <button
                        key={level.level}
                        onClick={() => setSymptomSeverity({ ...symptomSeverity, [symptom]: level.level })}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          symptomSeverity[symptom] === level.level
                            ? level.color === 'green' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                              level.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                              level.color === 'orange' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' :
                              'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500 text-gray-900 dark:text-white bg-transparent'
                        }`}
                      >
                        <div className="font-medium">{level.level}</div>
                        <div className={`text-xs mt-1 ${symptomSeverity[symptom] === level.level ? 'opacity-80' : 'text-neutral-500 dark:text-neutral-400'}`}>{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-gray-900 dark:text-white"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={Object.keys(symptomSeverity).length !== selectedSymptoms.length}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
              >
                Analyze Symptoms
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-glass p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{result.recommendation}</h2>
              <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                {result.urgency} Priority
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                <p className="text-gray-700 dark:text-neutral-300">{result.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Next Steps</h3>
                <ul className="space-y-2">
                  {result.nextSteps.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-neutral-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  href="/appointments/new"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex-1 text-center"
                >
                  Schedule Appointment
                </Link>
                <Link
                  href={`/triage-referral?specialty=${encodeURIComponent(result.specialty || '')}`}
                  className="px-6 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Find Hospitals
                </Link>
                <button
                  onClick={() => {
                    setStep(1)
                    setSelectedSymptoms([])
                    setSymptomSeverity({})
                    setPainLevel(0)
                    setVoiceInput('')
                    setResult(null)
                  }}
                  className="px-6 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-gray-900 dark:text-white"
                >
                  Start Over
                </button>
              </div>
            </div>
            
            {/* AI-Powered Recommendations */}
            {result.specialty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recommended for {result.specialty} Consultation
                  </h3>
                </div>
                
                {/* Recommended Hospitals */}
                {getRecommendedHospitals().length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Top Hospitals Near You:
                    </h4>
                    <div className="space-y-2">
                      {getRecommendedHospitals().map((hospital) => (
                        <Link
                          key={hospital.id}
                          href={`/hospitals/${hospital.id}`}
                          className="block p-3 bg-white/70 dark:bg-neutral-800/70 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-all border border-white/50 dark:border-neutral-700/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {hospital.name}
                              </div>
                              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                {hospital.city}, {hospital.state}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium">{hospital.rating}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Recommended Doctors */}
                {getRecommendedDoctors().length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Top {result.specialty} Doctors:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {getRecommendedDoctors().map((doctor) => (
                        <Link
                          key={doctor.id}
                          href={`/doctors/${doctor.id}`}
                          className="block p-3 bg-white/70 dark:bg-neutral-800/70 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-all border border-white/50 dark:border-neutral-700/50"
                        >
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {doctor.name}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                              {doctor.rating} • {doctor.hospitalName}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
                  <Link
                    href={`/triage-referral?specialty=${encodeURIComponent(result.specialty)}`}
                    className="text-sm text-primary hover:text-primary-600 flex items-center gap-2"
                  >
                    View all recommendations
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Symptom Timeline History */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-glass p-6"
          >
            <SymptomTimeline
              entries={[
                {
                  id: '1',
                  date: new Date(),
                  symptoms: selectedSymptoms.map(s => ({ name: s, severity: symptomSeverity[s] || 'Moderate' })),
                  painLevel: painLevel,
                  notes: voiceInput || undefined,
                },
              ]}
            />
          </motion.div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-glass p-12 text-center"
          >
            <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-700 dark:text-neutral-300">Analyzing your symptoms...</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">This may take a few moments</p>
          </motion.div>
        )}
      </div>
    </PageLayout>
  )
}

// Wrap in Suspense for useSearchParams
export default function TriagePage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">Loading symptom check...</p>
          </div>
        </div>
      </PageLayout>
    }>
      <TriageContent />
    </Suspense>
  )
}

