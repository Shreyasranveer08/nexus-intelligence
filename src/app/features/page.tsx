'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, CheckCircle2, ShieldCheck, Target, TrendingUp } from 'lucide-react'
import { getUserProfile } from '@/app/actions'
import MarketingNavbar from '@/components/MarketingNavbar'
import MarketingFooter from '@/components/MarketingFooter'
import Link from 'next/link'

export default function FeaturesPage() {
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
        
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
            The intelligence engine that powers market leaders
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Stop relying on manual research and outdated spreadsheets. NexusIntel automatically tracks, analyzes, and strategizes against your competitors in real-time.
          </p>
        </div>

        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full mb-32">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full"></div>
            <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                <Activity className="text-blue-500 w-5 h-5" />
                <span className="font-semibold text-white">Live Intelligence Feed</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <div className="text-sm font-semibold text-white mb-1">Competitor X launched AI workflows</div>
                  <div className="text-xs text-slate-400">Detected 2 hours ago via Homepage changes</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <div className="text-sm font-semibold text-white mb-1">Competitor Y increased Enterprise pricing</div>
                  <div className="text-xs text-slate-400">Detected 5 hours ago via Pricing page</div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Continuous Signal Tracking</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              We monitor your competitors' websites, pricing pages, press releases, and job boards 24/7. When a strategic shift occurs, we catch it instantly. No more blind spots.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Pricing Changes & Packaging
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Product & Feature Launches
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Executive Hiring Trends
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full mb-32">
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">AI Execution Plans</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Raw data is useless without context. Our proprietary AI analyzes the signals, determines the threat level, and generates a concrete execution plan for your team to counter-attack.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Target className="w-5 h-5 text-purple-500" /> Automated Sales Battlecards
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck className="w-5 h-5 text-purple-500" /> Churn Risk Mitigation
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <TrendingUp className="w-5 h-5 text-purple-500" /> Product Roadmap Recommendations
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full"></div>
            <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
               <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                <Zap className="text-purple-500 w-5 h-5" />
                <span className="font-semibold text-white">Execution Plan Generated</span>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Priority Action</div>
                  <div className="text-sm text-white font-medium mb-1">Target Competitor X Pro Tier</div>
                  <div className="text-xs text-slate-400 leading-relaxed">Competitor X raised prices by 20%. Launch a grandfathered pricing campaign targeting their mid-market customers immediately.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full max-w-4xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Stop guessing. Start executing.</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto relative z-10">
            Join the forward-thinking companies who use NexusIntel to maintain their competitive advantage in rapidly shifting markets.
          </p>
          <Link href="/auth/signup" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-bold rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform relative z-10">
            Start Your Free Trial
          </Link>
        </div>

      </main>

      <MarketingFooter />
    </div>
  )
}
