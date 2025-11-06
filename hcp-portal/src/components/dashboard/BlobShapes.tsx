'use client'

import React from 'react'

/**
 * BlobShapes - Organic blob shapes for artistic background
 * Enhanced colors that will show through frosted glass cards
 * Uses organic color palette: Forest Green, Mint/Teal, Terracotta
 */
export function BlobShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Forest Green Blob - Top Right */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 opacity-[0.25]"
        style={{
          background: 'radial-gradient(circle, rgba(44, 95, 45, 0.8) 0%, rgba(44, 95, 45, 0.3) 50%, transparent 80%)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          filter: 'blur(60px)',
          animation: 'blob-float 20s ease-in-out infinite',
        }}
      />
      
      {/* Mint/Teal Blob - Left Side */}
      <div
        className="absolute top-1/3 -left-32 w-80 h-80 opacity-[0.2]"
        style={{
          background: 'radial-gradient(circle, rgba(153, 237, 195, 0.8) 0%, rgba(153, 237, 195, 0.3) 50%, transparent 80%)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(80px)',
          animation: 'blob-float 25s ease-in-out infinite reverse',
        }}
      />
      
      {/* Terracotta Blob - Bottom Right */}
      <div
        className="absolute bottom-20 right-1/4 w-72 h-72 opacity-[0.22]"
        style={{
          background: 'radial-gradient(circle, rgba(224, 122, 95, 0.8) 0%, rgba(224, 122, 95, 0.3) 50%, transparent 80%)',
          borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
          filter: 'blur(70px)',
          animation: 'blob-float 18s ease-in-out infinite',
        }}
      />

      {/* Additional smaller blobs for more depth */}
      {/* Forest Green accent - Center */}
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, rgba(44, 95, 45, 0.6) 0%, transparent 70%)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          filter: 'blur(50px)',
          animation: 'blob-float 22s ease-in-out infinite',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Mint accent - Top Left */}
      <div
        className="absolute top-20 left-20 w-56 h-56 opacity-[0.18]"
        style={{
          background: 'radial-gradient(circle, rgba(153, 237, 195, 0.7) 0%, transparent 70%)',
          borderRadius: '40% 60% 60% 40% / 70% 30% 70% 30%',
          filter: 'blur(45px)',
          animation: 'blob-float 15s ease-in-out infinite reverse',
        }}
      />

      {/* CSS Animation for floating effect */}
      <style jsx>{`
        @keyframes blob-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
    </div>
  )
}

