'use client'

import React, { useState } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { EmergencyButton } from '@/components/EmergencyButton'
import { AlertCircle, Car, Phone, MapPin, Clock, Users, QrCode, Building2, Sparkles, Plus, X } from 'lucide-react'
import { mockEmergencyContacts } from '@/data/mockData'
import type { EmergencyContact } from '@/data/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EmergencyPage() {
  const [showIceModal, setShowIceModal] = useState(false)
  const [showSosModal, setShowSosModal] = useState(false)
  const [contacts] = useState<EmergencyContact[]>(mockEmergencyContacts)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(contacts)

  const handleGenerateQR = () => {
    setShowSosModal(true)
    // In production, generate QR code with medical info
  }

  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: 'New Contact',
      relationship: 'Friend',
      phone: '+1-234-567-8900',
      isPrimary: false,
    }
    setEmergencyContacts([...emergencyContacts, newContact])
  }

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTriggeringEmergency, setIsTriggeringEmergency] = useState(false);

  const handleFindNearestER = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        // In production, show nearby ERs on a map
        alert(`Finding nearest emergency rooms to your location...\n\nIn production, this would show nearby ERs on a map.`)
      })
    } else {
      alert('Location services not available')
    }
  }

  const handleTriggerEmergency = async () => {
    setIsTriggeringEmergency(true);
    
    try {
      if (!navigator.geolocation) {
        alert('Location services not available');
        setIsTriggeringEmergency(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Location obtained', // In production, reverse geocode
          };

          try {
            const response = await fetch('/api/emergency', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                location: locationData,
                contact_person: emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0] || {},
              }),
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
              alert('✅ Emergency alert sent! Emergency services have been notified.\n\nYour location and emergency contacts have been shared.');
            } else {
              alert(`⚠️ Failed to send emergency alert: ${data.error || 'Unknown error'}\n\nPlease call emergency services directly:\n• National Emergency: 112\n• Ambulance: 102`);
            }
          } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            alert('⚠️ Network error. Please call emergency services directly:\n• National Emergency: 112\n• Ambulance: 102');
          } finally {
            setIsTriggeringEmergency(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert(`⚠️ Could not get your location: ${error.message}\n\nPlease call emergency services directly:\n• National Emergency: 112\n• Ambulance: 102`);
          setIsTriggeringEmergency(false);
        }
      );
    } catch (error) {
      console.error('Emergency trigger error:', error);
      alert('Failed to send emergency alert. Please call emergency services directly.');
      setIsTriggeringEmergency(false);
    }
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Emergency Services
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Quick access to emergency services, ICE contacts, and SOS medical card
          </p>
        </div>

        {/* Emergency Alert Trigger - Prominent */}
        <div className="glass-card p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2 flex items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Emergency Alert System
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Trigger an emergency alert to notify emergency services and your contacts
            </p>
          </div>
          <Button
            onClick={handleTriggerEmergency}
            disabled={isTriggeringEmergency}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isTriggeringEmergency ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                Triggering Emergency Alert...
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 mr-2" />
                Trigger Emergency Alert
              </>
            )}
          </Button>
          <p className="text-xs text-red-600 dark:text-red-400 mt-3 text-center">
            ⚠️ This will share your location and notify emergency contacts
          </p>
        </div>

        {/* Emergency Numbers */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Emergency Contact Numbers
          </h2>
          <EmergencyButton variant="inline" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-6 hover:shadow-glass-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Request Ambulance</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">24/7 Available</p>
              </div>
            </div>
            <a
              href="tel:102"
              className="block w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-center font-medium transition-colors"
            >
              Call 102
            </a>
          </div>

          <div className="glass-card p-6 hover:shadow-glass-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">National Emergency</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Unified Emergency Number</p>
              </div>
            </div>
            <a
              href="tel:112"
              className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
            >
              Call 112
            </a>
          </div>
        </div>

        {/* Enhanced Emergency Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ICE Contacts */}
          <div className="glass-card p-6 hover:shadow-glass-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">ICE Contacts</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">In Case of Emergency</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-neutral-800/50"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {contact.name}
                      {contact.isPrimary && (
                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {contact.relationship} • {contact.phone}
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                  </a>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setShowIceModal(true)}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Manage ICE Contacts
            </Button>
          </div>

          {/* SOS Medical Card */}
          <div className="glass-card p-6 hover:shadow-glass-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">SOS Medical Card</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">QR Code with Medical Info</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Generate a QR code card with your critical medical information for emergency situations
            </p>
            <Button
              onClick={handleGenerateQR}
              className="w-full"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate Medical Card
            </Button>
          </div>

          {/* Nearest Emergency Room */}
          <div className="glass-card p-6 hover:shadow-glass-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Nearest ER</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Find Emergency Rooms</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Get real-time alerts for nearest emergency rooms with triage status
            </p>
            <Button
              onClick={handleFindNearestER}
              variant="outline"
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Find Nearest ER
            </Button>
          </div>

          {/* AI Triage */}
          <div className="glass-card p-6 hover:shadow-glass-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Triage</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Smart Care Routing</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Get AI-powered triage assessment and hospital referral recommendations
            </p>
            <Link href="/triage">
              <Button
                variant="outline"
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start AI Triage
              </Button>
            </Link>
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Find Nearby Hospitals
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Browse hospitals with 24/7 emergency services in your area
          </p>
          <Link
            href="/hospitals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            View Hospital Directory
            <MapPin className="w-4 h-4" />
          </Link>
        </div>

        {/* Important Information */}
        <div className="glass-card p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>In case of a medical emergency, call immediately. Do not delay.</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Be ready to provide your location to emergency services.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>For life-threatening emergencies, go directly to the nearest hospital emergency department.</span>
            </li>
          </ul>
        </div>

        {/* ICE Contacts Modal */}
        <AnimatePresence>
          {showIceModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowIceModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    ICE Contacts
                  </h2>
                  <button
                    onClick={() => setShowIceModal(false)}
                    className="p-2 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-neutral-800/50"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {contact.relationship} • {contact.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleAddContact} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOS Medical Card Modal */}
        <AnimatePresence>
          {showSosModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowSosModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    SOS Medical Card
                  </h2>
                  <button
                    onClick={() => setShowSosModal(false)}
                    className="p-2 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center space-y-4">
                  <div className="p-8 bg-white rounded-lg border-2 border-primary">
                    <QrCode className="w-32 h-32 mx-auto text-neutral-400" />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Scan this QR code to access your medical information in case of emergency
                  </p>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      Download Card
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Share
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}
