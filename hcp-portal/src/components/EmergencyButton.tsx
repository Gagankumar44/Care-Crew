'use client';

import { AlertCircle, Phone, Car, MapPin, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyButtonProps {
  variant?: 'default' | 'inline';
}

export function EmergencyButton({ variant = 'default' }: EmergencyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmergencyCall = (number: string) => {
    // Use window.location to initiate call without opening new tab
    // This works better than href on mobile devices
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${number}`;
    }
  };

  const handleAmbulanceCall = () => {
    // Ambulance service call
    handleEmergencyCall('102');
    setIsOpen(false);
  };

  const handleEmergencyCall112 = () => {
    // National emergency number
    handleEmergencyCall('112');
    setIsOpen(false);
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // In production, send location to emergency services
        alert(`Location shared: ${latitude}, ${longitude}\n\nIn production, this would send your location to emergency services.`);
      }, () => {
        alert('Unable to get your location. Please share manually.');
      });
    } else {
      alert('Location services not available');
    }
  };

  if (variant === 'inline') {
    return (
      <div className="space-y-3">
        <button
          onClick={() => handleEmergencyCall('112')}
          className="flex items-center justify-between p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors w-full"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <div>
              <div className="font-semibold">Emergency (112)</div>
              <div className="text-sm opacity-90">National Emergency Number</div>
            </div>
          </div>
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleEmergencyCall('102')}
          className="flex items-center justify-between p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors w-full"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <div>
              <div className="font-semibold">Ambulance (102)</div>
              <div className="text-sm opacity-90">Medical Emergency</div>
            </div>
          </div>
          <Phone className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, type: 'spring' }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 mb-2 glass-card p-5 min-w-[300px] shadow-glass-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Emergency Services
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Ambulance Call - Primary Action */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAmbulanceCall}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Car className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-lg">Call Ambulance</div>
                      <div className="text-sm opacity-90">102 - Medical Emergency</div>
                    </div>
                  </div>
                  <Phone className="w-5 h-5" />
                </motion.button>

                {/* National Emergency */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmergencyCall112}
                  className="w-full flex items-center justify-between p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-lg">Emergency (112)</div>
                      <div className="text-sm opacity-90">National Emergency</div>
                    </div>
                  </div>
                  <Phone className="w-5 h-5" />
                </motion.button>

                {/* Share Location */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLocationShare}
                  className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 text-gray-900 dark:text-white rounded-xl font-medium transition-colors border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span>Share My Location</span>
                  </div>
                </motion.button>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 text-center">
                For life-threatening emergencies, call immediately
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className="w-16 h-16 bg-gradient-to-br from-red-600 via-red-500 to-orange-600 text-white rounded-full shadow-glass-lg flex items-center justify-center hover:scale-110 transition-transform relative overflow-hidden group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Emergency SOS Button"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Pulse Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: '2s' }} />
          
          {isOpen ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <AlertCircle className="w-6 h-6 relative z-10" />
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
