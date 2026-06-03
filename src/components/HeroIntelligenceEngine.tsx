'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Lightbulb, Trophy, ArrowRight, Activity, LineChart, ShieldAlert, Target, Zap, Clock } from 'lucide-react'

const feedEvents = [
  {
    id: 1,
    type: 'threat',
    icon: <Flame className="w-4 h-4 text-rose-500" />,
    title: 'Strategic Move',
    competitor: 'Microsoft',
    event: 'Microsoft expands Copilot integrations across all enterprise workflows.',
    time: '2m ago'
  },
  {
    id: 2,
    type: 'opportunity',
    icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
    title: 'Vulnerability Detected',
    competitor: 'Monday.com',
    event: 'Monday.com increases Pro pricing by 18%. High churn risk identified.',
    time: '14m ago'
  },
  {
    id: 3,
    type: 'action',
    icon: <Target className="w-4 h-4 text-emerald-500" />,
    title: 'Product Launch',
    competitor: 'Notion',
    event: 'Notion releases native charts and advanced reporting features.',
    time: '1h ago'
  },
  {
    id: 4,
    type: 'alert',
    icon: <ShieldAlert className="w-4 h-4 text-purple-500" />,
    title: 'Market Shift',
    competitor: 'Salesforce',
    event: 'Salesforce shifts positioning away from SMBs towards enterprise data lakes.',
    time: '2h ago'
  }
];

const topInsights = [
  {
    label: "Biggest Threat",
    value: "Microsoft Copilot Expansion",
    icon: Flame,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
  },
  {
    label: "Biggest Opportunity",
    value: "Monday.com Pricing Hike",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    label: "Most Active",
    value: "Notion",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    label: "Priority Action",
    value: "Launch Pricing Campaign",
    icon: Target,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  }
];

export default function HeroIntelligenceEngine() {
  const [mounted, setMounted] = useState(false);
  const [activeEvents, setActiveEvents] = useState<typeof feedEvents>([]);

  useEffect(() => {
    setMounted(true);
    setActiveEvents([feedEvents[0]]);
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < feedEvents.length) {
        setActiveEvents(prev => [feedEvents[currentIndex], ...prev]);
      } else {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col gap-6 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_50px_rgba(37,99,235,0.15)] relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Executive Briefing</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Real-time Analysis</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          Live
        </span>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {topInsights.map((insight, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-2 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${insight.bg} ${insight.border} border`}>
                <insight.icon className={`w-3 h-3 ${insight.color}`} />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{insight.label}</span>
            </div>
            <span className="text-sm font-medium text-slate-200 truncate pr-2">{insight.value}</span>
          </div>
        ))}
      </div>

      {/* Live Feed */}
      <div className="flex flex-col mt-2">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Clock className="w-3 h-3" /> Intelligence Feed
        </h3>
        <div className="relative border-l-2 border-white/5 pl-4 ml-2 space-y-4">
          <AnimatePresence initial={false}>
            {activeEvents.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                className={`relative ${idx === 0 ? 'opacity-100' : 'opacity-50 grayscale-[50%]'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-white/10 ring-4 ring-[#0a0a0a]"></div>
                
                <div className="bg-[#111] border border-white/5 rounded-xl p-3 shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-white/5">
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold text-white">{item.competitor}</span>
                      <span className="text-[10px] font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}
