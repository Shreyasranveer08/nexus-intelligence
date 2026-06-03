'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Lightbulb, Trophy, ArrowRight, Activity, LineChart, ShieldAlert, Target } from 'lucide-react'

const feedEvents = [
  {
    id: 1,
    type: 'threat',
    icon: <Flame className="w-4 h-4 text-rose-500" />,
    title: 'Strategic Move',
    competitor: 'Microsoft',
    event: 'Microsoft expands Copilot integrations across all enterprise workflows.',
    impact: 'Increased enterprise AI adoption pressure across SaaS markets.',
    action: 'Accelerate proprietary AI feature roadmap for Q3 release.',
    time: '2m ago'
  },
  {
    id: 2,
    type: 'opportunity',
    icon: <Lightbulb className="w-4 h-4 text-emerald-500" />,
    title: 'Market Opportunity',
    competitor: 'Google',
    event: 'Google introduces radically new AI search capabilities.',
    impact: 'Growing demand for AI-native user experiences.',
    action: 'Audit current platform search flows for AI enhancement.',
    time: '15m ago'
  },
  {
    id: 3,
    type: 'signal',
    icon: <Target className="w-4 h-4 text-purple-500" />,
    title: 'Product Launch',
    competitor: 'OpenAI',
    event: 'OpenAI releases highly anticipated new enterprise capabilities.',
    impact: 'Higher expectations around AI productivity features.',
    action: 'Deploy counter-messaging focused on data privacy & compliance.',
    time: '45m ago'
  },
  {
    id: 4,
    type: 'alert',
    icon: <Activity className="w-4 h-4 text-orange-500" />,
    title: 'Hiring Signal',
    competitor: 'NVIDIA',
    event: 'NVIDIA expands AI infrastructure hiring by 40%.',
    impact: 'Continued acceleration of AI infrastructure investment.',
    action: 'Review compute partnerships and reserve capacity.',
    time: '1h ago'
  }
];

export default function LiveIntelligenceEngine() {
  const [mounted, setMounted] = useState(false);
  const [activeEvents, setActiveEvents] = useState<typeof feedEvents>([]);

  useEffect(() => {
    setMounted(true);
    setActiveEvents([feedEvents[0]]);
    
    const interval = setInterval(() => {
      setActiveEvents(prev => {
        // filter out any undefined just in case (e.g. from HMR)
        const validPrev = prev.filter(Boolean);
        if (validPrev.length >= feedEvents.length) {
          clearInterval(interval);
          return validPrev;
        }
        return [feedEvents[validPrev.length], ...validPrev];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col gap-10">
      
      {/* Global Monitoring Stats */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3 text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium uppercase tracking-widest">Active Surveillance</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex gap-4 text-xs text-slate-400 font-mono">
          <span className="text-slate-300 font-semibold">1,284</span> SIGNALS
          <span className="text-slate-300 font-semibold ml-2">42</span> INDUSTRIES
          <span className="text-slate-300 font-semibold ml-2">300+</span> COMPANIES
        </div>
      </div>

      {/* Today's Intelligence Dashboard Preview */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-medium text-slate-300 uppercase tracking-widest">Intelligence Overview</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start gap-3 hover:bg-white/[0.04] transition-colors">
            <Flame className="w-5 h-5 text-rose-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 mb-1">Biggest Threat</p>
              <p className="text-sm font-medium text-slate-200">Monday.com Pricing Shift</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start gap-3 hover:bg-white/[0.04] transition-colors">
            <Lightbulb className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 mb-1">Biggest Opportunity</p>
              <p className="text-sm font-medium text-slate-200">Asana Enterprise Downtime</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start gap-3 hover:bg-white/[0.04] transition-colors">
            <Trophy className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 mb-1">Most Active Competitor</p>
              <p className="text-sm font-medium text-slate-200">ClickUp (12 Signals)</p>
            </div>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3 hover:bg-blue-900/30 transition-colors cursor-pointer group">
            <ArrowRight className="w-5 h-5 text-blue-400 mt-0.5 group-hover:translate-x-1 transition-transform" />
            <div>
              <p className="text-xs text-blue-300/70 mb-1">Priority Action</p>
              <p className="text-sm font-medium text-blue-100">Review 3 Counter-Strategies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Intelligence Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-medium text-slate-300 uppercase tracking-widest">Live Intelligence Feed</h2>
            <span className="ml-2 px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] uppercase tracking-wider text-blue-400 font-semibold">Sample Intelligence</span>
          </div>
        </div>

        <div className="space-y-3 relative">
          <AnimatePresence initial={false}>
            {activeEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] transition-colors relative overflow-hidden group"
              >
                {/* Subtle left border color indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  event.type === 'threat' ? 'bg-rose-500/50' : 
                  event.type === 'opportunity' ? 'bg-emerald-500/50' : 
                  event.type === 'alert' ? 'bg-orange-500/50' : 'bg-blue-500/50'
                }`} />
                
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {event.icon}
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{event.title}</span>
                    <span className="text-xs text-slate-500 px-2 py-0.5 bg-white/5 rounded-full">{event.competitor}</span>
                  </div>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </div>
                
                <p className="text-slate-200 text-sm font-medium mb-4 leading-relaxed">{event.event}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Potential Impact</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{event.impact}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Recommended Action</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{event.action}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
