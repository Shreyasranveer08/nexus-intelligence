'use client'

import React from 'react'
import Link from 'next/link'
import { Hexagon, ArrowRight } from 'lucide-react'

export default function MarketingNavbar({ authProfile }: { authProfile?: any }) {
  return (
    <header className="w-full h-20 flex items-center justify-between px-6 lg:px-12 relative z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0">
      <div className="flex items-center gap-10">
        <Link href="/welcome" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Hexagon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">NexusIntel</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/features" className="text-slate-400 hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/analyze" className="text-slate-400 hover:text-white transition-colors">Analyze Website</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {!authProfile?.is_authenticated ? (
          <>
            <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/auth/signup" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center group">
              Start Free
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </>
        ) : (
          <>
            {authProfile.onboarding_status === 'completed' ? (
              <Link href="/" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center group">
                Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link href="/onboarding" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(5,150,105,0.3)] transition-all flex items-center group">
                Continue Setup
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  )
}
