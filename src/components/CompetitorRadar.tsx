'use client'

import React from 'react'
import { Radar, Activity, Target, AlertTriangle } from 'lucide-react'

export default function CompetitorRadar({ data }: { data: any }) {
  const radar = data.competitorRadar;

  if (!radar || radar.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center gap-2 mb-2">
        <Radar className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Competitor Radar</h3>
      </div>

      <div className="flex flex-col gap-3">
        {radar.map((comp: any, idx: number) => (
          <div key={idx} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-xl p-4 transition-colors shadow-sm">
            
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-900 dark:text-white text-sm">{comp.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                comp.threatLevel === 'Critical' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' :
                comp.threatLevel === 'High' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                comp.threatLevel === 'Medium' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' :
                'bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20'
              }`}>
                {comp.threatLevel} Threat
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-3">
              <div>
                <span className="text-slate-500 block mb-0.5">Activity Score</span>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{comp.activityScore}/100</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Last Change</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium truncate block">{comp.lastChange}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-2.5 flex items-start gap-2">
              <Target className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">Recommended Response</span>
                <span className="text-xs text-slate-900 dark:text-white font-medium leading-snug">{comp.recommendedResponse}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
