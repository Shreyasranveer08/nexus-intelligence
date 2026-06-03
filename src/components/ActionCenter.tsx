'use client'

import React from 'react'
import { Zap, CheckCircle2, Circle, ArrowRight } from 'lucide-react'

export default function ActionCenter({ data }: { data: any }) {
  const actions = data.actionCenter;

  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Action Center</h3>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action: any) => (
          <div key={action.id} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-xl p-4 transition-colors group cursor-pointer shadow-sm">
            
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                action.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                action.status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' :
                'bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20'
              }`}>
                {action.status}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{action.priority} Priority</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {action.recommendedMove}
            </h4>
            <p className="text-xs text-slate-500 mb-4">Source: {action.sourceCompetitor}</p>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              <span className="flex items-center gap-1.5">
                {action.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4" />}
                {action.status === 'Completed' ? 'Execution Plan Saved' : 'View Execution Plan'}
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300" />
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
