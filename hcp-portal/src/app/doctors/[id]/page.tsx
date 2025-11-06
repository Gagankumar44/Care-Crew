'use client'

import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Star, Calendar, Clock, MapPin, Video, Phone, Award, Languages, Briefcase, ArrowLeft } from 'lucide-react'
import { mockDoctors, mockHospitals } from '@/data/mockData'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RatingDisplay } from '@/components/reusable/RatingDisplay'

export default function DoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const doctorId = params.id as string
  
  const doctor = mockDoctors.find(d => d.id === doctorId)
  const hospital = doctor ? mockHospitals.find(h => h.id === doctor.hospitalId) : null

  if (!doctor) {
    return (
      <PageLayout>
        <div className="glass-card p-12 text-center">
          <p className="text-neutral-500 text-lg">Doctor not found</p>
          <button
            onClick={() => router.push('/doctors')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Doctors
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary-600 mb-4 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {doctor.name}
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-4">
                {doctor.specialty}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <RatingDisplay rating={doctor.rating} reviewCount={doctor.reviewCount} size="lg" />
                <div className="text-neutral-600 dark:text-neutral-400">
                  {doctor.experience} years experience
                </div>
              </div>
              {hospital && (
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <MapPin className="w-4 h-4" />
                  <Link href={`/hospitals/${hospital.id}`} className="hover:text-primary">
                    {hospital.name}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={`/appointments/new?doctor=${doctor.id}`}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-center font-medium"
              >
                Book Appointment
              </Link>
              <div className="text-center">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Consultation Fee</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  ₹{doctor.consultationFee.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Availability</div>
                <div className="font-semibold text-gray-900 dark:text-white">{doctor.availability}</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Next Slot</div>
                <div className="font-semibold text-gray-900 dark:text-white">{doctor.nextSlot}</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              {doctor.type === 'both' ? (
                <>
                  <Video className="w-5 h-5 text-blue-500" />
                  <MapPin className="w-5 h-5 text-green-500" />
                </>
              ) : doctor.type === 'virtual' ? (
                <Video className="w-5 h-5 text-blue-500" />
              ) : (
                <MapPin className="w-5 h-5 text-green-500" />
              )}
              <div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Consultation Type</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {doctor.type === 'both' ? 'Virtual & In-Person' : doctor.type === 'virtual' ? 'Virtual' : 'In-Person'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        {doctor.bio && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
            <p className="text-neutral-600 dark:text-neutral-400">{doctor.bio}</p>
          </div>
        )}

        {/* Qualifications */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Qualifications
          </h2>
          <div className="flex flex-wrap gap-2">
            {doctor.qualifications.map((qual) => (
              <span
                key={qual}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {qual}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Languages Spoken
          </h2>
          <div className="flex flex-wrap gap-2">
            {doctor.languages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews Section - Enhanced */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Patient Reviews & Ratings
            </h2>
            <RatingDisplay rating={doctor.rating} reviewCount={doctor.reviewCount} size="md" />
          </div>
          
          {/* Rating Breakdown */}
          <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage = star === 5 ? 85 : star === 4 ? 12 : star === 3 ? 2 : star === 2 ? 1 : 0
                return (
                  <div key={star} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{star}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden mb-1">
                      <div 
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-neutral-500">{percentage}%</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="space-y-4">
            {[
              { name: 'Rajesh K.', rating: 5, date: '2 weeks ago', comment: 'Excellent doctor! Very knowledgeable and patient. Explained everything clearly.' },
              { name: 'Priya S.', rating: 5, date: '1 month ago', comment: 'Highly recommend! Dr. was thorough and made me feel comfortable throughout the consultation.' },
              { name: 'Amit M.', rating: 4, date: '2 months ago', comment: 'Good experience overall. Professional and timely service.' },
            ].map((review, idx) => (
              <div key={idx} className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{review.name}</div>
                    <div className="text-xs text-neutral-500">{review.date}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{review.comment}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-center">
            <button className="text-sm text-primary hover:text-primary-600">
              View all {doctor.reviewCount} reviews →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

