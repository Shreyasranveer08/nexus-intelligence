'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getUserProfile } from '@/app/actions'
import MarketingNavbar from '@/components/MarketingNavbar'
import MarketingFooter from '@/components/MarketingFooter'

export default function PricingPage() {
  const [authProfile, setAuthProfile] = useState<any>(null)

  useEffect(() => {
    getUserProfile().then(profile => {
      setAuthProfile(profile)
    })
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col overflow-x-hidden relative font-sans selection:bg-blue-500/30">
      
      {/* Deep Environment Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full"></div>
      </div>

      <MarketingNavbar authProfile={authProfile} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Simple pricing for strategic teams
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the intelligence plan that fits your growth stage. All plans include real-time monitoring and AI-generated executive briefings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-24">
          
          {/* Starter Plan */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
            <p className="text-sm text-slate-400 mb-6">For early-stage startups monitoring direct rivals.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$49</span>
              <span className="text-slate-400">/mo</span>
            </div>
            <Link href="/auth/signup" className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg text-center transition-colors mb-8">
              Start Free Trial
            </Link>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Track up to 3 competitors</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Weekly Intelligence Reports</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Live Executive Briefing</span>
              </div>
            </div>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-[#111] border border-blue-500/30 rounded-2xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(37,99,235,0.15)] transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-sm text-slate-400 mb-6">For scaling teams that need execution plans.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$149</span>
              <span className="text-slate-400">/mo</span>
            </div>
            <Link href="/auth/signup" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-center transition-colors mb-8 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Get Started
            </Link>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Track up to 10 competitors</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Daily Intelligence Feed</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">AI Execution Plans & Battlecards</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Competitor Radar Dashboard</span>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
            <p className="text-sm text-slate-400 mb-6">For large organizations requiring market dominance.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">Custom</span>
              <span className="text-slate-400"></span>
            </div>
            <Link href="#" className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg text-center transition-colors mb-8">
              Contact Sales
            </Link>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Unlimited competitors</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Custom data sources (News, SEC)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">Dedicated intelligence analyst</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-300">SSO & Advanced Security</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      <MarketingFooter />
    </div>
  )
}
