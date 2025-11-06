'use client'

import { PageLayout } from '@/components/PageLayout'
import { User, Mail, Phone, Calendar, MapPin, Shield, Edit } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const user = {
    name: 'Jane Doe',
    id: 'P01234567',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: 'January 15, 1990',
    address: '123 Main Street, City, State 12345',
    emergencyContact: {
      name: 'John Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4568',
    },
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-neutral-600">View and manage your profile information</p>
          </div>
          <Link
            href="/settings?tab=profile"
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Edit size={16} />
            Edit Profile
          </Link>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-glass p-6"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-neutral-500">Patient ID: {user.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-neutral-400 mt-1" />
              <div>
                <div className="text-sm text-neutral-500">Email</div>
                <div className="font-medium text-gray-900">{user.email}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-neutral-400 mt-1" />
              <div>
                <div className="text-sm text-neutral-500">Phone</div>
                <div className="font-medium text-gray-900">{user.phone}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-neutral-400 mt-1" />
              <div>
                <div className="text-sm text-neutral-500">Date of Birth</div>
                <div className="font-medium text-gray-900">{user.dateOfBirth}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-neutral-400 mt-1" />
              <div>
                <div className="text-sm text-neutral-500">Address</div>
                <div className="font-medium text-gray-900">{user.address}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-glass p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-gray-900">Emergency Contact</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-neutral-500">Name</div>
              <div className="font-medium text-gray-900">{user.emergencyContact.name}</div>
            </div>
            <div>
              <div className="text-sm text-neutral-500">Relationship</div>
              <div className="font-medium text-gray-900">{user.emergencyContact.relationship}</div>
            </div>
            <div>
              <div className="text-sm text-neutral-500">Phone</div>
              <div className="font-medium text-gray-900">{user.emergencyContact.phone}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}

