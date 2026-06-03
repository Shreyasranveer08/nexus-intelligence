'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Globe, ArrowRight } from 'lucide-react'

export default function WeeklyIntelligence({ data }: { data: any }) {
  const intel = data.weeklyIntelligence;

  if (!intel) return null;

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Intelligence Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Competitor Reports */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Competitor Intelligence</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Deep-dives on specific competitors</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {intel.competitorReports.map((report: any) => (
              <Link href="/reports" key={report.id} className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-500/30 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none cursor-pointer transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white mb-1 transition-colors">{report.name}</h4>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{report.date}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Market Reports */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Market Intelligence</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Macro trends and industry shifts</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {intel.marketReports.map((report: any) => (
              <Link href="/reports" key={report.id} className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-purple-300 dark:hover:border-purple-500/30 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none cursor-pointer transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-white mb-1 transition-colors">{report.name}</h4>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{report.date}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
