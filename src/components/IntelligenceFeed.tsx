'use client'

import React from 'react'
import { Clock, Zap, Brain, Target } from 'lucide-react'

export default function IntelligenceFeed({ data }: { data: any }) {
  const feed = data.liveFeed;

  if (!feed || feed.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Live Intelligence Feed</h3>
      </div>

      <div className="flex flex-col gap-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-slate-200 dark:before:bg-white/5">
        {feed.map((item: any, idx: number) => (
          <div key={item.id} className="relative pl-12 group">
            
            {/* Timeline Dot */}
            <div className={`absolute left-[15px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-[#0a0a0a] ${
              item.impact === 'critical' ? 'bg-rose-500' : 
              item.impact === 'high' ? 'bg-amber-500' : 
              item.impact === 'medium' ? 'bg-blue-500' : 'bg-slate-500'
            }`}></div>

            <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 group-hover:border-slate-300 dark:group-hover:border-white/10 rounded-xl p-5 shadow-lg transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-slate-900 dark:text-white text-sm bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md">{item.competitor}</span>
                <span className="text-xs text-slate-500 font-medium">{item.time}</span>
              </div>

              <div className="flex flex-col gap-4">
                {/* What Changed */}
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">What Changed</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{item.whatChanged}</p>
                  </div>
                </div>

                {/* Why It Matters */}
                <div className="flex items-start gap-3">
                  <Brain className="w-4 h-4 text-purple-500 dark:text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[10px] font-bold text-purple-600 dark:text-purple-500 uppercase tracking-wider mb-1">Why It Matters</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{item.whyItMatters}</p>
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-500/5 -mx-5 -mb-5 p-5 border-t border-blue-100 dark:border-blue-500/10 rounded-b-xl">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Recommended Action</h4>
                    <p className="text-sm text-blue-900 dark:text-blue-100 leading-snug">{item.recommendedAction}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
