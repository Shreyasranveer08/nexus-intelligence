'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Hexagon, ArrowRight, Activity, Zap, Brain, Search, Target, CheckCircle2, TrendingUp, Briefcase, Handshake, Building2, ShieldCheck, PieChart, MessageSquare, Cpu } from 'lucide-react'
import { getUserProfile } from '@/app/actions'
import HeroIntelligenceEngine from '@/components/HeroIntelligenceEngine'
import MarketingNavbar from '@/components/MarketingNavbar'
import MarketingFooter from '@/components/MarketingFooter'

const MONITORS = [
  { name: 'Pricing Changes', icon: TrendingUp },
  { name: 'Product Launches', icon: Zap },
  { name: 'Hiring Expansion', icon: Briefcase },
  { name: 'Partnerships', icon: Handshake },
  { name: 'Acquisitions', icon: Building2 },
  { name: 'Enterprise Expansion', icon: Target },
  { name: 'Security Updates', icon: ShieldCheck },
  { name: 'Market Positioning', icon: PieChart },
  { name: 'Customer Feedback Trends', icon: MessageSquare },
  { name: 'AI Initiatives', icon: Cpu }
]

export default function WelcomePage() {
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
        
        {/* 1. SPLIT HERO SECTION */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-xs uppercase tracking-wider mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              Live Intelligence Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
              Know what competitors are doing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">before your customers do.</span>
            </h1>
            
            <p className="text-xl text-slate-400 font-medium mb-10 max-w-lg leading-relaxed">
              We continuously monitor the market, analyze shifts in real-time, and generate actionable execution plans so you never lose your strategic edge.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {!authProfile?.is_authenticated ? (
                <>
                  <Link href="/auth/signup" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center group">
                    Start Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              ) : (
                <>
                  {authProfile.onboarding_status === 'completed' ? (
                    <Link href="/" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center group">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <Link href="/onboarding" className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-all flex items-center justify-center group">
                      Continue Setup
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </>
              )}
              <Link href="/analyze" className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-all flex items-center justify-center">
                Analyze Any Website
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:pl-10"
          >
            <HeroIntelligenceEngine />
          </motion.div>
        </div>

        {/* 2. CREDIBILITY / MONITORS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mb-40 text-center"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-10">We continuously monitor</p>
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {MONITORS.map((monitor, idx) => (
              <div key={idx} className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.06] transition-colors group cursor-default">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 group-hover:animate-ping"></div>
                <monitor.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{monitor.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. PRODUCT WALKTHROUGH (Horizontal Pipeline) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-6xl mx-auto mb-32"
        >
          <h2 className="text-3xl font-bold text-center mb-16">How Intelligence Becomes Action</h2>
          
          <div className="relative flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4">
            
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-[28px] left-[50px] right-[50px] h-0.5 bg-gradient-to-r from-white/5 via-blue-500/30 to-white/5 -z-10">
              <div className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[marquee_3s_linear_infinite]"></div>
            </div>

            {[
              { 
                step: 1,
                title: "Competitor", 
                desc: "We track their public footprint across pricing, careers, and product releases.",
                icon: Search
              },
              { 
                step: 2,
                title: "AI Analysis", 
                desc: "Models detect hidden shifts, like a quiet move upmarket.",
                icon: Brain
              },
              { 
                step: 3,
                title: "Strategic Insight", 
                desc: "Raw data is converted into 'Why does this matter to you?'",
                icon: Target
              },
              { 
                step: 4,
                title: "Recommended Action", 
                desc: "We generate targeted counter-moves for your sales and product teams.",
                icon: Zap
              },
              { 
                step: 5,
                title: "Execution Plan", 
                desc: "Export battlecards and roadmaps instantly.",
                icon: CheckCircle2
              }
            ].map((phase, idx) => (
              <div key={idx} className="flex flex-col items-center text-center w-full md:w-1/5 relative group">
                {/* Mobile Connecting Line */}
                {idx !== 0 && (
                  <div className="md:hidden absolute -top-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-white/5 to-blue-500/30 -z-10 -translate-x-1/2"></div>
                )}
                
                <div className="w-14 h-14 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center mb-6 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all">
                  <phase.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                
                <h3 className="text-sm font-bold text-white mb-2">{phase.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">{phase.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </main>
      <MarketingFooter />
    </div>
  )
}
