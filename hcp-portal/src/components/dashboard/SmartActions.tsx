'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaStethoscope, FaCommentDots, FaMagic, FaUserMd } from 'react-icons/fa'
import { NotificationBadge } from './NotificationBadge'

// This is the animation for each card on hover
const cardHover = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 300 }
}

interface SmartActionsProps {
  unreadMessages?: number
  upcomingAppointments?: number
}

function SmartActions({ unreadMessages = 2, upcomingAppointments = 1 }: SmartActionsProps) {
  return (
    <div className="smart-actions-grid">
      {/* Card 1: AR Scan */}
      <Link href="/ar-scan" className="action-card-link" passHref>
        <motion.div 
          className="action-card" 
          whileHover={cardHover}
          whileTap={{ scale: 0.98 }}
        >
          <FaStethoscope className="action-icon" size={30} />
          <h3 className="action-title">AR Scan</h3>
          <p className="action-subtitle">Scan skin or measure ROM</p>
        </motion.div>
      </Link>

      {/* Card 2: Messages */}
      <Link href="/messages" className="action-card-link" passHref>
        <motion.div 
          className="action-card" 
          whileHover={cardHover}
          whileTap={{ scale: 0.98 }}
          style={{ position: 'relative' }}
        >
          <NotificationBadge count={unreadMessages} />
          <FaCommentDots className="action-icon" size={30} />
          <h3 className="action-title">Messages</h3>
          <p className="action-subtitle">
            {unreadMessages > 0 ? `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}` : 'No new messages'}
          </p>
        </motion.div>
      </Link>

      {/* Card 3: AI Assistant */}
      <Link href="/assistant" className="action-card-link" passHref>
        <motion.div 
          className="action-card" 
          whileHover={cardHover}
          whileTap={{ scale: 0.98 }}
        >
          <FaMagic className="action-icon" size={30} />
          <h3 className="action-title">AI Assistant</h3>
          <p className="action-subtitle">Get health insights</p>
        </motion.div>
      </Link>

      {/* Card 4: Appointments */}
      <Link href="/appointments" className="action-card-link" passHref>
        <motion.div 
          className="action-card" 
          whileHover={cardHover}
          whileTap={{ scale: 0.98 }}
          style={{ position: 'relative' }}
        >
          <NotificationBadge count={upcomingAppointments} pulse={false} />
          <FaUserMd className="action-icon" size={30} />
          <h3 className="action-title">Appointments</h3>
          <p className="action-subtitle">
            {upcomingAppointments > 0 ? `${upcomingAppointments} upcoming` : 'Manage your visits'}
          </p>
        </motion.div>
      </Link>
    </div>
  )
}

export default SmartActions
