'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, BarChart3, Globe, Target, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function AuthVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* Decorative Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]" 
      />

      {/* Center Container for Floating Cards */}
      <div className="relative w-full max-w-sm h-[500px]">
        
        {/* Card 1: Main Competitor Alert */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-4 left-0 right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl z-30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Threat Detected</h4>
                <p className="text-slate-400 text-xs">Monday.com pricing change</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-rose-500/20 text-rose-400 rounded-md">HIGH</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '85%' }} 
                transition={{ duration: 1.5, delay: 1 }}
                className="h-full bg-gradient-to-r from-rose-500 to-orange-500"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Impact Probability</span>
              <span>85%</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Market Share Chart */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute top-36 -right-12 w-64 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl z-20"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-slate-200 font-medium text-xs">Market Sentiment</h4>
          </div>
          <div className="flex items-end gap-2 h-20">
            {[40, 70, 45, 90, 65, 85].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1, delay: 1 + (i * 0.1) }}
                className={`w-full rounded-t-sm ${i === 3 ? 'bg-blue-500' : 'bg-white/10'}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Card 3: Execution Plan */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-12 -left-8 w-72 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-2xl z-40"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <h4 className="text-white font-medium text-sm">AI Counter-Strategy</h4>
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Target className="w-4 h-4 text-blue-300 opacity-50" />
            </motion.div>
          </div>
          <p className="text-xs text-blue-200/70 mb-3 leading-relaxed">
            Deploy "Enterprise Security" campaign targeting ClickUp's recent compliance page removal.
          </p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-500/20">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#0a0a0a] ${i===1?'bg-blue-500':i===2?'bg-purple-500':'bg-emerald-500'}`} />
              ))}
            </div>
            <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider">Ready to Execute</span>
          </div>
        </motion.div>

        {/* Scanning Line Animation */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-[-20%] right-[-20%] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent z-50 opacity-50 pointer-events-none"
          style={{ boxShadow: '0 0 20px 2px rgba(59, 130, 246, 0.5)' }}
        />

      </div>
    </div>
  )
}
