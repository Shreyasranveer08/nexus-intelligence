'use client'

import { useState } from 'react'
import { Calendar, AlertTriangle, Building2, Search, Filter } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function CompetitorReportsTab({ reports, competitors }: { reports: any[], competitors: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [threatFilter, setThreatFilter] = useState('All')

  // We group reports by competitor, getting the latest one for each, or just list them all.
  // The user wants "Competitor Cards, Search, Filter by Threat Level"
  const competitorReports = reports.filter(r => r.type === 'competitor' || r.competitor_id)

  const filteredReports = competitorReports.filter(report => {
    const compName = competitors.find(c => c.id === report.competitor_id)?.name || 'Unknown'
    const matchesSearch = compName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (report.title && report.title.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const threatLevel = report.structured_data?.threat_level || 'Unknown'
    const matchesThreat = threatFilter === 'All' || threatLevel === threatFilter

    return matchesSearch && matchesThreat
  })

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search competitors or reports..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
          >
            <option value="All">All Threat Levels</option>
            <option value="High">High Threat</option>
            <option value="Medium">Medium Threat</option>
            <option value="Low">Low Threat</option>
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl p-16 text-center shadow-sm dark:shadow-xl transition-colors">
          <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No competitor reports found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or generate new reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredReports.map((report: any) => {
            const comp = competitors.find(c => c.id === report.competitor_id)
            const sd = report.structured_data || {}
            
            const threatColor = sd.threat_level === 'High' 
              ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'
              : sd.threat_level === 'Medium'
              ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
              : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'

            return (
              <div key={report.id} className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl transition-colors flex flex-col md:flex-row">
                
                {/* Left Panel: Summary */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-500" />
                      {comp?.name || 'Unknown'}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    <span suppressHydrationWarning>
                      {new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {sd.threat_level && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${threatColor} mb-6`}>
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                      {sd.threat_level} Threat
                    </div>
                  )}

                  {sd.biggest_change && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Biggest Change</p>
                      <p className="text-sm text-slate-900 dark:text-slate-200 font-medium">{sd.biggest_change}</p>
                    </div>
                  )}

                  {sd.why_it_matters && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Why It Matters</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{sd.why_it_matters}</p>
                    </div>
                  )}
                </div>

                {/* Right Panel: Analysis */}
                <div className="p-6 md:w-2/3 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {sd.opportunity && (
                      <div className="bg-blue-50/50 dark:bg-blue-500/5 p-4 rounded-xl border border-blue-100 dark:border-blue-500/10">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase tracking-wider">Opportunity</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{sd.opportunity}</p>
                      </div>
                    )}
                    {sd.recommended_action && (
                      <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/10">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1 uppercase tracking-wider">Recommended Action</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{sd.recommended_action}</p>
                      </div>
                    )}
                  </div>

                  {sd.supporting_evidence && sd.supporting_evidence.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2 uppercase tracking-wider">Supporting Evidence</p>
                      <ul className="list-disc pl-4 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {sd.supporting_evidence.map((ev: string, i: number) => <li key={i}>{ev}</li>)}
                      </ul>
                    </div>
                  )}

                  {report.markdown_body && (
                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-white/5">
                      <details className="group cursor-pointer">
                        <summary className="text-sm font-medium text-blue-600 dark:text-blue-400 outline-none flex items-center">
                          <span className="group-open:hidden">View Full Analysis</span>
                          <span className="hidden group-open:inline">Hide Full Analysis</span>
                        </summary>
                        <div className="mt-4 prose dark:prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{report.markdown_body}</ReactMarkdown>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
