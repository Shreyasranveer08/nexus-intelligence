'use client'

import { useState } from 'react'
import { TrendingUp, Building2, Archive } from 'lucide-react'
import MarketIntelligenceTab from './MarketIntelligenceTab'
import CompetitorReportsTab from './CompetitorReportsTab'
import HistoricalArchiveTab from './HistoricalArchiveTab'
import GenerateReportButton from '@/components/GenerateReportButton'

export default function ReportsDashboard({ 
  reports, 
  competitors 
}: { 
  reports: any[], 
  competitors: any[] 
}) {
  const [activeTab, setActiveTab] = useState<'market' | 'competitors' | 'archive'>('market')

  // Split active and archived competitors
  const activeCompetitors = competitors.filter(c => c.status === 'active' || !c.status)
  const archivedCompetitors = competitors.filter(c => c.status === 'archived')

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Weekly Intelligence</h2>
          <p className="text-slate-500 dark:text-slate-400">AI-generated market summaries and competitor analysis.</p>
        </div>
        <GenerateReportButton competitors={activeCompetitors} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-slate-200 dark:border-white/10 pb-px">
        <button
          onClick={() => setActiveTab('market')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'market' 
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Market Intelligence
        </button>
        <button
          onClick={() => setActiveTab('competitors')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'competitors' 
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Competitor Reports
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'archive' 
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Archive className="w-4 h-4" />
          Historical Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'market' && (
          <MarketIntelligenceTab reports={reports.filter(r => !r.type || r.type === 'market')} />
        )}
        {activeTab === 'competitors' && (
          <CompetitorReportsTab reports={reports} competitors={activeCompetitors} />
        )}
        {activeTab === 'archive' && (
          <HistoricalArchiveTab reports={reports} archivedCompetitors={archivedCompetitors} />
        )}
      </div>
    </div>
  )
}
