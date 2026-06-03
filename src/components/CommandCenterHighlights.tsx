'use client'

import React from 'react'
import { AlertTriangle, Lightbulb, Activity, Zap } from 'lucide-react'

export default function CommandCenterHighlights({ data }: { data: any }) {
  const briefing = data.executiveBriefing;

  if (!briefing) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Biggest Threat */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-red-500/20 rounded-xl p-5 hover:border-red-500/40 dark:hover:border-red-500/40 transition-colors flex flex-col shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">Biggest Threat</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">{briefing.biggestThreat?.headline || 'No threats detected'}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 flex-1">{briefing.biggestThreat?.explanation || 'Add more competitors or wait for new insights.'}</p>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500">Impact:</span>
          <span className="text-red-500 dark:text-red-400">{briefing.biggestThreat?.impact || '-'}</span>
        </div>
      </div>

      {/* Biggest Opportunity */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-emerald-500/20 rounded-xl p-5 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-colors flex flex-col shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">Biggest Opportunity</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">{briefing.biggestOpportunity?.headline || 'No opportunities detected'}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 flex-1">{briefing.biggestOpportunity?.explanation || 'Add more competitors or wait for new insights.'}</p>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500">Impact:</span>
          <span className="text-emerald-500 dark:text-emerald-400">{briefing.biggestOpportunity?.impact || '-'}</span>
        </div>
      </div>

      {/* Most Active */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-blue-500/20 rounded-xl p-5 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-colors flex flex-col shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">Most Active</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">{briefing.mostActive?.headline || 'No activity detected'}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 flex-1">{briefing.mostActive?.explanation || 'Add more competitors or wait for new insights.'}</p>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500">Impact:</span>
          <span className="text-blue-600 dark:text-blue-400">{briefing.mostActive?.impact || '-'}</span>
        </div>
      </div>

      {/* Priority Action */}
      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-purple-500/20 rounded-xl p-5 hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-colors flex flex-col relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-purple-50 dark:bg-purple-500/5 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/10 transition-colors"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-500" />
            <span className="font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase text-xs">Priority Action</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">{briefing.priorityAction?.headline || 'No actions recommended'}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 flex-1">{briefing.priorityAction?.explanation || 'Add more competitors or wait for new insights.'}</p>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500">Impact:</span>
            <span className="text-purple-600 dark:text-purple-400">{briefing.priorityAction?.impact || '-'}</span>
          </div>
        </div>
      </div>

    </div>
  )
}
