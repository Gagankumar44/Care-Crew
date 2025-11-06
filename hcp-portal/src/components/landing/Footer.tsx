'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github, Mail, Facebook } from 'lucide-react'
import { MediARLogo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="bg-neutral-900 dark:bg-black text-neutral-300 border-t border-neutral-800 relative overflow-visible w-full z-10">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-health/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <MediARLogo size={40} animated={true} />
              <span className="text-2xl font-semibold text-white">Care Crew</span>
            </Link>
            <p className="text-neutral-400 mb-6 max-w-md leading-relaxed">
              Revolutionizing healthcare with AI and AR technology. 
              Bringing medical expertise to your fingertips.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 glass flex items-center justify-center transition-apple">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 glass flex items-center justify-center transition-apple">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 glass flex items-center justify-center transition-apple">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 glass flex items-center justify-center transition-apple">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="hover:text-white transition-apple">Features</Link></li>
              <li><Link href="#testimonials" className="hover:text-white transition-apple">Testimonials</Link></li>
              <li><Link href="#why-us" className="hover:text-white transition-apple">Why Us</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-apple">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-white transition-apple">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-apple">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-apple">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-apple">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} Care Crew. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-apple">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-apple">Terms of Service</Link>
            <Link href="/hipaa" className="hover:text-white transition-apple">HIPAA Compliance</Link>
          </div>
        </div>

        {/* HIPAA Disclaimer */}
        <div className="mt-8 p-6 glass-dark rounded-2xl border border-neutral-700/50">
          <p className="text-xs text-neutral-400 leading-relaxed">
            <strong className="text-neutral-300">HIPAA Compliance:</strong> Care Crew is fully compliant with 
            the Health Insurance Portability and Accountability Act (HIPAA). All patient data is encrypted, 
            securely stored, and handled according to strict medical privacy standards. This platform is 
            designed for healthcare providers and patients who require HIPAA-compliant telehealth solutions.
          </p>
        </div>
      </div>
    </footer>
  )
}

