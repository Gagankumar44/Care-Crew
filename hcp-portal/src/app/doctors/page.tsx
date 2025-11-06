'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { Stethoscope, Calendar, Clock, MapPin, Video, Phone, Star, Search, Filter, Award, Languages } from 'lucide-react'
import { mockDoctors, Doctor } from '@/data/mockData'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RatingDisplay } from '@/components/reusable/RatingDisplay'

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all')
  const [selectedHospital, setSelectedHospital] = useState<string>('all')

  const specialties = Array.from(new Set(mockDoctors.map(d => d.specialty)))
  const hospitals = Array.from(new Set(mockDoctors.map(d => d.hospitalName)))

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty
    const matchesHospital = selectedHospital === 'all' || doctor.hospitalName === selectedHospital
    
    return matchesSearch && matchesSpecialty && matchesHospital
  })

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Doctors
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Browse and book appointments with healthcare providers
            </p>
          </div>
          <Link
            href="/appointments/new"
            className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Book Appointment
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-neutral-500" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Hospitals</option>
                {hospitals.map(hospital => (
                  <option key={hospital} value={hospital}>{hospital}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Stethoscope className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No doctors found</p>
            <p className="text-neutral-400 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 hover:shadow-glass-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/doctors/${doctor.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors">
              {doctor.name}
            </h3>
          </Link>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {doctor.specialty}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {doctor.hospitalName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RatingDisplay rating={doctor.rating} reviewCount={doctor.reviewCount} size="sm" />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-600 dark:text-neutral-400">
            {doctor.experience} years experience
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-600 dark:text-neutral-400">
            {doctor.availability}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {doctor.type === 'virtual' ? (
            <Video className="w-4 h-4 text-blue-500" />
          ) : doctor.type === 'in-person' ? (
            <MapPin className="w-4 h-4 text-green-500" />
          ) : (
            <>
              <Video className="w-4 h-4 text-blue-500" />
              <MapPin className="w-4 h-4 text-green-500" />
            </>
          )}
          <span className="text-neutral-600 dark:text-neutral-400">
            {doctor.type === 'both' ? 'Virtual & In-Person' : doctor.type === 'virtual' ? 'Virtual' : 'In-Person'}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Consultation: </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{doctor.consultationFee.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link
          href={`/doctors/${doctor.id}`}
          className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-center text-sm"
        >
          View Profile
        </Link>
        <Link
          href={`/appointments/new?doctor=${doctor.id}`}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-center text-sm"
        >
          Book Now
        </Link>
      </div>
    </motion.div>
  )
}
